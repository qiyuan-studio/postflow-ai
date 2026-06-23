"use client";

import { useState } from "react";

const platforms = [
  { id: "xiaohongshu", name: "小红书", emoji: "📕" },
  { id: "douyin", name: "抖音", emoji: "🎵" },
  { id: "twitter", name: "X/Twitter", emoji: "🐦" },
  { id: "zhihu", name: "知乎", emoji: "💡" },
  { id: "weixin", name: "微信公众号", emoji: "💬" },
  { id: "weibo", name: "微博", emoji: "📢" },
  { id: "tiktok", name: "TikTok", emoji: "🎬" },
];

interface Adaptation {
  platform: string;
  platformName: string;
  content: string;
  hashtags: string[];
  notes: string;
}

export default function ContentAdaptPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["xiaohongshu", "twitter", "zhihu"]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Adaptation[] | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAdapt = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch("/api/content/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          title,
          topic,
          sourcePlatform: sourcePlatform || undefined,
          targetPlatforms: selectedPlatforms,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "适配失败");
      }
      const data = await res.json();
      setResults(data.adaptations || []);
      if (data.adaptations?.length > 0) {
        setActiveTab(data.adaptations[0].platform);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🔄 跨平台内容适配</h1>
          <p className="text-gray-500 mt-1">一篇内容，AI 自动适配到所有主流平台</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 输入区 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">原始内容</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">来源平台（选填）</label>
              <select
                value={sourcePlatform}
                onChange={(e) => setSourcePlatform(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">不指定</option>
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">标题（选填）</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="原标题"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">主题（选填）</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：AI 工具推荐"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">正文</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="粘贴你要适配的内容..."
                rows={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[160px] resize-y"
              />
            </div>

            {/* 目标平台选择 */}
            <div>
              <label className="block text-sm font-medium mb-2">适配到哪些平台？</label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selectedPlatforms.includes(p.id)
                        ? "bg-blue-100 border-blue-400 text-blue-700"
                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                已选 {selectedPlatforms.length} 个平台
              </p>
            </div>

            <button
              onClick={handleAdapt}
              disabled={loading || !content.trim() || selectedPlatforms.length === 0}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium disabled:opacity-50 hover:shadow-lg transition-all"
            >
              {loading ? "AI 适配中..." : "🚀 一键适配"}
            </button>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* 结果区 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">适配结果</h2>
          {!results ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">🔄</div>
              <p>选择平台后点击"一键适配"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tab 切换 */}
              <div className="flex flex-wrap gap-1 border-b pb-2">
                {results.map((adapt) => {
                  const p = platforms.find((p) => p.id === adapt.platform);
                  return (
                    <button
                      key={adapt.platform}
                      onClick={() => setActiveTab(adapt.platform)}
                      className={`px-3 py-1.5 rounded-t text-sm transition-colors ${
                        activeTab === adapt.platform
                          ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {p?.emoji || "📱"} {adapt.platformName || adapt.platform}
                    </button>
                  );
                })}
              </div>

              {/* 适配内容 */}
              {results
                .filter((a) => a.platform === activeTab)
                .map((adapt) => (
                  <div key={adapt.platform} className="space-y-3">
                    {adapt.notes && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        💡 {adapt.notes}
                      </div>
                    )}

                    <div className="relative">
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border max-h-[400px] overflow-y-auto font-sans">
                        {adapt.content}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(adapt.content)}
                        className="absolute top-2 right-2 px-2 py-1 bg-white rounded border text-xs shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        {copied ? "✅ 已复制" : "📋 复制"}
                      </button>
                    </div>

                    {adapt.hashtags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {adapt.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
