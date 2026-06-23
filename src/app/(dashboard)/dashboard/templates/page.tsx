"use client";

import { useState, useEffect } from "react";
import { FileText, Sparkles, Loader2, ChevronRight, Check } from "lucide-react";
import type { ContentTemplate, BatchGenerateItem } from "@/types";

const CATEGORIES = [
  { id: "all", name: "全部" },
  { id: "social", name: "社交媒体" },
  { id: "blog", name: "博客文章" },
  { id: "product", name: "产品推广" },
  { id: "email", name: "邮件通讯" },
];

const PLATFORM_ICONS: Record<string, string> = {
  xiaohongshu: "📕",
  douyin: "🎵",
  weixin: "💬",
  zhihu: "❓",
  weibo: "📱",
  twitter: "🐦",
  reddit: "👽",
  tiktok: "📱",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = async () => {
    if (!selectedTemplate || !topic.trim()) return;
    setGenerating(true);
    setGeneratedContent(null);

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          topic: topic.trim(),
          platform: selectedTemplate.platforms[0],
          tone: selectedTemplate.tone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      setGeneratedContent(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const displayedTemplates = category === "all"
    ? templates
    : templates.filter(t => t.category === category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-accent-600" />
          <h1 className="text-2xl font-bold text-primary-900">内容模板</h1>
        </div>
        <p className="text-primary-500 text-sm">
          使用预设模板快速生成高质量内容，也可自定义模板
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              category === c.id
                ? "bg-accent-600 text-white"
                : "bg-white border border-primary-200 text-primary-600 hover:border-primary-300"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template List */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary-300" />
            </div>
          ) : displayedTemplates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-primary-100 p-8 text-center">
              <p className="text-primary-400 text-sm">暂无此分类模板</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => { setSelectedTemplate(template); setGeneratedContent(null); setTopic(""); }}
                  className={`w-full text-left bg-white rounded-2xl border-2 p-5 transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id
                      ? "border-accent-400"
                      : "border-primary-100"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-primary-900">{template.name}</h3>
                    {template.isBuiltin && (
                      <span className="text-xs bg-primary-100 text-primary-500 px-2 py-0.5 rounded-full">
                        内置
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-primary-500 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {template.platforms.map(p => (
                      <span key={p} className="text-xs bg-primary-50 text-primary-500 px-2 py-0.5 rounded-full">
                        {PLATFORM_ICONS[p] || "📄"} {p}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-primary-300">
                    {template.structure.length} 个模块 · {template.tone}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Use Template */}
        <div>
          {!selectedTemplate ? (
            <div className="bg-white rounded-2xl border border-primary-100 p-8 text-center">
              <FileText className="w-10 h-10 text-primary-200 mx-auto mb-3" />
              <p className="text-primary-400 text-sm">选择一个模板开始使用</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-primary-100 p-6">
              <h2 className="text-lg font-bold text-primary-900 mb-1">{selectedTemplate.name}</h2>
              <p className="text-sm text-primary-500 mb-4">{selectedTemplate.description}</p>

              {/* Structure preview */}
              <div className="mb-5 p-4 bg-primary-50 rounded-xl">
                <p className="text-xs font-medium text-primary-400 mb-2">模板结构：</p>
                <div className="space-y-1.5">
                  {selectedTemplate.structure.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-primary-600">
                      <ChevronRight className="w-3 h-3 text-primary-300" />
                      <span className="text-primary-400">[{s.type}]</span>
                      <span>{s.name}</span>
                      {s.required && <span className="text-red-400">*必填</span>}
                      {s.maxLength && <span className="text-primary-300">≤{s.maxLength}字</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-primary-900 mb-2">输入主题</label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="输入内容主题..."
                  className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 outline-none text-sm resize-none"
                  rows={3}
                />
              </div>

              <button
                onClick={useTemplate}
                disabled={generating || !topic.trim()}
                className="w-full py-3 bg-accent-600 text-white rounded-xl font-semibold hover:bg-accent-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    使用模板生成
                  </>
                )}
              </button>

              {/* Generated result */}
              {generatedContent && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 font-medium text-sm mb-3">
                    <Check className="w-4 h-4" />
                    生成完成
                  </div>
                  <h3 className="font-bold text-primary-900 mb-2">
                    {generatedContent.title || "标题"}
                  </h3>
                  <div className="text-sm text-primary-600 whitespace-pre-wrap leading-relaxed">
                    {generatedContent.fullContent || generatedContent.content || JSON.stringify(generatedContent)}
                  </div>
                  {generatedContent.hashtags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {generatedContent.hashtags.map((tag: string, i: number) => (
                        <span key={i} className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
