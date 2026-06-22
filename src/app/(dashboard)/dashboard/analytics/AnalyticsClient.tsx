"use client";

const platformColors: Record<string, string> = {
  xiaohongshu: "#ff2442",
  douyin: "#000000",
  twitter: "#1da1f2",
  reddit: "#ff4500",
  tiktok: "#00f2ea",
};

const platformLabels: Record<string, string> = {
  xiaohongshu: "📕 小红书",
  douyin: "🎵 抖音",
  twitter: "🐦 X(Twitter)",
  reddit: "👽 Reddit",
  tiktok: "📱 TikTok",
};

interface AnalyticsItem {
  id: string;
  userId: string;
  platform: string;
  date: string;
  followers: number;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  createdAt: string;
}

export function AnalyticsClient({
  totalPosts,
  analytics,
}: {
  totalPosts: number;
  analytics: AnalyticsItem[];
}) {
  // Group by platform
  const byPlatform: Record<string, AnalyticsItem[]> = {};
  for (const item of analytics) {
    if (!byPlatform[item.platform]) byPlatform[item.platform] = [];
    byPlatform[item.platform].push(item);
  }

  const platformSummary = Object.entries(byPlatform).map(
    ([platform, items]) => ({
      platform,
      totalFollowers: items.reduce((s, i) => s + i.followers, 0),
      totalLikes: items.reduce((s, i) => s + i.likes, 0),
      totalComments: items.reduce((s, i) => s + i.comments, 0),
      totalShares: items.reduce((s, i) => s + i.shares, 0),
      totalImpressions: items.reduce((s, i) => s + i.impressions, 0),
    })
  );

  const totalEngagement = analytics.reduce(
    (s, i) => s + i.likes + i.comments + i.shares,
    0
  );
  const totalImpressions = analytics.reduce((s, i) => s + i.impressions, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-primary-100 p-5">
          <p className="text-sm text-primary-500">内容总数</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">
            {totalPosts}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-primary-100 p-5">
          <p className="text-sm text-primary-500">总互动数</p>
          <p className="text-2xl font-bold text-accent-600 mt-1">
            {totalEngagement.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-primary-100 p-5">
          <p className="text-sm text-primary-500">总曝光量</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">
            {totalImpressions.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-primary-100 p-5">
          <p className="text-sm text-primary-500">连接平台</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">
            {Object.keys(byPlatform).length}
          </p>
        </div>
      </div>

      {/* Trend Chart Placeholder */}
      <div className="bg-white rounded-2xl border border-primary-100 p-6">
        <h2 className="font-semibold text-primary-900 mb-4">互动趋势</h2>
        {analytics.length > 0 ? (
          <div className="h-48 flex items-end gap-2">
            {analytics.slice(-30).map((item, i) => {
              const max = Math.max(...analytics.map((a) => a.likes), 1);
              const height = (item.likes / max) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-accent-200 rounded-t hover:bg-accent-400 transition-colors relative group"
                  style={{ height: `${Math.max(height, 2)}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary-800 text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
                    {item.likes} 👍 ({new Date(item.date).toLocaleDateString("zh-CN")})
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-primary-300">
            <p>暂无数据 - 发布内容后会自动收集</p>
          </div>
        )}
      </div>

      {/* Platform Performance Table */}
      <div className="bg-white rounded-2xl border border-primary-100 overflow-hidden">
        <div className="p-4 border-b border-primary-100">
          <h2 className="font-semibold text-primary-900">平台表现</h2>
        </div>
        {platformSummary.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-100">
                  <th className="text-left p-4 text-primary-500 font-medium">
                    平台
                  </th>
                  <th className="text-right p-4 text-primary-500 font-medium">
                    粉丝
                  </th>
                  <th className="text-right p-4 text-primary-500 font-medium">
                    点赞
                  </th>
                  <th className="text-right p-4 text-primary-500 font-medium">
                    评论
                  </th>
                  <th className="text-right p-4 text-primary-500 font-medium">
                    分享
                  </th>
                  <th className="text-right p-4 text-primary-500 font-medium">
                    曝光
                  </th>
                </tr>
              </thead>
              <tbody>
                {platformSummary.map((p) => (
                  <tr key={p.platform} className="border-b border-primary-50 hover:bg-primary-50/50">
                    <td className="p-4 font-medium text-primary-900">
                      {platformLabels[p.platform] || p.platform}
                    </td>
                    <td className="p-4 text-right text-primary-700">
                      {p.totalFollowers.toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-primary-700">
                      {p.totalLikes.toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-primary-700">
                      {p.totalComments.toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-primary-700">
                      {p.totalShares.toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-primary-700">
                      {p.totalImpressions.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-primary-400">
            暂无平台数据
          </div>
        )}
      </div>
    </div>
  );
}
