import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

// GET /api/open/v1/content - 获取内容列表
export async function GET(request: NextRequest) {
  const auth = await verifyApiKey(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");

    const where: Record<string, unknown> = { userId: auth.userId };
    if (status) where.status = status;
    if (platform) where.platforms = { contains: platform };

    const [posts, total] = await Promise.all([
      prisma.contentPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contentPost.count({ where }),
    ]);

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/open/v1/content - 创建内容
export async function POST(request: NextRequest) {
  const auth = await verifyApiKey(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const userId = auth.userId as string;

  try {
    const body = await request.json();
    const { title, content, imageUrls, videoUrls, platforms, scheduledAt } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const post = await prisma.contentPost.create({
      data: {
        userId,
        title: title || null,
        content,
        imageUrls: imageUrls ? JSON.stringify(imageUrls) : null,
        videoUrls: videoUrls ? JSON.stringify(videoUrls) : null,
        platforms: platforms ? JSON.stringify(platforms) : "[]",
        status: scheduledAt ? "scheduled" : "draft",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
