'use client';

import { useState } from 'react';
import { Plus, Sparkles, Image, MoreHorizontal, Edit2, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

type Tab = 'all' | 'draft' | 'scheduled' | 'published';

const posts = [
  { id: 1, title: 'AI工具推荐2025：提升10倍效率', platform: '小红书/抖音', status: 'published' as const, date: '2025-06-20', engagement: '1,284' },
  { id: 2, title: '如何用ChatGPT写爆款文案', platform: '抖音/X', status: 'published' as const, date: '2025-06-19', engagement: '3,421' },
  { id: 3, title: '社交媒体运营的5个秘诀', platform: '小红书', status: 'scheduled' as const, date: '2025-06-25', engagement: '-' },
  { id: 4, title: 'AI视频制作入门指南', platform: '抖音/TikTok', status: 'draft' as const, date: '-', engagement: '-' },
  { id: 5, title: '产品发布预告：全新功能上线', platform: 'X/Reddit', status: 'draft' as const, date: '-', engagement: '-' },
];

const statusConfig = {
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-600', icon: Edit2 },
  scheduled: { label: '已预约', color: 'bg-blue-50 text-blue-700', icon: Clock },
  published: { label: '已发布', color: 'bg-green-50 text-green-700', icon: CheckCircle2 },
};

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const filteredPosts = activeTab === 'all' ? posts : posts.filter(p => p.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">内容管理</h1>
          <p className="text-gray-500 mt-1">管理和发布你的社交媒体内容</p>
        </div>
        <Link href="/dashboard/content/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          新建内容
        </Link>
      </div>

      {/* AI生成快速入口 */}
      <div className="bg-gradient-to-r from-purple-50 to-primary-50 rounded-2xl p-5 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-primary-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">用AI生成内容</p>
              <p className="text-sm text-gray-500">输入主题，AI自动生成适配各平台的文案</p>
            </div>
          </div>
          <Link href="/dashboard/content/new?ai=true"
            className="bg-white text-purple-700 px-4 py-2 rounded-xl font-medium text-sm border border-purple-200 hover:bg-purple-50 transition-all">
            AI创作
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'all' as Tab, label: '全部' },
          { key: 'draft' as Tab, label: '草稿' },
          { key: 'scheduled' as Tab, label: '已预约' },
          { key: 'published' as Tab, label: '已发布' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        {filteredPosts.map(post => {
          const StatusIcon = statusConfig[post.status].icon;
          return (
            <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    post.status === 'published' ? 'bg-green-500' :
                    post.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                </div>
                <div className="flex items-center gap-3 mt-1.5 ml-5">
                  <span className="text-xs text-gray-400">{post.platform}</span>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusConfig[post.status].color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig[post.status].label}
                  </span>
                  {post.date !== '-' && <span className="text-xs text-gray-400">{post.date}</span>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {post.engagement !== '-' && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{post.engagement}</p>
                    <p className="text-xs text-gray-400">互动</p>
                  </div>
                )}
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
