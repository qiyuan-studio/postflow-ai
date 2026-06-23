"use client";

import { useState } from "react";

interface ScoreResult {
  overall: number;
  dimensions: {
    headline: number;
    clarity: number;
    engagement: number;
    seo: number;
    platformFit: number;
    readability: number;
  };
  suggestions: string[];
  strengths: string[];
}

const platforms = [
  { id: "xiaohongshu", name: "小红书" },
  { id: "douyin", name: "抖音" },
  { id: "twitter", name: "X/Twitter" },
  { id: "zhihu", name: "知乎" },
  { id: "weixin", name: "微信公众号" },
  { id: "weibo", name: "微博" },
  { id: "tiktok", name: "TikTok" },
];

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function ContentScorePage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("xiaohongshu");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState("");

  const handleScore = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, platform, title, topic }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "评分失败");
      }
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (score: number) => {
    if (score >= 90) return { text: "优秀", color: "text-green-600" };
    if (score >= 80) return { text: "良好", color: "text-blue-600" };
    if (score >= 70) return { text: "中等", color: "text-yellow-600" };
    if (score >= 60) return { text: "及格", color: "text-orange-600" };
    return { text: "需改进", color: "text-red-600" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI 内容质量评分</h1>
          <p className="text-gray-500 mt-1">AI 多维度分析你的内容质量，给出改进建议</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 输入区 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">内容输入</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">目标平台</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
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
              <label className="block text-sm font-medium mb-1">标题（选填）</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="你的内容标题"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">正文内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="粘贴你要评分的内容..."
                rows={10}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[200px] resize-y"
              />
            </div>

            <button
              onClick={handleScore}
              disabled={loading || !content.trim()}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium disabled:opacity-50 hover:shadow-lg transition-all"
            >
              {loading ? "AI 分析中..." : "🎯 开始评分"}
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
          <h2 className="text-lg font-semibold mb-4">评分结果</h2>
          {!result ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>输入内容后点击"开始评分"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 总分展示 */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="text-5xl font-bold text-blue-600">{result.overall}</div>
                <div className={`text-lg font-semibold mt-1 ${getGrade(result.overall).color}`}>
                  {getGrade(result.overall).text}
                </div>
              </div>

              {/* 各维度分数 */}
              <div className="space-y-3">
                <h3 className="font-semibold">各维度评分</h3>
                <ScoreBar label="📰 标题吸引力" score={result.dimensions.headline} />
                <ScoreBar label="📝 内容清晰度" score={result.dimensions.clarity} />
                <ScoreBar label="💬 互动潜力" score={result.dimensions.engagement} />
                <ScoreBar label="🔍 SEO 优化" score={result.dimensions.seo} />
                <ScoreBar label="🎯 平台适配度" score={result.dimensions.platformFit} />
                <ScoreBar label="📖 可读性" score={result.dimensions.readability} />
              </div>

              {/* 优点 */}
              {result.strengths.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">✅ 优点</h3>
                  <ul className="space-y-1">
                    {result.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-green-500">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 改进建议 */}
              {result.suggestions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">💡 改进建议</h3>
                  <ul className="space-y-1">
                    {result.suggestions.map((s: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-blue-500">→</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
