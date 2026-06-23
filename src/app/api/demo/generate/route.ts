import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

// 简易 IP 频率限制（内存中，重启后重置）
const ipCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_DEMO_PER_IP = 3;
const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 小时

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipCounts.get(ip);
  if (!record || now > record.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + RESET_INTERVAL });
    return true;
  }
  if (record.count >= MAX_DEMO_PER_IP) return false;
  record.count++;
  return true;
}

export async function POST(request: Request) {
  // Rate limit
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
    || request.headers.get("x-real-ip") 
    || "127.0.0.1";
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json({
      content: "今天的免费体验次数已用完。注册后即可无限使用！",
      limitReached: true,
    });
  }

  try {
    const { topic, platform, tone } = await request.json();
    if (!topic) {
      return NextResponse.json({ content: "请输入主题" }, { status: 400 });
    }

    const platformNames: Record<string, string> = {
      xiaohongshu: "小红书",
      douyin: "抖音",
      twitter: "X (Twitter)",
      wechat: "微信公众号",
    };
    const pn = platformNames[platform] || "小红书";

    const systemPrompt = `你是顶尖的社交媒体内容创作者。用${tone}的语气，写一篇适合${pn}平台的爆款文案。

要求：
- 标题要吸引眼球，使用数字、悬念、对比
- 正文要有钩子开头，分段清晰
- 适当使用emoji
- 结尾要有互动引导（点赞/评论/关注）
- 全文300-500字`;

    const userPrompt = `主题：${topic}
平台：${pn}
语气：${tone}

请直接输出完整的文案内容，不要输出JSON。`;

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 2048,
    });

    const content = response.choices[0]?.message?.content || "生成失败";

    return NextResponse.json({ content, limitReached: false });
  } catch (error) {
    console.error("Demo generate error:", error);
    return NextResponse.json(
      { content: "AI 生成服务暂时不可用，请稍后重试。" },
      { status: 500 }
    );
  }
}
