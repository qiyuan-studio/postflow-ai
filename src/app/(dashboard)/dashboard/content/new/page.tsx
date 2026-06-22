'use client';

import { useState } from 'react';
import { Sparkles, Send, Image, FileText, Globe, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const platforms = [
  { id: 'xiaohongshu', label: '小红书', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'douyin', label: '抖音', color: 'bg-gray-50 text-gray-700 border-gray-200' },
  { id: 'x', label: 'X/Twitter', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'reddit', label: 'Reddit', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'tiktok', label: 'TikTok', color: 'bg-gray-50 text-gray-700 border-gray-200' },
];

const tones = [
  { id: 'professional', label: '专业正式' },
  { id: 'casual', label: '轻松活泼' },
  { id: 'humorous', label: '幽默风趣' },
  { id: 'inspirational', label: '励志鼓舞' },
];

export default function NewContentPage() {
  const [topic, setTopic] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [tone, setTone] = useState('casual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Record<string, {title: string; content: string; hashtags: string[]}>>({});

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!topic || selectedPlatforms.length === 0) return;
    setIsGenerating(true);

    // Simulate AI generation (will be replaced with actual API call)
    setTimeout(() => {
      const mockContent: Record<string, {title: string; content: string; hashtags: string[]}> = {};
      selectedPlatforms.forEach(p => {
        mockContent[p] = {
          title: `${topic} - 你不可不知的秘诀`,
          content: `今天来和大家聊聊关于${topic}的那些事...\n\n这是我总结的几个关键点：\n1. 深入了解用户需求\n2. 持续输出高质量内容\n3. 与粉丝保持互动\n4. 数据分析优化策略\n\n#${topic} #干货分享 #成长`,
          hashtags: [`#${topic}`, '#干货分享', '#实用技巧', '#效率提升'],
        };
      });
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/content" className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI 内容创作</h1>
          <p className="text-gray-500 mt-1">输入主题，AI自动生成适配各平台的内容</p>
        </div>
      </div>

      {/* Step 1: Input */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">输入内容主题</label>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="例如：AI工具推荐、社交媒体运营技巧、产品测评..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">选择发布平台</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map(p => (
              <button key={p.id} onClick={() => togglePlatform(p.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  selectedPlatforms.includes(p.id)
                    ? 'bg-primary-50 text-primary-700 border-primary-300 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">语气风格</label>
          <div className="flex flex-wrap gap-2">
            {tones.map(t => (
              <button key={t.id} onClick={() => setTone(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  tone === t.id
                    ? 'bg-accent-50 text-accent-700 border-accent-300 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={!topic || selectedPlatforms.length === 0 || isGenerating}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> AI生成中...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI生成内容</>
          )}
        </button>
      </div>

      {/* Step 2: Generated Content */}
      {Object.keys(generatedContent).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">生成结果</h2>
          {Object.entries(generatedContent).map(([platform, content]) => (
            <div key={platform} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                  {platforms.find(p => p.id === platform)?.label || platform}
                </span>
                <button className="text-sm text-primary-600 font-medium hover:text-primary-700">编辑</button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{content.title}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line mb-3">{content.content}</p>
              <div className="flex flex-wrap gap-1.5">
                {content.hashtags.map((tag, i) => (
                  <span key={i} className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">保存草稿</button>
                <button className="px-4 py-2 text-sm bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-lg">发布</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
