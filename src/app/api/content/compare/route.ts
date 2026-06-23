import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ContentDiff } from "@/types";

// GET /api/content/compare?id=xxx - 查看内容适配前后的对比
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const originalId = url.searchParams.get("originalId");

    if (!id && !originalId) {
      return NextResponse.json({ error: "id or originalId is required" }, { status: 400 });
    }

    // Get the current post
    const post = await prisma.contentPost.findFirst({
      where: {
        id: id || originalId || "",
        userId: session.user.id,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // If we have an original ID, compare
    if (originalId && id) {
      const original = await prisma.contentPost.findFirst({
        where: { id: originalId, userId: session.user.id },
      });

      if (!original) {
        return NextResponse.json({ error: "Original content not found" }, { status: 404 });
      }

      const diffs: ContentDiff[] = [];
      if (original.title !== post.title) {
        diffs.push({ field: "title", before: original.title || "", after: post.title || "", changes: ["标题已修改"] });
      }
      if (original.content !== post.content) {
        diffs.push({ field: "content", before: original.content, after: post.content, changes: ["正文已修改"] });
      }
      if (original.platforms !== post.platforms) {
        diffs.push({ field: "platforms", before: original.platforms, after: post.platforms, changes: ["目标平台已更改"] });
      }

      return NextResponse.json({
        diffs,
        totalChanges: diffs.length,
        original: {
          id: original.id,
          title: original.title,
          content: original.content,
          platforms: original.platforms,
          status: original.status,
          createdAt: original.createdAt,
        },
        adapted: {
          id: post.id,
          title: post.title,
          content: post.content,
          platforms: post.platforms,
          status: post.status,
          createdAt: post.createdAt,
        },
      });
    }

    // Otherwise, just return the single post with any adaptation history
    const adaptationHistory = await prisma.contentPost.findMany({
      where: {
        userId: session.user.id,
        aiGenerated: true,
        title: post.title,
        id: { not: post.id },
      },
      select: {
        id: true,
        title: true,
        content: true,
        platforms: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      post,
      adaptationHistory,
    });
  } catch (error) {
    console.error("Content compare error:", error);
    return NextResponse.json(
      { error: "Failed to compare content" },
      { status: 500 }
    );
  }
}
