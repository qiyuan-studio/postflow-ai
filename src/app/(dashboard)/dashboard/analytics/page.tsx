'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Users, Eye, Heart, Share2, Download } from 'lucide-react';

const overviewData = [
  { label: '总曝光', value: '452,381', change: '+23.5%', up: true, icon: Eye, color: 'text-blue-600' },
  { label: '总互动', value: '8,432', change: '+18.2%', up: true, icon: Heart, color: 'text-red-600' },
  { label: '粉丝增长', value: '+1,284', change: '+12.7%', up: true, icon: Users, color: 'text-green-600' },
  { label: '互动率', value: '1.86%', change: '-0.3%', up: false, icon: BarChart3, color: 'text-orange-600' },
];

const platformPerformance = [
  { platform: '小红书', followers: '12,384', engagement: '3.2%', posts: 45, growth: '+8.5%' },
  { platform: '抖音', followers: '28,491', engagement: '4.1%', posts: 32, growth: '+15.2%' },
  { platform: 'X/Twitter', followers: '3,847', engagement: '1.8%', posts: 28, growth: '+3.1%' },
  { platform: 'Reddit', followers: '1,234', engagement: '5.2%', posts: 15, growth: '+22.4%' },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="text-gray-500 mt-1">各平台数据表现一览</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          {[['7d', '7天'], ['30d', '30天'], ['90d', '90天']].map(([k, v]) => (
            <button key={k} onClick={() => setPeriod(k)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === k ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}>{v}</button>
          ))}
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewData.map(d => (
          <div key={d.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <d.icon className={`w-5 h-5 ${d.color}`} />
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${d.up ? 'text-green-600' : 'text-red-600'}`}>
                {d.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {d.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{d.value}</p>
            <p className="text-sm text-gray-500 mt-1">{d.label}</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">数据趋势</h2>
        <div className="h-64 bg-gradient-to-b from-primary-50/50 to-transparent rounded-xl flex items-center justify-center">
          <p className="text-gray-400 text-sm">数据图表将在连接真实数据后显示</p>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">平台表现</h2>
          <button className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase">
                <th className="text-left p-4 font-medium">平台</th>
                <th className="text-right p-4 font-medium">粉丝数</th>
                <th className="text-right p-4 font-medium">互动率</th>
                <th className="text-right p-4 font-medium">发布数</th>
                <th className="text-right p-4 font-medium">增长率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {platformPerformance.map(p => (
                <tr key={p.platform} className="hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-900">{p.platform}</td>
                  <td className="p-4 text-sm text-right text-gray-700">{p.followers}</td>
                  <td className="p-4 text-sm text-right text-gray-700">{p.engagement}</td>
                  <td className="p-4 text-sm text-right text-gray-700">{p.posts}</td>
                  <td className="p-4 text-sm text-right text-green-600 font-medium">{p.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
