"use client";

import { useState } from "react";
import { Layers, Loader2, Sparkles, Copy, Download, Check, Plus, Trash2 } from "lucide-react";
import type { BatchGenerateItem, ContentTemplate } from "@/types";

const PLATFORMS = [
  { id: "xiaohongshu", name: "小红书", icon: "📕" },
  { id: "douyin", name: "抖音", icon: "🎵" },
  { id: "weixin", name: "微信公众号", icon: "💬" },
  { id: "zhihu", name: "知乎", icon: "❓" },
  { id: "weibo", name: "微博", icon: "📱" },
  { id: "twitter", name: "X/Twitter", icon: "🐦" },
  { id: "reddit", name: "Reddit", icon: "👽" },
  { id: "tiktok", name: "TikTok", icon: "📱" },
];

const TONES = [
  "专业", "轻松", "幽默", "严肃", "激情", "温暖", "犀利", "客观",
];

export default function BatchGeneratePage() {
  const [topic, setTopic] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [tone, setTone] = useState("专业");
  const [keywords, setKeywords] = useState("");
  const [includeImages, setIncludeImages] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BatchGenerateItem[] | null>(null);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const generate = async () => {
    if (!topic.trim()) {
      setError("请输入主题");
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError("请选择至少一个平台");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/content/batch-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platforms: selectedPlatforms,
          count,
          tone,
          keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
          includeImages,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "生成失败");
      }

      setResults(data.items || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyItem = async (item: BatchGenerateItem, index: number) => {
    const text = `【${item.title}】\n${item.content}\n\n标签：${item.hashtags?.join(" ") || ""}`;
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    if (!results) return;
    const text = results.map((item, i) =>
      `=== 第 ${i + 1} 篇（${PLATFORMS.find(p => p.id === item.platform)?.name || item.platform}）===\n${item.title}\n${item.content}\n标签：${item.hashtags?.join(" ") || ""}\n`
    ).join("\n\n");
    await navigator.clipboard.writeText(text);
  };

  const platformIcon = (id: string) => PLATFORMS.find(p => p.id === id)?.icon || "📄";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Layers className="w-6 h-6 text-accent-600" />
          <h1 className="text-2xl font-bold text-primary-900">批量内容生成</h1>
        </div>
        <p className="text-primary-500 text-sm">
          一次输入主题，自动生成多平台多篇内容，提高创作效率 10 倍
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic */}
          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <label className="block text-sm font-semibold text-primary-900 mb-2">
              主题 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="输入内容主题，如：2024年AI写作工具推荐..."
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none resize-none text-sm"
              rows={3}
            />
          </div>

          {/* Platforms */}
          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <label className="block text-sm font-semibold text-primary-900 mb-3">
              目标平台 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                    selectedPlatforms.includes(p.id)
                      ? "bg-accent-50 border-accent-300 text-accent-700"
                      : "bg-white border-primary-200 text-primary-500 hover:border-primary-300"
                  }`}
                >
                  {p.icon} {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Count & Tone */}
          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-2">
                  生成篇数
                </label>
                <select
                  value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-primary-200 focus:border-accent-400 outline-none text-sm"
                >
                  {[1, 3, 5, 10, 15, 20].map(n => (
                    <option key={n} value={n}>{n} 篇</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-2">
                  语气风格
                </label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-primary-200 focus:border-accent-400 outline-none text-sm"
                >
                  {TONES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <label className="block text-sm font-semibold text-primary-900 mb-2">
              关键词 <span className="text-primary-400 font-normal">（可选，逗号分隔）</span>
            </label>
            <input
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="AI写作、内容营销、效率工具"
              className="w-full px-4 py-2.5 rounded-xl border border-primary-200 focus:border-accent-400 outline-none text-sm"
            />
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl border border-primary-100 p-6 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-700">包含配图描述</span>
            <button
              onClick={() => setIncludeImages(!includeImages)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                includeImages ? "bg-accent-500" : "bg-primary-200"
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${
                includeImages ? "left-6" : "left-0.5"
              }`} />
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading || !topic.trim() || selectedPlatforms.length === 0}
            className="w-full py-3.5 bg-accent-600 text-white rounded-xl font-semibold hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI 正在批量生成...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                开始批量生成
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3">
          {!results ? (
            <div className="bg-white rounded-2xl border border-primary-100 p-12 text-center">
              <Layers className="w-12 h-12 text-primary-200 mx-auto mb-4" />
              <p className="text-primary-400 text-sm">
                填写左侧信息后开始生成内容，结果将显示在这里
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary-600">
                  共 {results.length} 篇内容
                </span>
                <button
                  onClick={copyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-xl hover:bg-primary-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  复制全部
                </button>
              </div>

              {results.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-primary-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{platformIcon(item.platform)}</span>
                      <span className="text-xs font-medium bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                        {PLATFORMS.find(p => p.id === item.platform)?.name || item.platform}
                      </span>
                      <span className="text-xs text-primary-400">#{index + 1}</span>
                    </div>
                    <button
                      onClick={() => copyItem(item, index)}
                      className="p-1.5 text-primary-400 hover:text-accent-600 transition-colors"
                      title="复制"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-semibold text-primary-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-primary-600 whitespace-pre-wrap leading-relaxed mb-3">
                    {item.content}
                  </p>

                  {item.hashtags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.hashtags.map((tag, ti) => (
                        <span
                          key={ti}
                          className="text-xs bg-accent-50 text-accent-600 px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.imagePrompt && (
                    <div className="mt-3 p-3 bg-primary-50 rounded-xl">
                      <p className="text-xs text-primary-400 font-medium mb-1">配图建议</p>
                      <p className="text-xs text-primary-500">{item.imagePrompt}</p>
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
