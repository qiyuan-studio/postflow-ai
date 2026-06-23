import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { builtinTemplates, getRecommendedTemplates } from "@/lib/templates/builtin-templates";

// GET /api/templates - 获取内容模板列表
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const platform = url.searchParams.get("platform");
  const category = url.searchParams.get("category");

  const templates = getRecommendedTemplates(platform || undefined, category || undefined);

  return NextResponse.json({
    templates,
    total: templates.length,
  });
}

// POST /api/templates/generate-with-template - 使用模板生成内容
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId, topic, platform, tone } = await request.json();

    if (!templateId || !topic) {
      return NextResponse.json({ error: "templateId and topic are required" }, { status: 400 });
    }

    const { getTemplateById, buildTemplatePrompt } = await import("@/lib/templates/builtin-templates");
    const template = getTemplateById(templateId);

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Build the prompt and call AI
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
      baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    });

    const systemPrompt = `你是专业的社交媒体内容创作者。根据指定模板结构生成内容。

模板：${template.name}
模板描述：${template.description}

模板结构要求：
${template.structure.map(s => `- 【${s.type}】${s.name}：${s.prompt}${s.maxLength ? `（不超过${s.maxLength}字）` : ""}${s.required ? "[必填]" : "[可选]"}`).join("\n")}

请严格按照上述结构生成完整的 ${template.platforms.includes(platform) ? (platform) : template.platforms[0]} 平台内容。
输出纯 JSON（无 markdown 包裹）：
{
  "title": "标题内容",
  "sections": [
    { "name": "段落名", "type": "body", "content": "正文内容" },
    { "name": "行动号召", "type": "cta", "content": "CTA内容" }
  ],
  "hashtags": ["标签1", "标签2"],
  "fullContent": "完整的合并后的Markdown内容"
}`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `主题：${topic}\n语气：${tone || template.tone}\n平台：${platform || template.platforms[0]}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4096,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    // Mark the template as used
    template.usageCount++;

    return NextResponse.json({
      data: JSON.parse(result),
      template: { id: template.id, name: template.name },
    });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      { error: "Template generation failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
