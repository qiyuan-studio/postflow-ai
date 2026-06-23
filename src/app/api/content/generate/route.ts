import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";
import { checkGenerationLimit } from "@/lib/subscription-guard";

// DeepSeek is API-compatible with OpenAI SDK
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

const platformDescriptions: Record<string, string> = {
  xiaohongshu: "小红书 - 精致生活方式分享平台，注重图文质量和氛围感",
  douyin: "抖音 - 短视频平台，内容需要简洁有力、有爆点",
  twitter: "X/Twitter - 简洁的短文本，注重观点和实时性",
  reddit: "Reddit - 社区讨论平台，需要深度和互动性",
  tiktok: "TikTok - 短视频平台，注重创意和娱乐性",
  weixin: "微信公众号 - 深度长文平台，注重专业性和完整度",
  zhihu: "知乎 - 专业问答社区，需要有深度和独特见解的回答",
  weibo: "微博 - 社交媒体平台，简洁有力，适合传播和话题讨论",
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
      error: "本月AI生成次数已达上限（" + limitCheck.limit + "次），请升级专业版获取更多额度",
      limitReached: true,
      used: limitCheck.used,
      limit: limitCheck.limit,
    }, { status: 403 });
  }

  try {
    const { topic, platforms, tone, style } = await request.json();

    if (!topic || !platforms || !platforms.length) {
      return NextResponse.json(
        { error: "Topic and platforms are required" },
        { status: 400 }
      );
    }

    const selectedPlatforms = platforms
      .map((p: string) => platformDescriptions[p] || p)
      .join(", ");

    const systemPrompt = `你是资深社交媒体内容创作专家。根据用户提供的主题、平台和风格，生成适合多平台发布的社交媒体内容。

要求：
- 为每个平台生成独立的内容
- 内容要符合平台调性和用户群体
- 包含适合的标签/话题
- 注意字符限制（Twitter/X 280字符以内）
- 风格：${tone || "专业"}、${style || "信息丰富"}

输出纯JSON，不要用markdown代码块包裹。`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `请为以下主题生成多平台内容：
主题：${topic}
目标平台：${selectedPlatforms}
语气：${tone || "专业"}
风格：${style || "信息丰富"}

返回JSON格式（不要用代码块包裹）：
{ "content": [{ "platform": "平台id", "content": "正文...", "hashtags": ["标签1","标签2"], "imagePrompt": "配图描述" }] }`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    let result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json(
        { error: "AI generation failed" },
        { status: 500 }
      );
    }

    // Clean up potential markdown code blocks
    result = result.trim();
    if (result.startsWith("```json")) {
      result = result.slice(7);
    } else if (result.startsWith("```")) {
      result = result.slice(3);
    }
    if (result.endsWith("```")) {
      result = result.slice(0, -3);
    }
    result = result.trim();

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Normalize: wrap in { content: [...] } if it's a bare array
    if (Array.isArray(parsed)) {
      parsed = { content: parsed };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "Content generation failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
