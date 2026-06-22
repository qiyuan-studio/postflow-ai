import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CalendarClient } from "./CalendarClient";

export default async function CalendarPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const scheduledPosts = await prisma.contentPost.findMany({
    where: {
      userId,
      scheduledAt: { not: null },
    },
    orderBy: { scheduledAt: "asc" },
    select: {
      id: true,
      title: true,
      platforms: true,
      status: true,
      scheduledAt: true,
    },
  });

  const serializedPosts = scheduledPosts.map((p) => ({
    ...p,
    platforms: JSON.parse(p.platforms || "[]"),
    scheduledAt: p.scheduledAt?.toISOString() || null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-900">发布日历</h1>
        <p className="text-primary-500 mt-1">查看和管理内容发布计划</p>
      </div>

      <CalendarClient posts={serializedPosts} />
    </div>
  );
}
