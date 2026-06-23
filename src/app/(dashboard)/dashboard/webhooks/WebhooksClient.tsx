"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Webhook,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Check,
  Zap,
} from "lucide-react";

const eventOptions = [
  { value: "content.published", label: "内容已发布" },
  { value: "content.scheduled", label: "内容已排期" },
  { value: "content.failed", label: "内容发布失败" },
];

interface WebhookItem {
  id: string;
  name: string;
  url: string;
  secret: string | null;
  events: string[];
  active: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
}

export function WebhooksClient({ webhooks: initial }: { webhooks: WebhookItem[] }) {
  const router = useRouter();
  const [webhooks, setWebhooks] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["content.published"]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim() || !url.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), url: url.trim(), events }),
      });
      const data = await res.json();
      if (data.data) {
        setWebhooks([{ ...data.data, events: JSON.parse(data.data.events || "[]") }, ...webhooks]);
        setShowForm(false);
        setName("");
        setUrl("");
        setEvents(["content.published"]);
        setMessage({ type: "success", text: "Webhook 创建成功！" });
      } else {
        setMessage({ type: "error", text: data.error || "创建失败" });
      }
    } catch {
      setMessage({ type: "error", text: "网络错误" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个 Webhook 吗？")) return;
    try {
      const res = await fetch(`/api/webhooks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setWebhooks(webhooks.filter((w) => w.id !== id));
        setMessage({ type: "success", text: "Webhook 已删除" });
      }
    } catch {
      setMessage({ type: "error", text: "删除失败" });
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const res = await fetch("/api/webhooks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      if (res.ok) {
        setWebhooks(webhooks.map((w) => (w.id === id ? { ...w, active } : w)));
      }
    } catch {
      setMessage({ type: "error", text: "更新失败" });
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch("/api/webhooks/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setMessage({
        type: data.success ? "success" : "error",
        text: data.success ? "测试发送成功！" : `发送失败: ${data.error || "未知错误"}`,
      });
    } catch {
      setMessage({ type: "error", text: "测试失败" });
    } finally {
      setTestingId(null);
    }
  };

  const copySecret = (secret: string, id: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleEvent = (event: string) => {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2 text-sm ${
            message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          }`}
        >
          {message.type === "error" ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {message.text}
          <button className="ml-auto" onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-primary-100 p-6">
          <h3 className="font-semibold text-primary-900 mb-4">新建 Webhook</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：发布到我的博客"
                className="w-full px-4 py-2.5 rounded-xl border border-primary-200 outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">回调 URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-service.com/webhook"
                className="w-full px-4 py-2.5 rounded-xl border border-primary-200 outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">触发事件</label>
              <div className="flex flex-wrap gap-2">
                {eventOptions.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => toggleEvent(e.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      events.includes(e.value)
                        ? "bg-accent-600 text-white"
                        : "bg-primary-100 text-primary-600 hover:bg-primary-200"
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-primary-600 hover:text-primary-800"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !name.trim() || !url.trim()}
                className="px-4 py-2 text-sm bg-accent-600 text-white rounded-xl font-medium hover:bg-accent-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                创建 Webhook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook List */}
      {webhooks.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-primary-100 p-12 text-center">
          <Webhook className="w-12 h-12 text-primary-300 mx-auto mb-4" />
          <p className="text-primary-500">还没有配置 Webhook 通知</p>
          <p className="text-sm text-primary-400 mt-1">
            配置 Webhook 后，内容发布时将自动通知你的服务
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 px-5 py-2.5 bg-accent-600 text-white rounded-xl font-medium hover:bg-accent-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> 新建 Webhook
          </button>
        </div>
      ) : (
        <>
          {webhooks.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-accent-600 text-white rounded-xl text-sm font-medium hover:bg-accent-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> {showForm ? "取消" : "新建 Webhook"}
              </button>
            </div>
          )}

          <div className="space-y-3">
            {webhooks.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl border border-primary-100 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${w.active ? "bg-green-500" : "bg-gray-300"}`} />
                      <h3 className="font-medium text-primary-900">{w.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        w.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {w.active ? "活跃" : "已停用"}
                      </span>
                    </div>
                    <code className="text-xs text-primary-400 block mt-1 font-mono truncate">
                      {w.url}
                    </code>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {w.events.map((ev: string) => (
                        <span key={ev} className="text-xs px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full">
                          {eventOptions.find((o) => o.value === ev)?.label || ev}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-primary-400">
                      <span>创建于 {new Date(w.createdAt).toLocaleDateString("zh-CN")}</span>
                      {w.lastTriggeredAt && (
                        <span>最后触发: {new Date(w.lastTriggeredAt).toLocaleString("zh-CN")}</span>
                      )}
                    </div>
                    {w.secret && (
                      <div className="mt-2 flex items-center gap-2">
                        <code className="text-xs font-mono text-primary-400 bg-primary-50 px-2 py-1 rounded">
                          Secret: {w.secret.slice(0, 16)}...
                        </code>
                        <button
                          onClick={() => copySecret(w.secret!, w.id)}
                          className="text-primary-400 hover:text-primary-600"
                        >
                          {copiedId === w.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleTest(w.id)}
                      disabled={testingId === w.id}
                      className="p-2 text-primary-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                      title="测试发送"
                    >
                      {testingId === w.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggle(w.id, !w.active)}
                      className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title={w.active ? "停用" : "启用"}
                    >
                      {w.active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="p-2 text-primary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Integration Tips */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-100 p-6">
        <h2 className="font-semibold text-primary-900 mb-3">💡 自动化场景示例</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white/80 rounded-xl p-4">
            <p className="font-medium text-primary-800">自动发布到博客</p>
            <p className="text-primary-500 mt-1">内容发布时 → 调用你的博客 API → 自动创建文章</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4">
            <p className="font-medium text-primary-800">Slack / Discord 通知</p>
            <p className="text-primary-500 mt-1">内容发布时 → 发送通知到团队频道</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4">
            <p className="font-medium text-primary-800">n8n / Make 工作流</p>
            <p className="text-primary-500 mt-1">内容发布时 → 触发复杂自动化流程</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4">
            <p className="font-medium text-primary-800">数据备份</p>
            <p className="text-primary-500 mt-1">内容发布时 → 保存到数据库或云存储</p>
          </div>
        </div>
      </div>
    </div>
  );
}
