import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

interface ScoreResult {
  overall: number;
  dimensions: {
    headline: number;      // 标题吸引力
    clarity: number;       // 清晰度
    engagement: number;    // 互动潜力
    seo: number;           // SEO 优化
    platformFit: number;   // 平台适配度
    readability: number;   // 可读性
  };
  suggestions: string[];
  strengths: string[];
}

// POST /api/content/score - AI内容质量评分
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, platform, title, topic } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const systemPrompt = `你是专业的社交媒体内容分析师。对用户提供的内容进行多维度评分。

分析维度（每项0-100分）：
1. headline: 标题吸引力 — 是否吸引点击、是否包含关键词、是否有紧迫感
2. clarity: 内容清晰度 — 信息是否条理清晰、核心观点是否突出
3. engagement: 互动潜力 — 是否引发评论、点赞、转发
4. seo: SEO优化 — 关键词密度、标题优化、可搜索性
5. platformFit: 平台适配度 — 是否符合 ${platform || "通用"} 平台调性、字符限制、格式要求
6. readability: 可读性 — 段落长度、用词难度、阅读流畅度

给出具体、可执行的改进建议。

返回格式（纯JSON，无markdown包裹）：
{
  "overall": 总分(0-100),
  "dimensions": { "headline": 分, "clarity": 分, "engagement": 分, "seo": 分, "platformFit": 分, "readability": 分 },
  "suggestions": ["改进建议1", "改进建议2"],
  "strengths": ["优点1", "优点2"]
}`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `请分析以下${platform || "通用"}内容：
${topic ? `主题：${topic}\n` : ""}${title ? `标题：${title}\n` : ""}
正文：
${content}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    let result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "Score generation failed" }, { status: 500 });
    }

    // Clean markdown code blocks
    result = result.trim();
    if (result.startsWith("```")) {
      result = result.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(result) as ScoreResult;

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: "Content scoring failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
