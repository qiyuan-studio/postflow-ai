import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/content/[id] — 获取单篇内容详情
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const post = await prisma.contentPost.findFirst({
    where: { id, userId: session.user.id },
    include: {
      platformAccount: true,
      publishLogs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "内容不存在" }, { status: 404 });
  }

  return NextResponse.json({
    ...post,
    platforms: JSON.parse(post.platforms || "[]"),
    imageUrls: post.imageUrls ? JSON.parse(post.imageUrls) : [],
    videoUrls: post.videoUrls ? JSON.parse(post.videoUrls) : [],
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    scheduledAt: post.scheduledAt?.toISOString() || null,
    publishedAt: post.publishedAt?.toISOString() || null,
  });
}

// PATCH /api/content/[id]
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, platforms, status, scheduledAt } = body;

    const data: Record<string, any> = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (platforms !== undefined) data.platforms = JSON.stringify(platforms);
    if (status !== undefined) data.status = status;
    if (scheduledAt !== undefined) data.scheduledAt = new Date(scheduledAt);
    if (status === "published") data.publishedAt = new Date();

    const updated = await prisma.contentPost.updateMany({
      where: { id, userId: session.user.id },
      data,
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "内容不存在或无权修改" }, { status: 404 });
    }

    if (status === "published" || status === "scheduled") {
      const post = await prisma.contentPost.findUnique({ where: { id } });
      if (post) {
        const targetPlatforms = JSON.parse(post.platforms || "[]");
        for (const platform of targetPlatforms) {
          await prisma.publishLog.create({
            data: {
              contentPostId: id,
              platform,
              status: status === "published" ? "published" : "pending",
              message: status === "published" ? "发布成功（手动标记）" : "等待发布",
              publishedAt: status === "published" ? new Date() : null,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "更新失败" }, { status: 500 });
  }
}

// DELETE /api/content/[id]
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    await prisma.contentPost.deleteMany({
      where: { id, userId: session.user.id },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "删除失败" }, { status: 500 });
  }
}
