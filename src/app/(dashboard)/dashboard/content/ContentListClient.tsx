"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Trash2, Calendar, Eye } from "lucide-react";

const statusFilters = [
  { value: "all", label: "全部" },
  { value: "draft", label: "草稿" },
  { value: "scheduled", label: "待发布" },
  { value: "published", label: "已发布" },
];

const platformEmojis: Record<string, string> = {
  xiaohongshu: "📕",
  douyin: "🎵",
  twitter: "🐦",
  reddit: "👽",
  tiktok: "📱",
  zhihu: "💡",
  weixin: "📰",
  weibo: "🔴",
};

const platformLabels: Record<string, string> = {
  xiaohongshu: "小红书",
  douyin: "抖音",
  twitter: "X",
  reddit: "Reddit",
  tiktok: "TikTok",
  zhihu: "知乎",
  weixin: "公众号",
  weibo: "微博",
};

const statusLabels: Record<string, string> = {
  draft: "草稿",
  scheduled: "待发布",
  published: "已发布",
  failed: "失败",
};

const statusColors: Record<string, string> = {
  draft: "bg-amber-100 text-amber-700",
  scheduled: "bg-purple-100 text-purple-700",
  published: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

interface Post {
  id: string;
  title: string | null;
  content: string;
  platforms: string[];
  status: string;
  createdAt: string;
  scheduledAt: string | null;
}

export function ContentListClient({ posts: initialPosts }: { posts: Post[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts);

  const filtered = posts.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (p.title || "").toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("确定要删除吗？")) return;
    try {
      const res = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch {
      alert("删除失败");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-primary-100">
      {/* Filters */}
      <div className="p-4 border-b border-primary-100 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          <input
            type="text"
            placeholder="搜索内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-primary-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent-500/50"
          />
        </div>
        <div className="flex gap-1">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                statusFilter === f.value
                  ? "bg-accent-600 text-white"
                  : "text-primary-500 hover:bg-primary-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="divide-y divide-primary-100">
          {filtered.map((post) => (
            <div
              key={post.id}
              onClick={() => router.push(`/dashboard/content/${post.id}`)}
              className="p-4 hover:bg-accent-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-primary-900 truncate group-hover:text-accent-700 transition-colors">
                    {post.title || "无标题"}
                  </h3>
                  <p className="text-sm text-primary-500 mt-1 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[post.status] || "bg-primary-100 text-primary-600"
                      }`}
                    >
                      {statusLabels[post.status] || post.status}
                    </span>
                    {post.platforms.map((p: string) => (
                      <span
                        key={p}
                        className="text-xs text-primary-400"
                        title={platformLabels[p] || p}
                      >
                        {platformEmojis[p] || "🌐"}
                      </span>
                    ))}
                    <span className="text-xs text-primary-300">
                      {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                    {post.scheduledAt && (
                      <span className="text-xs text-purple-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.scheduledAt).toLocaleDateString("zh-CN")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={(e) => handleDelete(post.id, e)}
                    className="p-2 text-primary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-primary-400">
          <p className="text-lg">
            {searchQuery ? "没有匹配的内容" : "还没有内容"}
          </p>
          <p className="text-sm mt-1">
            点击右上角「新建内容」开始创作
          </p>
        </div>
      )}

      <div className="px-4 py-3 border-t border-primary-100 text-sm text-primary-400">
        共 {filtered.length} 条内容
      </div>
    </div>
  );
}
