import Link from 'next/link';
import { ArrowRight, Sparkles, Share2, BarChart3, Bot, Globe, Zap, Star, Shuffle, Video, TrendingUp } from 'lucide-react';

const features = [
  { icon: Bot, title: 'AI 内容创作', desc: '基于AI自动生成适配各平台风格的文案、视频脚本和SEO博客' },
  { icon: Shuffle, title: '跨平台内容适配', desc: '一篇内容自动适配小红书/抖音/X/知乎等主流平台风格' },
  { icon: Star, title: 'AI 内容评分', desc: '多维度分析内容质量，给出可执行的改进建议' },
  { icon: Video, title: '短视频脚本工厂', desc: 'AI生成爆款短视频脚本，含分镜、口播词和画面描述' },
  { icon: TrendingUp, title: '爆款选题挖掘', desc: 'AI分析各平台热点趋势，为你推荐高流量选题方向' },
  { icon: BarChart3, title: '智能数据分析', desc: '实时追踪各平台数据，AI自动优化发布策略' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                PostFlow
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
                定价
              </Link>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
                登录
              </Link>
              <Link href="/demo" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">免费体验</Link>
              <Link href="/register"
                className="text-sm font-medium bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                免费开始
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI 驱动的下一代社交媒体管理工具
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              用AI创作内容，
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">一键发布全网</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
              PostFlow AI 帮你自动生成适配各平台的内容，定时发布到抖音、小红书、X、Reddit，
              智能分析数据，让你专注于创作本身。
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/demo" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">免费体验</Link>
              <Link href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/25 transition-all">
                免费开始使用
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
                了解更多
              </Link>
            </div>
          </div>
        </div>
        {/* Gradient decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-primary-500/5 via-accent-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              强大而简单的功能
            </h2>
            <p className="text-lg text-gray-500">你需要的社交媒体管理工具，全都在这里</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group p-8 bg-gray-50 rounded-2xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
            {/* Demo Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            10秒生成一篇爆款文案
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            输入主题，选择平台，AI 自动生成适合小红书/抖音/公众号/推特的内容
          </p>
          <Link href="/demo"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/25 transition-all group">
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            免费体验 AI 创作
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">📕</div>
              <div className="text-sm font-medium text-gray-700">小红书</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">🎵</div>
              <div className="text-sm font-medium text-gray-700">抖音</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">💬</div>
              <div className="text-sm font-medium text-gray-700">公众号</div>
            </div>
          </div>
        </div>
      </section>

<section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              简单透明的定价
            </h2>
            <p className="text-lg text-gray-500">选择适合你的计划，随时升级或取消</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">免费版</h3>
              <p className="text-4xl font-bold text-gray-900 mt-4">¥0</p>
              <p className="text-sm text-gray-500 mt-1">适合个人试用</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>1个平台连接</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>10篇AI生成/月</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>基础内容管理</li>
                <li className="flex items-center gap-2 text-sm text-gray-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>无数据分析</li>
                <li className="flex items-center gap-2 text-sm text-gray-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>无API接入</li>
              </ul>
              <Link href="/demo" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">免费体验</Link>
              <Link href="/register" className="block text-center mt-8 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">免费开始</Link>
            </div>

            {/* Pro - Recommended */}
            <div className="bg-white rounded-2xl p-8 border-2 border-primary-500 shadow-xl relative transform scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold px-4 py-1 rounded-full">最受欢迎</div>
              <h3 className="text-lg font-semibold text-gray-900">专业版</h3>
              <p className="text-4xl font-bold text-gray-900 mt-4">¥99<span className="text-lg font-normal text-gray-500">/月</span></p>
              <p className="text-sm text-gray-500 mt-1">适合内容创作者</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>5个平台连接</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>无限AI生成</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>SEO博客生成器</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>高级数据分析</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>API接入</li>
              </ul>
              <Link href="/demo" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">免费体验</Link>
              <Link href="/register" className="block text-center mt-8 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all">立即订阅</Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">企业版</h3>
              <p className="text-4xl font-bold text-gray-900 mt-4">¥299<span className="text-lg font-normal text-gray-500">/月</span></p>
              <p className="text-sm text-gray-500 mt-1">适合团队和企业</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>无限平台连接</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>无限AI生成</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>全功能分析</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>专属支持</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>定制开发</li>
              </ul>
              <Link href="/demo" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">免费体验</Link>
              <Link href="/register" className="block text-center mt-8 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">联系我们</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 rounded-3xl p-12 sm:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              准备好提升你的社交媒体效率了吗？
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              加入 PostFlow，用AI让你的内容创作效率提升10倍
            </p>
            <Link href="/demo" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">免费体验</Link>
              <Link href="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:shadow-xl transition-all">
              免费开始使用
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          © 2025 PostFlow AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
