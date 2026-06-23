"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Loader2, ArrowRight, Zap, Globe, BarChart3 } from "lucide-react";
import Link from "next/link";

const platforms = [
  { id: "xiaohongshu", name: "小红书", emoji: "📕" },
  { id: "douyin", name: "抖音", emoji: "🎵" },
  { id: "twitter", name: "X (Twitter)", emoji: "🐦" },
  { id: "wechat", name: "公众号", emoji: "💬" },
];

const tones = ["轻松幽默", "专业权威", "接地气", "情绪共鸣", "干货满满"];

export default function DemoPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("xiaohongshu");
  const [tone, setTone] = useState("轻松幽默");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/demo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), platform, tone }),
      });
      const data = await res.json();
      if (data.content) {
        setResult(data.content);
        setCount(c => c + 1);
      } else {
        setResult("抱歉，生成失败，请重试。");
      }
    } catch {
      setResult("网络错误，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                PostFlow
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700">定价</Link>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">登录</Link>
              <Link href="/register" 
                className="text-sm font-medium bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                免费注册
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium mb-4">
          <Sparkles className="w-3 h-3" />
          免费体验 AI 内容创作
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          输入主题，10秒生成爆款文案
        </h1>
        <p className="text-gray-500">
          选择平台和语气，AI 自动适配最优风格。已免费生成 {count} 篇
        </p>
      </div>

      {/* Demo Form */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                输入你的主题
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="例如：AI工具推荐、减脂餐食谱、iPhone选购指南..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-base"
              />
            </div>

            {/* Platform + Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">目标平台</label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map(p => (
                    <button key={p.id} type="button" onClick={() => setPlatform(p.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-all ${
                        platform === p.id
                          ? "border-primary-500 bg-primary-50 text-primary-700 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      <span>{p.emoji}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">内容语气</label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map(t => (
                    <button key={t} type="button" onClick={() => setTone(t)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                        tone === t
                          ? "border-accent-500 bg-accent-50 text-accent-700 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading || !topic.trim()}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> AI 生成中...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> 免费生成内容</>
              )}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">生成结果</h3>
                <button onClick={copyResult}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                  {copied ? <><Check className="w-3 h-3" /> 已复制</> : <><Copy className="w-3 h-3" /> 复制</>}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed max-h-96 overflow-y-auto">
                {result}
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 mb-3">
                  免费体验单次生成。注册后可无限生成 + 批量生成 + SEO优化
                </p>
                <Link href="/register"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-all">
                  免费注册，解锁全部功能
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {!result && (
            <div className="mt-6 flex items-center justify-center gap-8 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> 支持4大平台</span>
              <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> SEO优化</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 批量生成</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
