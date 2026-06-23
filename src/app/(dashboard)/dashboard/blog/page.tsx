"use client";

import { useState } from "react";
import { Sparkles, Loader2, FileText, Copy, Check, ChevronDown, ChevronUp, Clock, Tag } from "lucide-react";
import Link from "next/link";

const lengthOptions = [
  { value: "short", label: "简洁 (800-1200字)" },
  { value: "medium", label: "标准 (1500-2500字)", default: true },
  { value: "long", label: "深度 (2500-4000字)" },
];

const toneOptions = ["专业", "轻松", "技术", "学术", "营销", "教程"];

interface BlogResult {
  title: string;
  metaDescription: string;
  slug: string;
  tableOfContents: string[];
  sections: { heading: string; content: string; subSections?: { heading: string; content: string }[] }[];
  faq: { question: string; answer: string }[];
  conclusion: string;
  tags: string[];
  estimatedReadTime: string;
}

export default function BlogGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState("medium");
  const [tone, setTone] = useState("专业");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<BlogResult | null>(null);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          keywords: keywords.trim() || undefined,
          length,
          tone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成失败");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "博客生成失败，请检查 API Key 配置");
    } finally {
      setGenerating(false);
    }
  };

  const copyMarkdown = () => {
    if (!result) return;
    const md = [
      `# ${result.title}`,
      "",
      `> ${result.metaDescription}`,
      "",
      ...result.sections.flatMap(s => [
        `## ${s.heading}`,
        "",
        s.content,
        "",
        ...(s.subSections?.flatMap(ss => [
          `### ${ss.heading}`,
          "",
          ss.content,
          "",
        ]) || []),
      ]),
      ...(result.faq.length > 0 ? [
        "## 常见问题 FAQ",
        "",
        ...result.faq.flatMap(f => [
          `### ${f.question}`,
          "",
          f.answer,
          "",
        ]),
      ] : []),
      "---",
      "",
      result.conclusion,
      "",
      ...(result.tags.length > 0 ? [
        "",
        `**标签:** ${result.tags.map(t => `#${t}`).join(" ")}`,
      ] : []),
    ].join("\n");

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SEO 博客生成器</h1>
        <p className="text-gray-500 mt-1">AI自动生成搜索引擎友好的高质量博客文章</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            博客主题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：2026年AI内容创作趋势分析..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标关键词
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="SEO关键词（逗号分隔）"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章长度
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {lengthOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              语气风格
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {toneOptions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating || !topic.trim()}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI 正在创作文章...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              生成 SEO 博客文章
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              生成结果
            </h2>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {result.estimatedReadTime}
              </span>
              <button
                onClick={copyMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <><Check className="w-4 h-4 text-green-500" /> 已复制</>
                ) : (
                  <><Copy className="w-4 h-4" /> 复制Markdown</>
                )}
              </button>
            </div>
          </div>

          {/* Title & Meta */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{result.title}</h3>
            <p className="text-gray-500 italic">{result.metaDescription}</p>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* TOC */}
          {result.tableOfContents.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="font-medium text-gray-900 mb-3">目录</h4>
              <ul className="space-y-1.5">
                {result.tableOfContents.map((item, i) => (
                  <li key={i} className="text-sm text-primary-600 hover:text-primary-700 cursor-pointer">
                    {i+1}. {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content Sections */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            {result.sections.map((section, i) => (
              <div key={i}>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{section.heading}</h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {section.content}
                </div>
                {section.subSections?.map((sub, j) => (
                  <div key={j} className="mt-4 ml-4 pl-4 border-l-2 border-primary-100">
                    <h5 className="text-base font-medium text-gray-800 mb-2">{sub.heading}</h5>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{sub.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* FAQ */}
          {result.faq.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">常见问题 FAQ</h4>
              <div className="space-y-4">
                {result.faq.map((item, i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <p className="font-medium text-gray-900 mb-1">Q: {item.question}</p>
                    <p className="text-sm text-gray-600">A: {item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">总结</h4>
            <p className="text-gray-700 leading-relaxed">{result.conclusion}</p>
          </div>
        </div>
      )}

      <div className="text-center">
        <Link href="/dashboard" className="text-sm text-primary-600 hover:underline">
          ← 返回仪表盘
        </Link>
      </div>
    </div>
  );
}
