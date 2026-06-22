import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// 生成 Webhook Secret
function generateSecret(): string {
  return crypto.randomBytes(32).toString("hex");
}

// GET /api/webhooks - 获取用户的 webhook 列表
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const webhooks = await prisma.webhook.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: webhooks });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/webhooks - 创建 webhook
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, url, events } = body;

    if (!name || !url || !events) {
      return NextResponse.json(
        { error: "Name, url, and events are required" },
        { status: 400 }
      );
    }

    // 验证 URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const webhook = await prisma.webhook.create({
      data: {
        userId: session.user.id,
        name,
        url,
        secret: generateSecret(),
        events: JSON.stringify(events),
      },
    });

    return NextResponse.json({ data: webhook }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/webhooks - 删除 webhook
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Webhook ID is required" }, { status: 400 });
    }

    const webhook = await prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook || webhook.userId !== session.user.id) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    await prisma.webhook.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/webhooks - 更新 webhook 状态/配置
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, url, events, active } = body;

    if (!id) {
      return NextResponse.json({ error: "Webhook ID is required" }, { status: 400 });
    }

    const webhook = await prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook || webhook.userId !== session.user.id) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (events !== undefined) updateData.events = JSON.stringify(events);
    if (active !== undefined) updateData.active = active;

    const updated = await prisma.webhook.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
