import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

// GET /api/open/v1/analytics - 获取分析数据
export async function GET(request: NextRequest) {
  const auth = await verifyApiKey(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const days = parseInt(searchParams.get("days") || "30");

    const since = new Date();
    since.setDate(since.getDate() - days);

    const where: Record<string, unknown> = {
      userId: auth.userId,
      date: { gte: since },
    };
    if (platform) where.platform = platform;

    const analytics = await prisma.analyticsData.findMany({
      where,
      orderBy: { date: "asc" },
    });

    // 汇总统计数据
    const summary = analytics.reduce(
      (acc, curr) => ({
        totalFollowers: acc.totalFollowers + curr.followers,
        totalLikes: acc.totalLikes + curr.likes,
        totalComments: acc.totalComments + curr.comments,
        totalShares: acc.totalShares + curr.shares,
        totalImpressions: acc.totalImpressions + curr.impressions,
      }),
      {
        totalFollowers: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalImpressions: 0,
      }
    );

    // 按平台分组
    const byPlatform = analytics.reduce(
      (acc: Record<string, typeof analytics>, curr) => {
        if (!acc[curr.platform]) acc[curr.platform] = [];
        acc[curr.platform].push(curr);
        return acc;
      },
      {}
    );

    return NextResponse.json({
      data: analytics,
      summary,
      byPlatform,
      period: { days, since },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
