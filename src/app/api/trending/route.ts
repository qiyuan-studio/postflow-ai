import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";
import { checkGenerationLimit } from "@/lib/subscription-guard";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitCheck = await checkGenerationLimit();
  if (!limitCheck.allowed) {
    return NextResponse.json({
      error: "本月AI生成次数已达上限，请升级专业版",
      limitReached: true,
    }, { status: 403 });
  }

  try {
    const { niche, platform, count } = await request.json();

    if (!niche) {
      return NextResponse.json({ error: "请输入领域/赛道" }, { status: 400 });
    }

    const platformName = platform === "douyin" ? "抖音" 
      : platform === "tiktok" ? "TikTok" 
      : platform === "xiaohongshu" ? "小红书"
      : platform === "bilibili" ? "B站"
      : "主流短视频平台";

    const systemPrompt = `你是资深社交媒体趋势分析师和爆款内容策划专家。擅长分析${platformName}平台的内容趋势，为创作者提供可执行的选题建议。

要求：
- 基于2026年最新内容生态分析
- 给出的选题要有实操性
- 分析为什么这类内容会火
- 提供具体的切入角度和差异化建议`;

    const userPrompt = `请分析"${niche}"领域在${platformName}平台上的爆款内容趋势，给出${count || 5}个热门选题方向：

返回JSON格式（不要用代码块包裹）：
{
  "niche": "${niche}",
  "platform": "${platformName}",
  "trendingTopics": [
    {
      "rank": 1,
      "title": "选题标题",
      "reason": "为什么这个内容会火",
      "angle": "推荐切入角度",
      "estimatedViral": "高/中",
      "suggestedFormat": "建议的视频形式（口播/剧情/教程等）",
      "keyElements": ["关键元素1","关键元素2"],
      "exampleHook": "示例钩子文案"
    }
  ],
  "contentGaps": ["该领域还没人做好的内容方向1","方向2"],
  "overallAdvice": "该领域整体创作建议",
  "hotKeywords": ["热门关键词1","关键词2","关键词3","关键词4","关键词5"]
}`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4096,
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
    console.error("Trending analysis error:", error);
    return NextResponse.json(
      { error: "趋势分析失败: " + (error as Error).message },
      { status: 500 }
    );
  }
}
