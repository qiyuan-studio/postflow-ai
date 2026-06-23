import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import OpenAI from "openai";

// 使用 DeepSeek（API 兼容 OpenAI SDK）
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

// POST /api/open/v1/content/generate - AI生成内容（开放API）
export async function POST(request: NextRequest) {
  const auth = await verifyApiKey(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic, platform, tone, length, keywords } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const lengthMap: Record<string, string> = {
      short: "100-200字，简洁有力",
      medium: "300-500字，内容充实",
      long: "800-1200字，深度内容",
    };

    const systemPrompt = `你是专业的社交媒体内容创作者。
根据用户提供的主题、平台和风格，生成高质量社交媒体内容。

要求：
- 内容符合 ${platform || "通用"} 平台调性
- 长度：${lengthMap[length || "medium"]}
- 语气：${tone || "专业"}
- ${keywords?.length ? `关键词：${keywords.join(", ")}` : ""}
- 输出格式：JSON { "title": "标题", "content": "正文内容", "hashtags": ["标签1", "标签2"], "suggestions": ["建议1"] }`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `主题：${topic}\n平台：${platform || "通用"}\n语气：${tone || "专业"}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    return NextResponse.json({ data: JSON.parse(result) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
