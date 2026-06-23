"use client";

import { useState } from "react";
import { TrendingUp, Loader2, Sparkles, AlertCircle, Search, BarChart3 } from "lucide-react";

const niches = [
  "AI工具推荐", "副业赚钱", "职场技能", "健身减脂", "美妆护肤",
  "数码产品", "旅游攻略", "美食烹饪", "情感心理", "投资理财",
  "穿搭时尚", "亲子教育", "宠物养成", "家居装修", "创业经验"
];

export default function TrendingPage() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("douyin");
  const [count, setCount] = useState(5);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: niche.trim(),
          platform,
          count,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "分析失败");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-900">爆款选题挖掘</h1>
          <p className="text-sm text-primary-500">AI分析各平台内容趋势，找到你的下一个爆款选题</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-primary-100 p-6 space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">你的领域 / 赛道 *</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {niches.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNiche(n)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  niche === n
                    ? "bg-accent-500 text-white"
                    : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="或自定义输入你的领域，例如：AI绘画教学、独立开发者vlog..."
            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">目标平台</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 outline-none transition-all text-sm bg-white"
            >
              <option value="douyin">抖音</option>
              <option value="xiaohongshu">小红书</option>
              <option value="tiktok">TikTok</option>
              <option value="bilibili">B站</option>
              <option value="kuaishou">快手</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">选题数量</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 outline-none transition-all text-sm bg-white"
            >
              <option value={3}>3个（快速浏览）</option>
              <option value={5}>5个（推荐）</option>
              <option value={8}>8个（深度挖掘）</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !niche.trim()}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> AI正在分析趋势...</>
          ) : (
            <><Search className="w-5 h-5" /> 挖掘爆款选题</>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-accent-500" />
              <h2 className="text-lg font-bold text-primary-900">
                {result.niche} · {result.platform} 趋势分析
              </h2>
            </div>

            {result.hotKeywords && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-primary-400 uppercase mb-2">🔥 热门关键词</p>
                <div className="flex flex-wrap gap-2">
                  {result.hotKeywords.map((kw: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Trending Topics */}
          <h3 className="text-lg font-bold text-primary-900">📊 热门选题推荐</h3>
          <div className="grid gap-4">
            {result.trendingTopics?.map((topic: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl border border-primary-100 p-6 hover:border-accent-200 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-500" : i === 2 ? "bg-yellow-500" : "bg-primary-300"
                  }`}>
                    {topic.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary-900 mb-2">{topic.title}</h4>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-primary-50 rounded-lg p-3">
                        <p className="text-xs text-primary-400 mb-1">🔥 为什么火</p>
                        <p className="text-sm text-primary-700">{topic.reason}</p>
                      </div>
                      <div className="bg-primary-50 rounded-lg p-3">
                        <p className="text-xs text-primary-400 mb-1">🎯 切入角度</p>
                        <p className="text-sm text-primary-700">{topic.angle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-primary-500 mb-3">
                      <span className={`px-2 py-1 rounded ${
                        topic.estimatedViral === "高" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                      }`}>
                        📈 爆款潜力：{topic.estimatedViral}
                      </span>
                      <span className="px-2 py-1 bg-primary-50 rounded">
                        🎬 形式：{topic.suggestedFormat}
                      </span>
                    </div>

                    {topic.keyElements && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {topic.keyElements.map((el: string, j: number) => (
                          <span key={j} className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs">
                            ⭐ {el}
                          </span>
                        ))}
                      </div>
                    )}

                    {topic.exampleHook && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                        <span className="text-xs font-semibold text-yellow-600">💡 示例钩子</span>
                        <p className="text-sm text-yellow-800 mt-1">{topic.exampleHook}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Gaps */}
          {result.contentGaps?.length > 0 && (
            <div className="bg-white rounded-2xl border border-primary-100 p-6">
              <h3 className="font-bold text-primary-900 mb-3">🚀 还没人做好的蓝海方向</h3>
              <ul className="space-y-2">
                {result.contentGaps.map((gap: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-primary-700">
                    <span className="text-green-500 font-bold mt-0.5">→</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Overall Advice */}
          {result.overallAdvice && (
            <div className="bg-gradient-to-r from-accent-50 to-blue-50 border border-accent-200 rounded-2xl p-6">
              <h3 className="font-bold text-primary-900 mb-2">💎 专家建议</h3>
              <p className="text-sm text-primary-700 leading-relaxed">{result.overallAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
