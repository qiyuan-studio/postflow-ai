"use client";

import { useState } from "react";
import { Send, Video, Loader2, Copy, Check, Sparkles, AlertCircle } from "lucide-react";

const videoTypes = [
  { id: "product_promo", name: "产品推广", desc: "突出卖点，促进转化" },
  { id: "educational", name: "知识科普", desc: "分享知识，建立专业形象" },
  { id: "vlog", name: "Vlog日常", desc: "真实记录，拉近距离" },
  { id: "story", name: "剧情故事", desc: "情节驱动，引发共鸣" },
  { id: "tutorial", name: "教程教学", desc: "步骤清晰，实操性强" },
  { id: "trending", name: "热点追评", desc: "借势热点，获取流量" },
  { id: "before_after", name: "对比展示", desc: "效果对比，视觉冲击" },
  { id: "unboxing", name: "开箱测评", desc: "真实体验，建立信任" },
];

const platforms = [
  { id: "douyin", name: "抖音" },
  { id: "tiktok", name: "TikTok" },
  { id: "kuaishou", name: "快手" },
  { id: "shipin", name: "视频号" },
];

export default function VideoScriptPage() {
  const [topic, setTopic] = useState("");
  const [videoType, setVideoType] = useState("product_promo");
  const [platform, setPlatform] = useState("douyin");
  const [tone, setTone] = useState("自然真实");
  const [targetAudience, setTargetAudience] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/video/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          videoType,
          platform,
          tone,
          targetAudience: targetAudience.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "生成失败");
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyAllScript = () => {
    if (!result) return;
    const text = `标题：${result.title}\n\n钩子：${result.hook}\n\n脚本内容：\n${
      result.script?.map((s: any) => 
        `${s.time} | ${s.scene}\n口播：${s.narration}\n字幕：${s.captions}\n`
      ).join("\n") || ""
    }\n\nCTA：${result.cta || ""}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Video className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-900">短视频脚本工厂</h1>
          <p className="text-sm text-primary-500">AI一键生成爆款短视频脚本，适用于抖音/TikTok/快手等平台</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-primary-100 p-6 space-y-6 mb-8">
        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">视频主题 *</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：如何在家做一杯手冲咖啡、2026年最值得买的5款手机..."
            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition-all text-sm"
          />
        </div>

        {/* Video Type & Platform */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">视频类型</label>
            <select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 outline-none transition-all text-sm bg-white"
            >
              {videoTypes.map((vt) => (
                <option key={vt.id} value={vt.id}>{vt.name} - {vt.desc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">目标平台</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 outline-none transition-all text-sm bg-white"
            >
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tone & Audience */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">语气风格</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 outline-none transition-all text-sm bg-white"
            >
              <option value="自然真实">自然真实</option>
              <option value="专业权威">专业权威</option>
              <option value="幽默风趣">幽默风趣</option>
              <option value="情感共鸣">情感共鸣</option>
              <option value="悬念刺激">悬念刺激</option>
              <option value="清新治愈">清新治愈</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">目标观众（选填）</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="例如：25-35岁职场女性、大学生..."
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> AI正在创作脚本...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> 生成爆款脚本</>
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
          {/* Action bar */}
          <div className="flex gap-3">
            <button onClick={copyAllScript} className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-200 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-50 transition-all">
              {copied ? <><Check className="w-4 h-4 text-green-500" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制全部脚本</>}
            </button>
          </div>

          {/* Title & Hook */}
          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <h2 className="text-xl font-bold text-primary-900 mb-2">{result.title}</h2>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <span className="text-xs font-semibold text-yellow-600 uppercase">🔥 黄金钩子</span>
              <p className="text-yellow-800 font-medium mt-1">{result.hook}</p>
            </div>
            <p className="text-sm text-primary-600 mb-3">{result.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {result.hashtags?.map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-accent-50 text-accent-600 rounded-full text-xs font-medium">#{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {result.keyPoints?.map((kp: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">⭐ {kp}</span>
              ))}
            </div>
          </div>

          {/* Script Timeline */}
          <div className="bg-white rounded-2xl border border-primary-100 p-6">
            <h3 className="text-lg font-bold text-primary-900 mb-4">📋 分镜头脚本</h3>
            <div className="space-y-4">
              {result.script?.map((scene: any, i: number) => (
                <div key={i} className="border border-primary-100 rounded-xl p-4 hover:border-accent-200 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-accent-600 bg-accent-50 px-2 py-1 rounded">{scene.time}</span>
                    {scene.action && <span className="text-xs text-primary-400">{scene.action}</span>}
                  </div>
                  <p className="text-sm text-primary-500 mb-2"><span className="font-medium text-primary-700">🎬 画面：</span>{scene.scene}</p>
                  <p className="text-sm font-medium text-primary-900 mb-1"><span className="text-accent-600">🎤 口播：</span>{scene.narration}</p>
                  {scene.captions && <p className="text-sm text-primary-400"><span className="font-medium">📝 字幕：</span>{scene.captions}</p>}
                  {scene.music && <p className="text-sm text-primary-400 mt-1"><span className="font-medium">🎵 配乐：</span>{scene.music}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* CTA & Thumbnails */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-primary-100 p-6">
              <h4 className="font-bold text-primary-900 mb-2">🎯 引导话术 (CTA)</h4>
              <p className="text-sm text-primary-700">{result.cta}</p>
            </div>
            <div className="bg-white rounded-2xl border border-primary-100 p-6">
              <h4 className="font-bold text-primary-900 mb-2">🖼️ 封面方案</h4>
              <ul className="space-y-1">
                {result.thumbnailIdeas?.map((tip: string, i: number) => (
                  <li key={i} className="text-sm text-primary-700">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Platform Tips */}
          {result.tiktokTips && (
            <div className="bg-white rounded-2xl border border-primary-100 p-6">
              <h4 className="font-bold text-primary-900 mb-3">💡 平台优化建议</h4>
              <ul className="space-y-2">
                {result.tiktokTips.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-primary-700">
                    <span className="text-accent-500 mt-0.5">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
