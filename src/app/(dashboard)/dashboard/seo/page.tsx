"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles, Copy, Check, ArrowUp, ArrowDown } from "lucide-react";

export default function SeoPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState("");
  const [platform, setPlatform] = useState("通用");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    if (!content.trim()) {
      setError("请输入要分析的内容");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/content/seo-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
          keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
          platform,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "分析失败");
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyMeta = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.metaDescription || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const ScoreBar = ({ label, score }: { label: string; score: number }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-primary-500">{label}</span>
        <span className={getScoreColor(score)}>{score}/100</span>
      </div>
      <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-6 h-6 text-accent-600" />
          <h1 className="text-2xl font-bold text-primary-900">SEO 内容优化</h1>
        </div>
        <p className="text-primary-500 text-sm">
          深度分析内容的搜索引擎优化表现，获取具体改进建议
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <label className="block text-sm font-semibold text-primary-900 mb-2">
              文章标题 <span className="text-primary-400 font-normal">（可选）</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入文章标题..."
              className="w-full px-4 py-2.5 rounded-xl border border-primary-200 focus:border-accent-400 outline-none text-sm"
            />
          </div>

          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <label className="block text-sm font-semibold text-primary-900 mb-2">
              正文内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="粘贴或输入要优化的内容..."
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 outline-none resize-none text-sm"
              rows={12}
            />
          </div>

          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-2">
                  目标关键词 <span className="text-primary-400 font-normal">（逗号分隔）</span>
                </label>
                <input
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="AI写作、内容营销"
                  className="w-full px-3 py-2.5 rounded-xl border border-primary-200 focus:border-accent-400 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-2">
                  目标平台
                </label>
                <select
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-primary-200 focus:border-accent-400 outline-none text-sm"
                >
                  <option>通用</option>
                  <option>搜索引擎</option>
                  <option>微信公众号</option>
                  <option>知乎</option>
                  <option>小红书</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={analyze}
            disabled={loading || !content.trim()}
            className="w-full py-3.5 bg-accent-600 text-white rounded-xl font-semibold hover:bg-accent-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI 分析中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                开始 SEO 分析
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {!result ? (
            <div className="bg-white rounded-2xl border border-primary-100 p-12 text-center">
              <Search className="w-12 h-12 text-primary-200 mx-auto mb-4" />
              <p className="text-primary-400 text-sm">
                SEO 分析结果将显示在这里
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className={`rounded-2xl border-2 p-6 ${getScoreBg(result.score)}`}>
                <div className="text-center">
                  <span className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </span>
                  <span className="text-sm text-primary-400 ml-1">/100</span>
                  <p className="text-sm text-primary-500 mt-1">SEO 综合评分</p>
                </div>
              </div>

              {/* Dimension Scores */}
              <div className="bg-white rounded-2xl border border-primary-100 p-6 space-y-3">
                <h3 className="text-sm font-semibold text-primary-900 mb-3">分项评分</h3>
                <ScoreBar label="标题优化" score={result.titleScore || 0} />
                <ScoreBar label="可读性" score={result.readabilityScore || 0} />
              </div>

              {/* Meta Description */}
              {result.metaDescription && (
                <div className="bg-white rounded-2xl border border-primary-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-primary-900">Meta 描述建议</h3>
                    <button
                      onClick={copyMeta}
                      className="p-1.5 text-primary-400 hover:text-accent-600"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-primary-600 bg-primary-50 rounded-xl p-3">
                    {result.metaDescription}
                  </p>
                </div>
              )}

              {/* Keyword Density */}
              {result.keywordDensity && Object.keys(result.keywordDensity).length > 0 && (
                <div className="bg-white rounded-2xl border border-primary-100 p-6">
                  <h3 className="text-sm font-semibold text-primary-900 mb-3">关键词密度</h3>
                  <div className="space-y-2">
                    {Object.entries(result.keywordDensity as Record<string, number>).map(([kw, count]) => (
                      <div key={kw} className="flex items-center justify-between text-sm">
                        <span className="text-primary-600">{kw}</span>
                        <span className="text-primary-400">{count} 次</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Keywords */}
              {result.suggestedKeywords?.length > 0 && (
                <div className="bg-white rounded-2xl border border-primary-100 p-6">
                  <h3 className="text-sm font-semibold text-primary-900 mb-3">推荐补充关键词</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedKeywords.map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-xs font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {result.improvements?.length > 0 && (
                <div className="bg-white rounded-2xl border border-primary-100 p-6">
                  <h3 className="text-sm font-semibold text-primary-900 mb-3">改进建议</h3>
                  <div className="space-y-2">
                    {result.improvements.map((imp: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-accent-600 mt-0.5 flex-shrink-0">
                          {i % 2 === 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-primary-600">{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Heading Structure */}
              {result.headingStructure?.length > 0 && (
                <div className="bg-white rounded-2xl border border-primary-100 p-6">
                  <h3 className="text-sm font-semibold text-primary-900 mb-3">标题结构</h3>
                  <div className="space-y-1">
                    {result.headingStructure.map((h: string, i: number) => (
                      <div key={i} className="text-sm text-primary-600 font-mono">
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
