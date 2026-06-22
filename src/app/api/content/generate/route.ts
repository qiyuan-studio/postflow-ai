import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { topic, platforms, tone, style } = await request.json();

    if (!topic || !platforms || !platforms.length) {
      return NextResponse.json(
        { error: "Topic and platforms are required" },
        { status: 400 }
      );
    }

    const platformDescriptions: Record<string, string> = {
      xiaohongshu: "小红书 - 精致生活方式分享平台，注重图文质量和氛围感",
      douyin: "抖音 - 短视频平台，内容需要简洁有力、有爆点",
      twitter: "X/Twitter - 简洁的短文本，注重观点和实时性",
      reddit: "Reddit - 社区讨论平台，需要深度和互动性",
      tiktok: "TikTok - 短视频平台，注重创意和娱乐性",
    };

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

输出格式：JSON数组，每个元素包含 platform（平台名）、content（内容正文）、hashtags（标签数组）、imagePrompt（配图建议）`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `主题：${topic}\n平台：${selectedPlatforms}\n语气：${tone || "专业"}\n风格：${style || "信息丰富"}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json(
        { error: "AI generation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(result));
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "Content generation failed" },
      { status: 500 }
    );
  }
}
