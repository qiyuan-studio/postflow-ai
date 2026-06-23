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
    const { topic, keywords, audience, length, tone, includeTableOfContents, language } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const wordCount = length === "short" ? "800-1200" : length === "long" ? "2500-4000" : "1500-2500";
    const lang = language || "zh-CN";
    const toc = includeTableOfContents !== false;

    const systemPrompt = `You are an SEO content expert. Generate an SEO-optimized blog post.

Requirements:
- Language: ${lang === "zh-CN" ? "Simplified Chinese" : "English"}
- Word count: ${wordCount} characters
- Tone: ${tone || "professional"}, informative
${keywords ? `- Target keywords: ${keywords}` : ""}
${audience ? `- Target audience: ${audience}` : ""}
${toc ? "- Include Table of Contents" : "- No Table of Contents needed"}

Structure:
1. Catchy title (H1) and meta description
2. Table of Contents (if needed)
3. Introduction paragraph
4. 2-4 H2 sections (300-500 words each)
5. H3 sub-sections for detailed topics
6. FAQ section (3-5 questions)
7. Conclusion with CTA

SEO best practices:
- Naturally distribute keywords in title, H2s, first paragraph, and conclusion
- Short paragraphs (2-4 sentences)
- Include data, quotes, or cases for credibility

Output JSON (NO markdown code blocks):
{
  "title": "SEO title",
  "metaDescription": "Meta description under 150 chars",
  "slug": "url-slug",
  "tableOfContents": ["Section 1", "Section 2"],
  "sections": [{ "heading": "H2 title", "content": "Markdown content", "subSections": [{ "heading": "H3", "content": "content" }] }],
  "faq": [{ "question": "Q", "answer": "A" }],
  "conclusion": "Conclusion paragraph",
  "tags": ["tag1", "tag2"],
  "estimatedReadTime": "X min"
}`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Write an SEO blog post about: "${topic}".${keywords ? `\nOptimize for keywords: ${keywords}` : ""}${audience ? `\nTarget readers: ${audience}` : ""}`,
        },
      ],
      temperature: 0.7,
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
    console.error("Blog generation error:", error);
    return NextResponse.json(
      { error: "Blog generation failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
