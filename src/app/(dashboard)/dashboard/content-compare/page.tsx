"use client";

import { useState, useEffect } from "react";
import { GitCompare, Loader2, Search, ArrowRight, FileText } from "lucide-react";
import type { ContentPost, ContentDiff } from "@/types";

export default function ContentComparePage() {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [compareData, setCompareData] = useState<any>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      setPosts(data.posts || data || []);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  const compare = async () => {
    if (!selectedId) return;
    setCompareLoading(true);
    setCompareData(null);

    try {
      const res = await fetch(`/api/content/compare?id=${selectedId}`);
      const data = await res.json();
      setCompareData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GitCompare className="w-6 h-6 text-accent-600" />
          <h1 className="text-2xl font-bold text-primary-900">内容对比</h1>
        </div>
        <p className="text-primary-500 text-sm">
          查看 AI 适配前后的内容变化，了解每次改动的细节
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post selector */}
        <div className="bg-white rounded-2xl border border-primary-100 p-6">
          <h2 className="text-sm font-semibold text-primary-900 mb-4">选择内容</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary-300" />
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {posts.map(post => (
                <button
                  key={post.id}
                  onClick={() => setSelectedId(post.id)}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                    selectedId === post.id
                      ? "border-accent-400 bg-accent-50"
                      : "border-primary-100 hover:border-primary-200"
                  }`}
                >
                  <p className="font-medium text-primary-900 truncate">
                    {post.title || "无标题"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      post.status === "published" ? "bg-green-100 text-green-600" :
                      post.status === "scheduled" ? "bg-blue-100 text-blue-600" :
                      "bg-primary-100 text-primary-500"
                    }`}>
                      {post.status === "published" ? "已发布" : post.status === "scheduled" ? "已排期" : "草稿"}
                    </span>
                    <span className="text-xs text-primary-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}

              {posts.length === 0 && (
                <p className="text-sm text-primary-400 text-center py-4">
                  暂无内容，先去创建吧
                </p>
              )}
            </div>
          )}

          <button
            onClick={compare}
            disabled={!selectedId || compareLoading}
            className="w-full mt-4 py-2.5 bg-accent-600 text-white rounded-xl font-medium hover:bg-accent-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {compareLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            查看详情与对比
          </button>
        </div>

        {/* Compare result */}
        <div className="lg:col-span-2">
          {!compareData ? (
            <div className="bg-white rounded-2xl border border-primary-100 p-12 text-center">
              <GitCompare className="w-12 h-12 text-primary-200 mx-auto mb-4" />
              <p className="text-primary-400 text-sm">选择左侧内容查看详情和对比历史</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current content */}
              <div className="bg-white rounded-2xl border border-primary-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-accent-600" />
                  <h2 className="font-semibold text-primary-900">当前内容</h2>
                  <span className="text-xs text-primary-400 ml-auto">
                    {compareData.adapted?.createdAt ? new Date(compareData.adapted.createdAt).toLocaleString() : ""}
                  </span>
                </div>
                <h3 className="font-bold text-primary-900 mb-2">{compareData.adapted?.title || "无标题"}</h3>
                <div className="text-sm text-primary-600 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {compareData.adapted?.content || "无内容"}
                </div>
                {compareData.adapted?.platforms && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {JSON.parse(compareData.adapted.platforms).map((p: string, i: number) => (
                      <span key={i} className="text-xs bg-primary-50 text-primary-500 px-2 py-0.5 rounded-full">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Diffs */}
              {compareData.diffs?.length > 0 && (
                <div className="bg-white rounded-2xl border border-primary-100 p-6">
                  <h2 className="font-semibold text-primary-900 mb-4">变更记录</h2>
                  <div className="space-y-3">
                    {compareData.diffs.map((diff: ContentDiff, i: number) => (
                      <div key={i} className="border border-primary-100 rounded-xl overflow-hidden">
                        <div className="px-4 py-2 bg-primary-50 text-xs font-medium text-primary-500 border-b border-primary-100">
                          {diff.field === "title" ? "标题" : diff.field === "content" ? "正文" : diff.field === "platforms" ? "平台" : diff.field}
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-primary-100">
                          <div className="p-3">
                            <p className="text-xs text-red-500 mb-1">修改前</p>
                            <p className="text-sm text-primary-600 line-through decoration-red-300">
                              {diff.before?.substring(0, 200)}
                              {diff.before?.length > 200 ? "..." : ""}
                            </p>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-green-500 mb-1">修改后</p>
                            <p className="text-sm text-primary-600">
                              {diff.after?.substring(0, 200)}
                              {diff.after?.length > 200 ? "..." : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Adaptation history */}
              {compareData.adaptationHistory?.length > 0 && (
                <div className="bg-white rounded-2xl border border-primary-100 p-6">
                  <h2 className="font-semibold text-primary-900 mb-4">适配历史</h2>
                  <div className="space-y-2">
                    {compareData.adaptationHistory.map((h: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                        <ArrowRight className="w-4 h-4 text-primary-300 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-primary-900">{h.title}</p>
                          <p className="text-xs text-primary-400 mt-0.5">
                            {new Date(h.createdAt).toLocaleString()} · 平台：{h.platforms}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!compareData.diffs?.length && !compareData.adaptationHistory?.length && (
                <div className="bg-white rounded-2xl border border-primary-100 p-8 text-center">
                  <p className="text-primary-400 text-sm">该内容暂无变更记录</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
