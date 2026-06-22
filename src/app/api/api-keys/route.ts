import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function generateApiKey(): string {
  const prefix = "pf_";
  const random = crypto.randomBytes(32).toString("hex");
  return `${prefix}${random}`;
}

// GET - 获取用户的所有 API Key
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const keys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        key: true,
        lastUsed: true,
        expiresAt: true,
        active: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Mask keys for display (show first 8 chars only)
    const maskedKeys = keys.map(k => ({
      ...k,
      key: `${k.key.substring(0, 8)}...${k.key.substring(k.key.length - 4)}`,
    }));

    return NextResponse.json({ keys: maskedKeys });
  } catch (error) {
    console.error("API keys fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 });
  }
}

// POST - 创建新的 API Key
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const rawKey = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        name: name.trim(),
        key: rawKey,
        userId: session.user.id,
        active: true,
      },
    });

    // Return the full key only once at creation
    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key, // Full key, shown only once
      createdAt: apiKey.createdAt,
    }, { status: 201 });
  } catch (error) {
    console.error("API key creation error:", error);
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }
}

// DELETE - 删除 API Key
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { keyId } = await request.json();
    if (!keyId) {
      return NextResponse.json({ error: "Key ID is required" }, { status: 400 });
    }

    await prisma.apiKey.deleteMany({
      where: {
        id: keyId,
        userId: session.user.id, // Ensure ownership
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API key deletion error:", error);
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 });
  }
}
