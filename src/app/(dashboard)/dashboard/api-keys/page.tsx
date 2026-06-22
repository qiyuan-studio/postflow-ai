'use client';

import { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  lastUsed: string | null;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { fetchKeys(); }, []);

  async function fetchKeys() {
    try {
      const res = await fetch('/api/api-keys');
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (e) {
      console.error('Failed to fetch API keys', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setMessage(null);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      const data = await res.json();
      if (data.key) {
        setNewKeyValue(data.key);
        setShowNewKey(false);
        setNewKeyName('');
        await fetchKeys();
      } else {
        setMessage({ type: 'error', text: data.error || '创建失败' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(keyId: string) {
    if (!confirm('确定要删除这个 API Key 吗？使用该 Key 的应用将立即失效。')) return;
    setMessage(null);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'API Key 已删除' });
        await fetchKeys();
      } else {
        setMessage({ type: 'error', text: data.error || '删除失败' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: '网络错误' });
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h1>
          <p className="text-gray-500 mt-1">管理 API 密钥，用于第三方应用集成</p>
        </div>
        <button
          onClick={() => { setShowNewKey(true); setNewKeyValue(null); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
        >
          <Plus className="w-4 h-4" />创建 Key
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-2 ${
          message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Create new key dialog */}
      {showNewKey && !newKeyValue && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">创建新的 API Key</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="例如：n8n 工作流、我的博客"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNewKey(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newKeyName.trim()}
                className="px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New key created - show once */}
      {newKeyValue && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-semibold mb-2">
            <AlertCircle className="w-5 h-5" />
            API Key 已创建 — 请立即保存！
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-300 mb-4">
            出于安全原因，此密钥只会显示一次。请将其复制并保存在安全的地方。
          </p>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-3 border border-amber-200">
            <code className="flex-1 text-sm font-mono text-gray-900 dark:text-white break-all">{newKeyValue}</code>
            <button
              onClick={() => copyToClipboard(newKeyValue)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600"
            >
              {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={() => setNewKeyValue(null)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            已安全保存，关闭
          </button>
        </div>
      )}

      {/* Existing keys */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="p-6">
          {keys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">还没有创建 API Key</p>
              <p className="text-sm text-gray-400 mt-1">创建 Key 来连接第三方应用</p>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{k.name}</span>
                      {!k.active && (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">已禁用</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs font-mono text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {k.key}
                      </code>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span>创建于 {new Date(k.createdAt).toLocaleDateString('zh-CN')}</span>
                      {k.lastUsed && <span>上次使用: {new Date(k.lastUsed).toLocaleDateString('zh-CN')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* API docs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">如何使用 API</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500 mb-2">所有 API 请求都需要在 Header 中携带 API Key：</p>
            <pre className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-xs font-mono">
              {`curl -H "Authorization: Bearer pf_xxxxxxxx..." \\
  -H "Content-Type: application/json" \\
  https://your-domain.com/api/open/v1/content`}
            </pre>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-2">可用端点</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="px-2 py-0.5 text-xs font-bold text-green-700 bg-green-100 rounded">GET</span>
                <code className="text-xs font-mono">/api/open/v1/me</code>
                <span className="text-xs text-gray-400">获取用户信息</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="px-2 py-0.5 text-xs font-bold text-blue-700 bg-blue-100 rounded">POST</span>
                <code className="text-xs font-mono">/api/open/v1/content</code>
                <span className="text-xs text-gray-400">创建内容</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="px-2 py-0.5 text-xs font-bold text-blue-700 bg-blue-100 rounded">POST</span>
                <code className="text-xs font-mono">/api/open/v1/content/generate</code>
                <span className="text-xs text-gray-400">AI 生成内容</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="px-2 py-0.5 text-xs font-bold text-purple-700 bg-purple-100 rounded">GET</span>
                <code className="text-xs font-mono">/api/open/v1/analytics</code>
                <span className="text-xs text-gray-400">获取分析数据</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* n8n integration guide */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          集成到 n8n 工作流
        </h2>
        <div className="space-y-4 text-sm text-gray-500">
          <p>使用 HTTP Request 节点连接 PostFlow AI API：</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>在 n8n 中添加 <strong>HTTP Request</strong> 节点</li>
            <li>设置 Method 为需要的请求类型</li>
            <li>在 Authentication 中选择 <strong>Generic Credential</strong> 或 <strong>Header Auth</strong></li>
            <li>添加 Header: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Authorization: Bearer YOUR_API_KEY</code></li>
            <li>URL 填写对应的 API 端点</li>
          </ol>
          <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
            <p className="font-medium text-gray-900 mb-1">💡 自动化场景示例</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• RSS 抓取 → AI 改写 → 自动发布到小红书</li>
              <li>• 定时任务 → 生成日报 → 发布到 X/Twitter</li>
              <li>• Slack 收到消息 → AI 生成内容 → 排期发布</li>
              <li>• Google Sheets 更新 → 批量生成内容 → 跨平台发布</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
