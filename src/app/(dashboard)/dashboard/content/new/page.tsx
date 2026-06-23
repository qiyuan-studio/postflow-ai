"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wand2, Sparkles, Loader2, Check, Copy } from "lucide-react";
import Link from "next/link";

const platforms = [
  { id: "xiaohongshu", label: "小红书", emoji: "📕" },
  { id: "douyin", label: "抖音", emoji: "🎵" },
  { id: "twitter", label: "X (Twitter)", emoji: "🐦" },
  { id: "reddit", label: "Reddit", emoji: "👽" },
  { id: "tiktok", label: "TikTok", emoji: "📱" },
  { id: "zhihu", label: "知乎", emoji: "💡" },
  { id: "weixin", label: "公众号", emoji: "📰" },
  { id: "weibo", label: "微博", emoji: "🔴" },
];

const tones = ["专业", "轻松", "幽默", "激励", "教育", "新闻"];
const styles = ["信息丰富", "故事性", "列表式", "问答式", "教程式"];

export default function NewContentPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["xiaohongshu"]);
  const [tone, setTone] = useState("专业");
  const [style, setStyle] = useState("信息丰富");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (selectedPlatforms.length === 0) {
      setError("请至少选择一个平台");
      return;
    }

    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platforms: selectedPlatforms,
          tone,
          style,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成失败");
      }

      const data = await res.json();
      setResult(data.content || data);
    } catch (err: any) {
      setError(err.message || "AI 内容生成失败，请检查 API Key 配置");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (content: string) => {
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: topic,
          content,
          platforms: selectedPlatforms,
          aiGenerated: true,
          aiPrompt: topic,
        }),
      });
      router.push("/dashboard/content");
      router.refresh();
    } catch {
      alert("保存失败");
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-900">AI 内容生成器</h1>
        <p className="text-primary-500 mt-1">
          用AI快速创建多平台社交媒体内容
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-primary-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            内容主题
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：AI如何改变内容创作行业..."
            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            目标平台
          </label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedPlatforms.includes(p.id)
                    ? "bg-accent-600 text-white"
                    : "bg-primary-100 text-primary-600 hover:bg-primary-200"
                }`}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              语气
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-accent-500 outline-none"
            >
              {tones.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              风格
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-accent-500 outline-none"
            >
              {styles.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {error && error.includes("已达上限") && (
          <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-lg text-sm">
            AI生成次数已达上限
            <a href="/dashboard/settings" className="ml-2 text-accent-600 font-medium hover:underline">
              升级专业版 →
            </a>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating || !topic.trim()}
          className="w-full py-3 bg-accent-600 text-white rounded-xl font-medium hover:bg-accent-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI 正在创作...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              开始生成
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && Array.isArray(result) && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-600" />
            生成结果
          </h2>
          {result.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-primary-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-sm font-medium">
                  {platforms.find((p) => p.id === item.platform)?.emoji}{" "}
                  {platforms.find((p) => p.id === item.platform)?.label ||
                    item.platform}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(item.content, index)}
                    className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-primary-700 whitespace-pre-wrap text-sm leading-relaxed">
                {item.content}
              </p>
              {item.hashtags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.hashtags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-accent-50 text-accent-600 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-primary-100 flex gap-2">
                <button
                  onClick={() => handleSave(item.content)}
                  className="px-4 py-2 bg-accent-600 text-white rounded-xl text-sm font-medium hover:bg-accent-700 transition-colors"
                >
                  保存为草稿
                </button>
                <button
                  onClick={() => copyToClipboard(item.content, index)}
                  className="px-4 py-2 border border-primary-200 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-50 transition-colors"
                >
                  复制内容
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link
          href="/dashboard/content"
          className="text-sm text-accent-600 hover:underline"
        >
          ← 返回内容管理
        </Link>
      </div>
    </div>
  );
}
