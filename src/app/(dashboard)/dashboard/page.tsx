import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Calendar, BarChart3, Wand2 } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [totalPosts, scheduledPosts, publishedPosts, draftPosts] =
    await Promise.all([
      prisma.contentPost.count({ where: { userId } }),
      prisma.contentPost.count({ where: { userId, status: "scheduled" } }),
      prisma.contentPost.count({ where: { userId, status: "published" } }),
      prisma.contentPost.count({ where: { userId, status: "draft" } }),
    ]);

  const recentPosts = await prisma.contentPost.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      status: true,
      platforms: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-900">
          欢迎回来，{session?.user?.name || "用户"}
        </h1>
        <p className="text-primary-500 mt-1">这是你的内容管理概览</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="全部内容" value={totalPosts} icon={FileText} color="blue" />
        <StatCard label="已发布" value={publishedPosts} icon={BarChart3} color="green" />
        <StatCard label="待发布" value={scheduledPosts} icon={Calendar} color="purple" />
        <StatCard label="草稿" value={draftPosts} icon={FileText} color="amber" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/content/new"
          className="p-6 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl text-white hover:shadow-lg transition-shadow"
        >
          <Wand2 className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg">AI 生成内容</h3>
          <p className="text-white/80 text-sm mt-1">用AI快速创建多平台社交媒体内容</p>
        </Link>

        <Link
          href="/dashboard/content"
          className="p-6 bg-white rounded-2xl border border-primary-100 hover:shadow-lg transition-shadow"
        >
          <FileText className="w-8 h-8 mb-3 text-primary-600" />
          <h3 className="font-semibold text-lg text-primary-900">管理内容</h3>
          <p className="text-primary-500 text-sm mt-1">查看和编辑你的所有内容</p>
        </Link>
      </div>

      {/* Recent Content */}
      <div className="bg-white rounded-2xl border border-primary-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-primary-900">最近内容</h2>
          <Link
            href="/dashboard/content"
            className="text-sm text-accent-600 hover:underline"
          >
            查看全部 →
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 bg-primary-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={post.status} />
                  <span className="text-sm text-primary-700">
                    {post.title || "无标题"}
                  </span>
                </div>
                <span className="text-xs text-primary-400">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-primary-400">
            <p>还没有内容</p>
            <Link
              href="/dashboard/content/new"
              className="text-accent-600 hover:underline text-sm mt-2 inline-block"
            >
              用AI创建第一篇内容 →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-primary-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-primary-500">{label}</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-amber-100 text-amber-700",
    scheduled: "bg-purple-100 text-purple-700",
    published: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  const labels: Record<string, string> = {
    draft: "草稿",
    scheduled: "待发布",
    published: "已发布",
    failed: "失败",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${
        styles[status] || "bg-primary-100 text-primary-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
