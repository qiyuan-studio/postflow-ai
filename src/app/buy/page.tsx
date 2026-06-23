"use client";

import { useState } from "react";
import { Copy, Check, CheckCircle, Shield, Zap, Server, Download, Mail } from "lucide-react";
import Link from "next/link";

export default function BuyPage() {
  const [step, setStep] = useState<"plans" | "form" | "success">("plans");
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "enterprise">("pro");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSelectPlan = (plan: "pro" | "enterprise") => {
    setSelectedPlan(plan);
    setStep("form");
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/buy/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, email, name }),
      });
      const data = await res.json();
      if (data.success) {
        setLicenseKey(data.key);
        setStep("success");
      } else {
        alert("购买失败: " + data.error);
      }
    } catch (err) {
      alert("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                PostFlow AI
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            购买授权，自助部署
          </h1>
          <p className="text-lg text-gray-500">
            买断式授权，部署在你自己的服务器，数据完全私有
          </p>
        </div>
      </section>

      {/* Step 1: Plans */}
      {step === "plans" && (
        <section className="pb-24">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pro */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">专业版</h3>
                  <p className="text-sm text-gray-500">适合个人创作者</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">¥299</p>
              <p className="text-sm text-gray-400 mb-6">永久授权 · 1台服务器</p>
              <ul className="space-y-3 mb-8">
                {["无限 AI 内容生成", "5 个平台适配", "SEO 优化 + 评分", "内容排期 + Webhook", "API 接入 (1000次/月)", "1 年更新"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSelectPlan("pro")}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all">
                购买 ¥299
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border-2 border-primary-500 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                推荐
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                  <Server className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">企业版</h3>
                  <p className="text-sm text-gray-500">适合团队和企业</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">¥999</p>
              <p className="text-sm text-gray-400 mb-6">永久授权 · 10台服务器</p>
              <ul className="space-y-3 mb-8">
                {["无限 AI 内容生成", "无限平台适配", "全功能分析", "所有 API 无限制", "OEM 品牌定制", "1 年更新 + 优先支持"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSelectPlan("enterprise")}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                购买 ¥999
              </button>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> 授权码即时生成 · 不满意 7 天内可退款
            </p>
          </div>
        </section>
      )}

      {/* Step 2: Form */}
      {step === "form" && (
        <section className="pb-24">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                购买 {selectedPlan === "pro" ? "专业版" : "企业版"}
              </h2>
              <p className="text-3xl font-bold text-gray-900 mb-6">
                ¥{selectedPlan === "pro" ? "299" : "999"}
              </p>
              <form onSubmit={handlePurchase} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名 (可选)</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="你的姓名" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? "处理中..." : `确认购买 ¥${selectedPlan === "pro" ? "299" : "999"}`}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  购买即表示同意我们的服务条款
                </p>
              </form>
              <button onClick={() => setStep("plans")}
                className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                ← 返回选择套餐
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Success */}
      {step === "success" && (
        <section className="pb-24">
          <div className="max-w-lg mx-auto px-4">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">购买成功！</h2>
              <p className="text-gray-500 mb-6">你的授权码已经生成，请妥善保管</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-400 mb-2">你的授权码</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-lg font-mono font-bold text-primary-600 bg-white px-4 py-2 rounded-lg border">
                    {licenseKey}
                  </code>
                  <button onClick={copyKey}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-all">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <p className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <Download className="w-4 h-4" /> 部署指南已发送到你的邮箱
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <Mail className="w-4 h-4" /> 同时也发到了 {email}
                </p>
              </div>

              <Link href="/"
                className="block w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                返回首页
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          © 2026 PostFlow AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
