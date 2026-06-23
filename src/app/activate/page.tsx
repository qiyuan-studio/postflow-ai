"use client";

import { useState, useEffect } from "react";
import { Key, Check, Loader2, AlertCircle, Shield, ExternalLink } from "lucide-react";

export default function ActivatePage() {
  const [licenseKey, setLicenseKey] = useState("");
  const [hostname, setHostname] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; plan?: string; expiresAt?: string } | null>(null);
  const [error, setError] = useState("");

  // Auto-detect hostname
  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/license/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: licenseKey.trim(),
          hostname: hostname || window.location.hostname,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "验证失败");
      setResult(data);
      
      // Save to localStorage
      localStorage.setItem("postflow_license", JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary-900">PostFlow AI 激活</h1>
          <p className="text-sm text-primary-500 mt-1">输入授权码激活您的独立部署版本</p>
        </div>

        {/* Activation Form */}
        <form onSubmit={handleActivate} className="bg-white rounded-2xl border border-primary-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">授权码</label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition-all text-sm font-mono text-center text-lg tracking-widest"
              maxLength={19}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">部署域名（自动检测）</label>
            <input
              type="text"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 bg-gray-50 text-sm text-primary-500"
              readOnly
            />
          </div>

          <button
            type="submit"
            disabled={loading || licenseKey.length < 19}
            className="w-full bg-gradient-to-r from-accent-500 to-accent-700 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-accent-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> 验证中...</>
            ) : (
              <><Key className="w-5 h-5" /> 立即激活</>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Success */}
        {result && result.valid && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-green-800 mb-2">\u2705 激活成功！</h2>
            <p className="text-sm text-green-700 mb-3">
              您的 PostFlow AI {result.plan === "enterprise" ? "企业版" : "Pro版"} 已激活
            </p>
            {result.expiresAt && (
              <p className="text-xs text-green-600">
                有效期至：{new Date(result.expiresAt).toLocaleDateString("zh-CN")}
              </p>
            )}
            <a href="/dashboard" className="mt-4 inline-block px-6 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-all">
              进入仪表盘
            </a>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 text-center text-xs text-primary-400">
          <p>如何获取授权码？请联系开发者购买</p>
          <p className="mt-1">8873721@qq.com</p>
        </div>
      </div>
    </div>
  );
}
