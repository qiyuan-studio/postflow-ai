'use client';

import { FileText, Share2, TrendingUp, Users, ArrowUp, ArrowDown } from 'lucide-react';

const stats = [
  { label: '总发布数', value: '128', change: '+12%', up: true, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: '总曝光', value: '45.2万', change: '+23%', up: true, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: '总互动', value: '8,432', change: '+18%', up: true, icon: Share2, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: '粉丝增长', value: '+1,284', change: '-5%', up: false, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const recentPosts = [
  { title: 'AI工具推荐2025', platform: '小红书', status: '已发布', time: '2小时前', engagement: '1,284' },
  { title: '如何用ChatGPT提高效率', platform: '抖音', status: '已发布', time: '昨天', engagement: '3,421' },
  { title: '社交媒体运营技巧', platform: 'X/Twitter', status: '已发布', time: '3天前', engagement: '892' },
  { title: '新产品发布预告', platform: 'Reddit', status: '已预约', time: '明天 10:00', engagement: '-' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-500 mt-1">欢迎回来，这是你的内容概况</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">最近内容</h2>
          <button className="text-sm text-primary-600 font-medium hover:text-primary-700">查看全部</button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentPosts.map((post, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{post.platform}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{post.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{post.engagement}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  post.status === '已发布' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  {post.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">用AI生成新内容</h3>
            <p className="text-white/80 text-sm mt-1">输入主题，AI自动生成适配各平台的内容</p>
          </div>
          <a href="/dashboard/content"
            className="bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
            开始创作
          </a>
        </div>
      </div>
    </div>
  );
}
