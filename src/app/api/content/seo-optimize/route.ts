import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";
import { checkGenerationLimit } from "@/lib/subscription-guard";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

interface SEOAnalysis {
  score: number;
  keywordDensity: Record<string, number>;
  titleScore: number;
  metaDescription: string;
  suggestedKeywords: string[];
  readabilityScore: number;
  headingStructure: string[];
  improvements: string[];
}

// POST /api/content/seo-optimize - SEO 深度分析和优化
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitCheck = await checkGenerationLimit();
  if (!limitCheck.allowed) {
    return NextResponse.json({
      error: "本月次数已达上限",
      limitReached: true,
    }, { status: 403 });
  }

  try {
    const { title, content, keywords, platform } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const targetKeywords = keywords || [];
    const platformType = platform || "通用";
    const wordCount = content.length;

    const systemPrompt = `你是 SEO 内容优化专家。对内容进行深度分析和优化建议。

分析维度：
1. 关键词密度分析 — 目标关键词出现频率和位置
2. 标题优化评分 — 标题是否包含关键词、是否有吸引力、长度是否合理
3. 可读性分析 — 段落长度、句式复杂度、阅读流畅度
4. 标题结构（H1/H2/H3）— 层级是否合理、是否包含关键词
5. Meta Description 建议 — 150字以内的精准描述
6. 推荐补充关键词 — 基于内容的 LSI 关键词建议
7. 分项改进建议 — 具体、可操作为主

${targetKeywords.length ? `目标关键词：${targetKeywords.join(", ")}` : ""}
平台：${platformType}
字数：${wordCount}

输出严格 JSON（不要 markdown 包裹）：
{
  "score": 总分(0-100),
  "keywordDensity": { "关键词": 出现次数 },
  "titleScore": 标题分(0-100),
  "metaDescription": "优化后的meta描述",
  "suggestedKeywords": ["建议补充的关键词1", "关键词2"],
  "readabilityScore": 可读性分(0-100),
  "headingStructure": ["检测到的标题结构"],
  "improvements": ["改进建议1", "建议2", "建议3"]
}`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `请分析以下内容：
${title ? `标题：${title}\n` : ""}
正文：
${content}

${targetKeywords.length ? `重点关注关键词：${targetKeywords.join(", ")}` : "请自动提取核心关键词并分析"}
平台：${platformType}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2048,
    });

    let result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "SEO analysis failed" }, { status: 500 });
    }

    result = result.trim();
    if (result.startsWith("```")) {
      result = result.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const analysis: SEOAnalysis = JSON.parse(result);

    // Calculate keyword density in content
    if (targetKeywords.length > 0 && Object.keys(analysis.keywordDensity).length === 0) {
      const density: Record<string, number> = {};
      for (const kw of targetKeywords) {
        const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
        const matches = content.match(regex);
        density[kw] = matches ? matches.length : 0;
      }
      analysis.keywordDensity = density;
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("SEO optimize error:", error);
    return NextResponse.json(
      { error: "SEO optimization failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
