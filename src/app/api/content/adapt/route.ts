import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

interface PlatformDetail {
  name: string;
  desc: string;
  maxChars: number;
  style: string;
}

const platformDetails: Record<string, PlatformDetail> = {
  xiaohongshu: {
    name: "小红书",
    desc: "精致生活方式分享平台，图文并茂，注重氛围感和真实体验",
    maxChars: 1000,
    style: "亲和、细腻、有温度，多用emoji，分段清晰"
  },
  douyin: {
    name: "抖音",
    desc: "短视频平台，内容需要开场3秒抓住注意力",
    maxChars: 500,
    style: "口语化、有爆点、节奏快，适合口播"
  },
  twitter: {
    name: "X/Twitter",
    desc: "简洁的短文本平台，注重观点和实时性",
    maxChars: 280,
    style: "精炼、有力、有态度，适合金句和观点输出"
  },
  zhihu: {
    name: "知乎",
    desc: "专业问答社区，需要有深度和独特见解",
    maxChars: 5000,
    style: "专业、深度、逻辑清晰，引用数据和案例"
  },
  weixin: {
    name: "微信公众号",
    desc: "深度长文平台，适合完整叙事和专业分析",
    maxChars: 10000,
    style: "系统性强、有结构、排版讲究"
  },
  weibo: {
    name: "微博",
    desc: "社交媒体平台，话题传播为主",
    maxChars: 2000,
    style: "热点驱动、简洁有力、适合话题讨论"
  },
  tiktok: {
    name: "TikTok",
    desc: "短视频平台，创意和娱乐性为主",
    maxChars: 300,
    style: "轻松、有趣、有创意，适合挑战和趋势"
  },
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { content, sourcePlatform, targetPlatforms, title, topic } = body;

    if (!content || !targetPlatforms?.length) {
      return NextResponse.json(
        { error: "Content and targetPlatforms are required" },
        { status: 400 }
      );
    }

    const targetInfoList: PlatformDetail[] = targetPlatforms
      .map((p: string) => platformDetails[p])
      .filter(Boolean);

    if (targetInfoList.length === 0) {
      return NextResponse.json(
        { error: "No valid target platforms specified" },
        { status: 400 }
      );
    }

    const sourceInfo = sourcePlatform ? platformDetails[sourcePlatform] : null;

    const systemPrompt = `你是顶尖的跨平台内容适配专家。将一段内容智能适配到多个社交媒体平台。
要求：
1. 保留核心信息和观点
2. 为每个平台调整语气、长度、格式以符合平台调性
3. 添加适合该平台的标签/hashtags
4. 注意字符限制，不要超限
5. 中文为主，适当使用英文标签

输出格式（纯JSON，不要用markdown代码块包裹）：
{
  "adaptations": [
    {
      "platform": "平台id",
      "platformName": "平台显示名",
      "content": "适配后的内容",
      "hashtags": ["标签1", "标签2"],
      "notes": "适配说明（为什么这么调整）"
    }
  ]
}`;

    const targetDescriptions = targetInfoList.map((t: PlatformDetail) => {
      return `- ${t.name}：${t.desc}（${t.maxChars}字以内，风格：${t.style}）`;
    }).join("\n");

    const userPrompt = `原始内容：
${sourcePlatform && sourceInfo ? `来源平台：${sourceInfo.name}` : ""}${title ? `\n原标题：${title}` : ""}${topic ? `\n主题：${topic}` : ""}

正文：
${content}

目标平台：
${targetDescriptions}

请逐平台适配。`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 4096,
      temperature: 0.6,
    });

    let result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "Adaptation failed" }, { status: 500 });
    }

    // Clean markdown code blocks
    result = result.trim();
    if (result.startsWith("```")) {
      result = result.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: "Content adaptation failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
