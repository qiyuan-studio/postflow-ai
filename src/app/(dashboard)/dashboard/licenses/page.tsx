"use client";

import { useState, useEffect } from "react";
import { Key, Copy, Check, Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface License {
  id: string;
  key: string;
  plan: string;
  status: string;
  maxActivations: number;
  currentActivations: number;
  activatedAt: string | null;
  expiresAt: string | null;
  buyerEmail: string | null;
  buyerName: string | null;
  price: number | null;
  createdAt: string;
}

export default function LicensesAdminPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createPlan, setCreatePlan] = useState("pro");
  const [createEmail, setCreateEmail] = useState("");
  const [createName, setCreateName] = useState("");
  const [createPrice, setCreatePrice] = useState("299");
  const [createDays, setCreateDays] = useState("365");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState("");

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/licenses");
      if (!res.ok) throw new Error("获取失败");
      const data = await res.json();
      setLicenses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLicenses(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: createPlan,
          buyerEmail: createEmail || undefined,
          buyerName: createName || undefined,
          price: createPrice ? Number(createPrice) : undefined,
          expiresInDays: createDays ? Number(createDays) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewKey(data.key);
      setShowCreate(false);
      fetchLicenses();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-50 text-green-600",
      used: "bg-blue-50 text-blue-600",
      revoked: "bg-red-50 text-red-600",
      expired: "bg-gray-100 text-gray-500",
    };
    return map[status] || "bg-gray-100 text-gray-500";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">授权码管理</h1>
            <p className="text-sm text-primary-500">管理独立部署授权码的生成与分发</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchLicenses} className="flex items-center gap-2 px-4 py-2 border border-primary-200 rounded-xl text-sm hover:bg-primary-50 transition-all">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
            {showCreate ? "取消" : <><Plus className="w-4 h-4" /> 生成授权码</>}
          </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-primary-100 p-6 mb-8 space-y-4">
          <h3 className="font-bold text-primary-900">生成新授权码</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary-600 mb-1">授权方案</label>
              <select value={createPlan} onChange={(e) => setCreatePlan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm bg-white">
                <option value="pro">Pro版 - ¥299</option>
                <option value="enterprise">企业版 - ¥999</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-primary-600 mb-1">有效期（天）</label>
              <input type="number" value={createDays} onChange={(e) => setCreateDays(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-primary-600 mb-1">购买者邮箱</label>
              <input type="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-primary-600 mb-1">购买者名称</label>
              <input type="text" value={createName} onChange={(e) => setCreateName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-primary-600 mb-1">价格（¥）</label>
              <input type="number" value={createPrice} onChange={(e) => setCreatePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm" />
            </div>
          </div>
          <button type="submit" disabled={creating}
            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">
            {creating ? "生成中..." : "生成授权码"}
          </button>
        </form>
      )}

      {newKey && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold text-green-700 mb-2">授权码已生成！请复制并安全保存：</p>
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-green-200">
            <code className="flex-1 text-lg font-mono font-bold text-green-800 select-all">{newKey}</code>
            <button onClick={() => copyKey(newKey, "new")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">复制</button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 mb-6">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-primary-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-100 bg-primary-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary-500">授权码</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary-500">方案</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary-500">状态</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary-500">激活数</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary-500">买家</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary-500">价格</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary-500">创建时间</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {licenses.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-primary-400 text-sm">还没有授权码，点击上方"生成授权码"开始</td></tr>
              ) : licenses.map((lic) => (
                <tr key={lic.id} className="border-b border-primary-50 hover:bg-primary-50/50 transition-all">
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono text-primary-800">{lic.key.slice(0, 14)}...</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${lic.plan === "enterprise" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                      {lic.plan === "enterprise" ? "企业版" : "Pro版"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusBadge(lic.status)}`}>
                      {lic.status === "active" ? "未使用" : lic.status === "used" ? "已激活" : lic.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary-600">{lic.currentActivations}/{lic.maxActivations}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-primary-700">{lic.buyerName || "-"}</div>
                    <div className="text-xs text-primary-400">{lic.buyerEmail || ""}</div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-primary-800">{lic.price ? `¥${lic.price}` : "-"}</td>
                  <td className="px-4 py-3 text-sm text-primary-400">{new Date(lic.createdAt).toLocaleDateString("zh-CN")}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => copyKey(lic.key, lic.id)} className="p-2 text-primary-400 hover:text-accent-500 transition-all">
                      {copiedId === lic.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 bg-gradient-to-r from-accent-50 to-blue-50 border border-accent-200 rounded-2xl p-6">
        <h3 className="font-bold text-primary-900 mb-2">售卖建议</h3>
        <ul className="space-y-1 text-sm text-primary-600">
          <li>在 ClawHub、第三方交易平台或私域销售授权码</li>
          <li>Pro版 299/次（含1年更新），企业版 999/次（含10次激活）</li>
          <li>买家获得授权码后，在部署页面输入即可激活</li>
          <li>支持自定义品牌和独立域名部署</li>
        </ul>
      </div>
    </div>
  );
}
