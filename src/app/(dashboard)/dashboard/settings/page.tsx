'use client';

import { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, Plus, Loader2, AlertCircle, CreditCard } from 'lucide-react';

const PLATFORM_CONFIG = [
  { id: 'xiaohongshu', label: '小红书', icon: '📕' },
  { id: 'douyin', label: '抖音', icon: '🎵' },
  { id: 'twitter', label: 'X (Twitter)', icon: '🐦' },
  { id: 'reddit', label: 'Reddit', icon: '👽' },
  { id: 'tiktok', label: 'TikTok', icon: '📱' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
];

const plans = [
  { id: 'free', name: '免费版', price: '¥0', features: ['1个平台连接', '10篇AI生成/月', '基础数据分析'] },
  { id: 'pro', name: '专业版', price: '¥99/月', features: ['5个平台连接', '无限AI生成', '高级数据分析', 'AI评论回复', '团队协作'] },
  { id: 'enterprise', name: '企业版', price: '¥299/月', features: ['无限平台连接', '无限AI生成', '全功能分析', 'API接入', '专属支持', '定制开发'] },
];

interface PlatformAccount {
  platform: string;
  platformUserName: string | null;
  isConnected: boolean;
  platformUserId: string | null;
}

export default function SettingsPage() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [platforms, setPlatforms] = useState<PlatformAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const [subRes, platRes] = await Promise.all([
        fetch('/api/subscription'),
        fetch('/api/platforms'),
      ]);
      const subData = await subRes.json();
      const platData = await platRes.json();
      setCurrentPlan(subData.plan || 'free');
      setPlatforms(Array.isArray(platData) ? platData : []);
    } catch (e) {
      console.error('Failed to fetch settings', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade(planId: string) {
    setUpgrading(planId);
    setMessage(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: '创建支付会话失败，请稍后重试' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: '网络错误，请检查连接' });
    } finally {
      setUpgrading(null);
    }
  }

  async function handleConnectPlatform(platformId: string) {
    setMessage(null);
    try {
      const res = await fetch('/api/platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: platformId }),
      });
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else if (data.success) {
        setMessage({ type: 'success', text: `${PLATFORM_CONFIG.find(p => p.id === platformId)?.label} 连接成功！` });
        fetchSettings();
      } else {
        setMessage({ type: 'error', text: '连接失败，请稍后重试' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: '网络错误，请检查连接' });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">设置</h1>
        <p className="text-gray-500 mt-1">管理你的账户和平台连接</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-2 ${
          message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Platform Connections */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">平台连接</h2>
        <p className="text-sm text-gray-500 mb-5">连接你的社交媒体账号，实现一键发布</p>
        <div className="space-y-3">
          {PLATFORM_CONFIG.map((cfg) => {
            const account = platforms.find(p => p.platform === cfg.id);
            const connected = account?.isConnected ?? false;
            return (
              <div key={cfg.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cfg.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cfg.label}</p>
                    {connected && account?.platformUserName && (
                      <p className="text-xs text-gray-400">@{account.platformUserName}</p>
                    )}
                  </div>
                </div>
                {connected ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />已连接
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnectPlatform(cfg.id)}
                    className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700"
                  >
                    <Plus className="w-4 h-4" />连接
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">订阅计划</h2>
        <p className="text-sm text-gray-500 mb-5">选择适合你的计划</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map(plan => {
            const isCurrent = currentPlan === plan.id;
            return (
              <div key={plan.name} className={`rounded-xl border p-5 ${
                isCurrent ? 'border-primary-300 bg-primary-50/50 dark:bg-primary-900/20 dark:border-primary-700' : 'border-gray-200 dark:border-gray-700'
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
                {isCurrent ? (
                  <span className="block text-center mt-4 text-sm text-primary-600 font-medium">
                    {plan.id === 'free' ? '当前计划（免费）' : '当前计划'}
                  </span>
                ) : plan.id === 'free' ? (
                  <span className="block text-center mt-4 text-sm text-gray-400">免费</span>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id}
                    className="w-full mt-4 px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {upgrading === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    {upgrading === plan.id ? '处理中...' : '立即升级'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
