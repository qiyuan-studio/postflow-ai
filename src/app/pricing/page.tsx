import Link from "next/link";
import { Check, Sparkles, Zap, Building2, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "免费版",
    price: "¥0",
    period: "/月",
    description: "适合个人创作者体验",
    features: [
      "1 个平台接入",
      "每月 10 次 AI 生成",
      "基础内容评分",
      "内容管理",
      "社区支持",
    ],
    cta: "开始使用",
    href: "/register",
    highlighted: false,
    color: "gray",
  },
  {
    name: "专业版",
    price: "¥99",
    period: "/月",
    description: "适合专业创作者和自媒体人",
    features: [
      "5 个平台接入",
      "无限 AI 生成",
      "AI 内容评分 + SEO 优化建议",
      "跨平台内容适配",
      "发布排期管理",
      "Webhook 通知",
      "API 接入 (1000次/月)",
      "邮件支持",
    ],
    cta: "升级专业版",
    href: "/dashboard/settings",
    highlighted: true,
    color: "accent",
    badge: "最受欢迎",
  },
  {
    name: "企业版",
    price: "¥299",
    period: "/月",
    description: "适合工作室和企业团队",
    features: [
      "无限平台接入",
      "无限 AI 生成",
      "全功能内容分析",
      "优先 Webhook + 自定义集成",
      "API 接入 (10000次/月)",
      "授权码分销系统",
      "专属客户经理",
      "私有化部署可选",
      "SLA 保障",
    ],
    cta: "联系销售",
    href: "/dashboard/settings",
    highlighted: false,
    color: "purple",
    badge: "企业级",
  },
];

const apiPlans = [
  {
    name: "API 入门",
    price: "¥199",
    period: "/月",
    calls: "5,000",
    features: [
      "AI 内容生成 API",
      "内容评分 API",
      "跨平台适配 API",
      "标准响应速度",
      "邮件支持",
    ],
  },
  {
    name: "API 专业",
    price: "¥499",
    period: "/月",
    calls: "25,000",
    features: [
      "全部 API 端点",
      "更高优先级",
      "自定义模型参数",
      "Webhook 回调",
      "专属技术支持",
    ],
    badge: "热门",
  },
  {
    name: "API 企业",
    price: "¥1,999",
    period: "/月",
    calls: "100,000",
    features: [
      "无限 API 调用",
      "最高优先级",
      "私有模型微调",
      "定制 SLA",
      "7×24 技术支援",
    ],
    badge: "高性能",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-900">
          简单透明的定价
        </h1>
        <p className="text-lg text-primary-500 mt-4 max-w-2xl mx-auto">
          无论你是个人创作者还是企业团队，PostFlow AI 都能满足你的内容管理需求
        </p>
      </div>

      {/* SaaS Plans */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-primary-900 text-center mb-10">
          SaaS 订阅计划
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border-2 p-8 transition-all hover:shadow-xl ${
                plan.highlighted
                  ? "border-accent-500 bg-white shadow-lg scale-105"
                  : "border-primary-100 bg-white"
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white ${
                    plan.highlighted ? "bg-accent-600" : "bg-purple-600"
                  }`}
                >
                  {plan.badge}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-primary-900">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-primary-900">{plan.price}</span>
                  <span className="text-primary-400 ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-primary-500 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-primary-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full py-3 rounded-xl font-medium text-center transition-all ${
                  plan.highlighted
                    ? "bg-accent-600 text-white hover:bg-accent-700"
                    : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* API Plans */}
      <div className="bg-primary-50/50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-primary-900">API 调用套餐</h2>
            <p className="text-primary-500 mt-2">
              适合开发者、SaaS 平台和企业集成
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apiPlans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white rounded-3xl border border-primary-100 p-8 hover:shadow-lg transition-all relative"
              >
                {plan.badge && (
                  <div className="absolute -top-3 right-6 px-3 py-1 bg-accent-600 text-white text-xs font-bold rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 text-accent-700 rounded-full text-sm font-medium mb-3">
                    <Zap className="w-4 h-4" />
                    {plan.calls} 次/月
                  </div>
                  <h3 className="text-xl font-bold text-primary-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-primary-900">{plan.price}</span>
                    <span className="text-primary-400 ml-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-primary-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard/settings"
                  className="block w-full py-3 bg-primary-900 text-white rounded-xl font-medium text-center hover:bg-primary-800 transition-colors"
                >
                  购买套餐
                </Link>
              </div>
            ))}
          </div>

          {/* API docs link */}
          <div className="text-center mt-8">
            <Link
              href="/dashboard/api-keys"
              className="inline-flex items-center gap-2 text-accent-600 font-medium hover:underline"
            >
              查看 API 文档 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-primary-900 text-center mb-10">
          常见问题
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "可以随时取消订阅吗？",
              a: "是的，你可以随时取消订阅。取消后，当前计费周期结束后将不会续费，但已付费期间可正常使用所有功能。",
            },
            {
              q: "API 调用次数用完了怎么办？",
              a: "可以在设置页面购买额外的调用包，或者升级到更高套餐。未使用的调用次数不会累积到下个月。",
            },
            {
              q: "是否支持私有化部署？",
              a: "企业版支持私有化部署。我们提供 Docker 镜像和一键部署脚本，你可以部署在自己的服务器上。",
            },
            {
              q: "如何获取授权码进行分销？",
              a: "企业版用户可以在后台生成授权码，支持自定义价格、有效期和激活次数。适合 SaaS 转售。",
            },
          ].map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl border border-primary-100 p-6">
              <h3 className="font-semibold text-primary-900">{faq.q}</h3>
              <p className="text-sm text-primary-500 mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
