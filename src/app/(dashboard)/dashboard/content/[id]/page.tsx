"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Edit3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const platformMeta: Record<string, { label: string; emoji: string; color: string; url: string }> = {
  xiaohongshu: { label: "小红书", emoji: "📕", color: "bg-red-50 text-red-600", url: "https://www.xiaohongshu.com" },
  douyin: { label: "抖音", emoji: "🎵", color: "bg-blue-50 text-blue-600", url: "https://www.douyin.com" },
  twitter: { label: "X (Twitter)", emoji: "🐦", color: "bg-sky-50 text-sky-600", url: "https://twitter.com" },
  reddit: { label: "Reddit", emoji: "👽", color: "bg-orange-50 text-orange-600", url: "https://reddit.com" },
  tiktok: { label: "TikTok", emoji: "📱", color: "bg-gray-50 text-gray-600", url: "https://tiktok.com" },
  zhihu: { label: "知乎", emoji: "💡", color: "bg-blue-50 text-blue-600", url: "https://zhihu.com" },
  weixin: { label: "公众号", emoji: "📰", color: "bg-green-50 text-green-600", url: "https://mp.weixin.qq.com" },
  weibo: { label: "微博", emoji: "🔴", color: "bg-red-50 text-red-600", url: "https://weibo.com" },
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: "草稿", color: "bg-amber-100 text-amber-700", icon: Edit3 },
  scheduled: { label: "待发布", color: "bg-purple-100 text-purple-700", icon: Calendar },
  published: { label: "已发布", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  failed: { label: "失败", color: "bg-red-100 text-red-700", icon: XCircle },
};

function formatDate(d: string) {
  return new Date(d).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  useEffect(() => {
    fetch(`/api/content/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        if (data.scheduledAt) {
          const d = new Date(data.scheduledAt);
          setScheduleDate(d.toISOString().split("T")[0]);
          setScheduleTime(d.toTimeString().slice(0, 5));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/content/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await fetch(`/api/content/${params.id}`).then((r) => r.json());
        setPost(updated);
        router.refresh();
      }
    } catch (err) {
      alert("操作失败");
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) return;
    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();
    try {
      const res = await fetch(`/api/content/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "scheduled", scheduledAt }),
      });
      if (res.ok) {
        const updated = await fetch(`/api/content/${params.id}`).then((r) => r.json());
        setPost(updated);
        router.refresh();
      }
    } catch {
      alert("排期失败");
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除此内容吗？")) return;
    try {
      await fetch(`/api/content/${params.id}`, { method: "DELETE" });
      router.push("/dashboard/content");
      router.refresh();
    } catch {
      alert("删除失败");
    }
  };

  const copyContent = () => {
    if (!post) return;
    const text = post.platforms?.length
      ? post.platforms
          .map((p: string) => {
            const meta = platformMeta[p];
            return `【${meta?.emoji || "📝"} ${meta?.label || p}】\n${post.content}`;
          })
          .join("\n\n---\n\n")
      : post.content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-accent-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-primary-400">
        <p className="text-lg">内容不存在</p>
        <Link href="/dashboard/content" className="text-accent-600 hover:underline mt-2 inline-block">
          返回内容管理
        </Link>
      </div>
    );
  }

  const StatusIcon = statusConfig[post.status]?.icon || Edit3;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/content"
          className="flex items-center gap-2 text-primary-500 hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">返回</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={copyContent}
            className="px-3 py-1.5 text-sm border border-primary-200 rounded-lg hover:bg-primary-50 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "已复制" : "复制全部"}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> 删除
          </button>
        </div>
      </div>

      {/* Status & Platforms */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[post.status]?.color}`}>
          <StatusIcon className="w-4 h-4" />
          {statusConfig[post.status]?.label}
        </span>
        {post.platforms?.map((p: string) => (
          <span
            key={p}
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${platformMeta[p]?.color || "bg-primary-100 text-primary-600"}`}
          >
            {platformMeta[p]?.emoji} {platformMeta[p]?.label}
          </span>
        ))}
        <span className="text-xs text-primary-400">{formatDate(post.createdAt)}</span>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-primary-100 p-6">
        <h1 className="text-xl font-bold text-primary-900 mb-4">{post.title || "无标题"}</h1>
        <div className="prose prose-sm max-w-none text-primary-700 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Actions: Publish / Schedule */}
      <div className="bg-white rounded-2xl border border-primary-100 p-6">
        <h2 className="font-semibold text-primary-900 mb-4">发布操作</h2>
        <div className="flex flex-wrap gap-3">
          {post.status !== "published" && (
            <button
              onClick={() => handleStatusChange("published")}
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> 标记为已发布
            </button>
          )}

          {/* Schedule */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="px-3 py-2 border border-primary-200 rounded-lg text-sm"
            />
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="px-3 py-2 border border-primary-200 rounded-lg text-sm"
            />
            <button
              onClick={handleSchedule}
              disabled={!scheduleDate || !scheduleTime}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> 排期
            </button>
          </div>

          {post.status !== "draft" && (
            <button
              onClick={() => handleStatusChange("draft")}
              className="px-4 py-2 text-sm border border-primary-200 rounded-xl hover:bg-primary-50"
            >
              撤回为草稿
            </button>
          )}
        </div>

        {post.scheduledAt && (
          <div className="mt-3 flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            计划于 {formatDate(post.scheduledAt)} 发布
          </div>
        )}
      </div>

      {/* Platform Links */}
      <div className="bg-white rounded-2xl border border-primary-100 p-6">
        <h2 className="font-semibold text-primary-900 mb-4">平台直达链接</h2>
        <div className="flex flex-wrap gap-2">
          {post.platforms?.map((p: string) => (
            <a
              key={p}
              href={platformMeta[p]?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm hover:bg-primary-100 transition-colors"
            >
              {platformMeta[p]?.emoji} {platformMeta[p]?.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Publish Logs */}
      {post.publishLogs?.length > 0 && (
        <div className="bg-white rounded-2xl border border-primary-100 p-6">
          <h2 className="font-semibold text-primary-900 mb-4">发布日志</h2>
          <div className="space-y-2">
            {post.publishLogs.map((log: any) => (
              <div
                key={log.id}
                className="flex items-center gap-3 text-sm p-3 bg-primary-50 rounded-lg"
              >
                <span className={platformMeta[log.platform]?.color || "bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs"}>
                  {platformMeta[log.platform]?.emoji} {platformMeta[log.platform]?.label || log.platform}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  log.status === "published" ? "bg-green-100 text-green-700" :
                  log.status === "failed" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {log.status === "published" ? "已发布" : log.status === "failed" ? "失败" : "处理中"}
                </span>
                <span className="text-primary-400">{log.message || ""}</span>
                <span className="text-primary-300 text-xs ml-auto">
                  {log.publishedAt ? formatDate(log.publishedAt) : formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adapt for platforms */}
      <div className="bg-white rounded-2xl border border-primary-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-primary-900">跨平台适配</h2>
          <Link
            href={`/dashboard/content-adapt?content=${encodeURIComponent(post.content)}`}
            className="text-sm text-accent-600 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI适配 →
          </Link>
        </div>
        <p className="text-sm text-primary-500">
          使用AI将内容适配为你选择平台的风格和格式
        </p>
      </div>
    </div>
  );
}
