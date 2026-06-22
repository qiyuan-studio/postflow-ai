import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ContentListClient } from "./ContentListClient";

export default async function ContentPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const posts = await prisma.contentPost.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates for client component
  const serializedPosts = posts.map((p) => ({
    ...p,
    platforms: JSON.parse(p.platforms || "[]"),
    imageUrls: p.imageUrls ? JSON.parse(p.imageUrls) : null,
    videoUrls: p.videoUrls ? JSON.parse(p.videoUrls) : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    scheduledAt: p.scheduledAt?.toISOString() || null,
    publishedAt: p.publishedAt?.toISOString() || null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">内容管理</h1>
          <p className="text-primary-500 mt-1">管理你的所有社交媒体内容</p>
        </div>
        <Link
          href="/dashboard/content/new"
          className="px-5 py-2.5 bg-accent-600 text-white rounded-xl font-medium hover:bg-accent-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> 新建内容
        </Link>
      </div>

      <ContentListClient posts={serializedPosts} />
    </div>
  );
}
