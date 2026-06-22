import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await prisma.analyticsData.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startDate },
      },
      orderBy: { date: "asc" },
    });

    // 按平台汇总
    const platformSummary: Record<string, any> = {};
    for (const row of analytics) {
      if (!platformSummary[row.platform]) {
        platformSummary[row.platform] = {
          platform: row.platform,
          followers: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          impressions: 0,
        };
      }
      platformSummary[row.platform].followers += row.followers;
      platformSummary[row.platform].likes += row.likes;
      platformSummary[row.platform].comments += row.comments;
      platformSummary[row.platform].shares += row.shares;
      platformSummary[row.platform].impressions += row.impressions;
    }

    // 趋势数据
    const trendData = analytics.map((row) => ({
      date: row.date,
      platform: row.platform,
      likes: row.likes,
      comments: row.comments,
      impressions: row.impressions,
    }));

    return NextResponse.json({
      summary: Object.values(platformSummary),
      trends: trendData,
      total: analytics.length,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
