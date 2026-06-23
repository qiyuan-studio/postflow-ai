import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";
import { checkGenerationLimit } from "@/lib/subscription-guard";
import type { BatchGenerateItem, BatchGenerateResponse } from "@/types";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

const platformDescriptions: Record<string, { name: string; desc: string; maxChars: number; style: string }> = {
  xiaohongshu: { name: "小红书", desc: "精致生活方式分享平台，图文并茂，注重氛围感和真实体验", maxChars: 1000, style: "亲和、细腻、有温度，多用emoji" },
  douyin: { name: "抖音", desc: "短视频平台，内容需要开场3秒抓住注意力", maxChars: 500, style: "口语化、有爆点、节奏快" },
  twitter: { name: "X/Twitter", desc: "简洁的短文本平台，注重观点和实时性", maxChars: 280, style: "精炼、有力、有态度" },
  zhihu: { name: "知乎", desc: "专业问答社区，需要有深度和独特见解", maxChars: 5000, style: "专业、深度、逻辑清晰" },
  weixin: { name: "微信公众号", desc: "深度长文平台，适合完整叙事和专业分析", maxChars: 10000, style: "系统性强、有结构" },
  weibo: { name: "微博", desc: "社交媒体平台，话题传播为主", maxChars: 2000, style: "热点驱动、简洁有力" },
  reddit: { name: "Reddit", desc: "社区讨论平台，需要深度和互动性", maxChars: 2000, style: "深度、互动性强" },
  tiktok: { name: "TikTok", desc: "短视频平台，创意和娱乐性为主", maxChars: 300, style: "轻松、有趣、有创意" },
};

// POST /api/content/batch-generate - 批量生成内容
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitCheck = await checkGenerationLimit();
  if (!limitCheck.allowed) {
    return NextResponse.json({
      error: `本月AI生成次数已达上限（${limitCheck.limit}次），请升级专业版`,
      limitReached: true,
      used: limitCheck.used,
      limit: limitCheck.limit,
    }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { topic, platforms, count, tone, templateId, keywords, includeImages } = body;

    if (!topic || !platforms?.length) {
      return NextResponse.json({ error: "Topic and platforms are required" }, { status: 400 });
    }

    const batchCount = Math.min(Math.max(count || 3, 1), 20);
    const selectedPlatforms = platforms
      .map((p: string) => platformDescriptions[p])
      .filter(Boolean);

    if (selectedPlatforms.length === 0) {
      return NextResponse.json({ error: "No valid platforms specified" }, { status: 400 });
    }

    // Build platform assignment: distribute batch across platforms
    const platformAssignments: string[] = [];
    for (let i = 0; i < batchCount; i++) {
      platformAssignments.push(platforms[i % platforms.length]);
    }

    const platformDetails = selectedPlatforms
      .map((p: any) => `- ${p.name}：${p.desc}（${p.maxChars}字以内，风格：${p.style}）`)
      .join("\n");

    const systemPrompt = `你是顶尖的社交媒体内容工厂。一次生成多篇不同平台的内容。

要求：
1. 为每个分配的平台生成独立、高质量的内容
2. 每篇内容必须符合对应平台的调性、字符限制和风格
3. 主题保持一致，但角度/切入点要多样
4. 包含适合该平台的话题标签
5. 中文为主，适当使用英文标签
6. 内容要有真实感，避免 AI 味

${
  keywords?.length
    ? `关键词（自然融入）：${keywords.join("、")}`
    : ""
}

输出严格 JSON 格式（不要 markdown 代码块）：
{
  "items": [
    {
      "index": 0,
      "platform": "平台id",
      "title": "标题（如有）",
      "content": "正文内容",
      "hashtags": ["标签1", "标签2"],
      "imagePrompt": "配图描述（可选）"
    }
  ]
}`;

    const userPrompt = `请为主题「${topic}」生成 ${batchCount} 篇内容。
平台分配（按顺序）：
${platformAssignments.map((p, i) => `第${i + 1}篇 → ${platformDescriptions[p]?.name || p}`).join("\n")}

语气：${tone || "专业"}
${includeImages ? "\n每篇需要提供配图描述 imagePrompt" : ""}`;

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
      return NextResponse.json({ error: "AI generation returned empty" }, { status: 500 });
    }

    // Clean markdown
    result = result.trim();
    if (result.startsWith("```json")) result = result.slice(7);
    else if (result.startsWith("```")) result = result.slice(3);
    if (result.endsWith("```")) result = result.slice(0, -3);
    result = result.trim();

    let parsed: { items: BatchGenerateItem[] };
    try {
      parsed = JSON.parse(result);
    } catch {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      else throw new Error("Failed to parse AI response");
    }

    if (!parsed.items || !Array.isArray(parsed.items)) {
      // Try alternate format
      if (Array.isArray(parsed)) {
        parsed = { items: parsed };
      } else {
        throw new Error("AI response missing 'items' array");
      }
    }

    const usage = response.usage;
    const resp: BatchGenerateResponse = {
      items: parsed.items.slice(0, batchCount),
      totalTokens: (usage?.prompt_tokens || 0) + (usage?.completion_tokens || 0),
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(resp);
  } catch (error) {
    console.error("Batch generation error:", error);
    return NextResponse.json(
      { error: "Batch generation failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
