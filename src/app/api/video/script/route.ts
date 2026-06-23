import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";
import { checkGenerationLimit } from "@/lib/subscription-guard";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

// 短视频类型模板
const videoTypes: Record<string, { name: string; length: string }> = {
  product_promo: { name: "产品推广", length: "15-60秒" },
  educational: { name: "知识科普", length: "30-120秒" },
  vlog: { name: "Vlog日常", length: "30-180秒" },
  story: { name: "剧情故事", length: "60-180秒" },
  tutorial: { name: "教程教学", length: "30-120秒" },
  trending: { name: "热点追评", length: "15-60秒" },
  before_after: { name: "对比展示", length: "15-45秒" },
  unboxing: { name: "开箱测评", length: "30-120秒" },
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check usage limits
  const limitCheck = await checkGenerationLimit();
  if (!limitCheck.allowed) {
    return NextResponse.json({
      error: "本月AI生成次数已达上限，请升级专业版获取更多额度",
      limitReached: true,
    }, { status: 403 });
  }

  try {
    const { topic, videoType, platform, tone, targetAudience } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "请输入主题" }, { status: 400 });
    }

    const typeInfo = videoTypes[videoType as string] || { name: "通用", length: "15-120秒" };
    const platformName = platform === "douyin" ? "抖音" 
      : platform === "tiktok" ? "TikTok" 
      : platform === "kuaishou" ? "快手" 
      : "短视频平台";

    const systemPrompt = `你是资深短视频编导和脚本创作专家。擅长为${platformName}创作高转化、高完播率的短视频脚本。

要求：
- 前3秒必须有强钩子（黄金开场）
- 节奏紧凑，每5-10秒一个信息点切换
- 针对${platformName}算法优化（完播率、互动率）
- 适合${typeInfo.length}时长的内容密度
- 包含画面描述、口播文案、字幕要点`;

    const userPrompt = `请为以下主题创作一个${typeInfo.name}类短视频脚本：

主题：${topic}
视频类型：${typeInfo.name}
目标平台：${platformName}
时长：${typeInfo.length}
语气：${tone || "自然真实"}
目标观众：${targetAudience || "泛人群"}

返回JSON格式（不要用代码块包裹）：
{
  "title": "视频标题（吸引点击的爆款标题）",
  "hook": "前3秒钩子文案",
  "description": "视频简介文案（包含关键词）",
  "hashtags": ["标签1","标签2","标签3","标签4","标签5"],
  "keyPoints": ["核心卖点1","核心卖点2","核心卖点3"],
  "script": [
    {
      "time": "00:00-00:05",
      "scene": "画面描述",
      "narration": "口播文案",
      "captions": "字幕要点",
      "music": "配乐建议",
      "action": "拍摄动作/运镜说明"
    }
  ],
  "cta": "引导互动/关注的话术",
  "thumbnailIdeas": ["封面图方案1","封面图方案2"],
  "tiktokTips": ["针对平台的优化建议"]
}`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 8192,
    });

    let result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    result = result.trim();
    if (result.startsWith("```json")) result = result.slice(7);
    else if (result.startsWith("```")) result = result.slice(3);
    if (result.endsWith("```")) result = result.slice(0, -3);
    result = result.trim();

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      else throw new Error("Failed to parse AI response as JSON");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Video script generation error:", error);
    return NextResponse.json(
      { error: "脚本生成失败: " + (error as Error).message },
      { status: 500 }
    );
  }
}
