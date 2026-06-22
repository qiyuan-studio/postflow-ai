import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnalyticsClient } from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const posts = await prisma.contentPost.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const analytics = await prisma.analyticsData.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });

  const serializedAnalytics = analytics.map((a) => ({
    ...a,
    date: a.date.toISOString(),
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-900">数据分析</h1>
        <p className="text-primary-500 mt-1">查看各平台内容表现</p>
      </div>

      <AnalyticsClient
        totalPosts={posts.length}
        analytics={serializedAnalytics}
      />
    </div>
  );
}
