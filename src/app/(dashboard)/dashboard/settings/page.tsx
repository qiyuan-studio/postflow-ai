'use client';

import { useState } from 'react';
import { Link2, Trash2, CheckCircle2, Plus, AlertCircle } from 'lucide-react';

const connectedPlatforms = [
  { id: 'xiaohongshu', label: '小红书', connected: true, avatar: '📕', followers: '12,384' },
  { id: 'douyin', label: '抖音', connected: true, avatar: '🎵', followers: '28,491' },
  { id: 'x', label: 'X/Twitter', connected: false, avatar: '🐦', followers: '-' },
  { id: 'reddit', label: 'Reddit', connected: false, avatar: '👽', followers: '-' },
];

const plans = [
  { name: '免费版', price: '¥0', features: ['1个平台连接', '10篇AI生成/月', '基础数据分析'], current: true },
  { name: '专业版', price: '¥99/月', features: ['5个平台连接', '无限AI生成', '高级数据分析', 'AI评论回复', '团队协作'], current: false },
  { name: '企业版', price: '¥299/月', features: ['无限平台连接', '无限AI生成', '全功能分析', 'API接入', '专属支持', '定制开发'], current: false },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-500 mt-1">管理你的账户和平台连接</p>
      </div>

      {/* Platform Connections */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">平台连接</h2>
        <p className="text-sm text-gray-500 mb-5">连接你的社交媒体账号，实现一键发布</p>
        <div className="space-y-3">
          {connectedPlatforms.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.avatar}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.label}</p>
                  <p className="text-xs text-gray-400">
                    {p.connected ? `${p.followers} 粉丝` : '未连接'}
                  </p>
                </div>
              </div>
              {p.connected ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />已连接
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700">
                  <Plus className="w-4 h-4" />连接
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">订阅计划</h2>
        <p className="text-sm text-gray-500 mb-5">选择适合你的计划</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-xl border p-5 ${
              plan.current ? 'border-primary-300 bg-primary-50/50' : 'border-gray-200'
            }`}>
              <h3 className="font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{plan.price}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <span className="block text-center mt-4 text-sm text-primary-600 font-medium">当前计划</span>
              ) : (
                <button className="w-full mt-4 px-4 py-2 text-sm bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">
                  升级
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
