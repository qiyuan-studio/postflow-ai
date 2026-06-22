# PostFlow AI 🚀

> AI 驱动的多平台社交媒体内容管理系统 — 开源替代 Postiz、Buffer、Hootsuite，覆盖国内+海外平台

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://docker.com)
[![GitHub Stars](https://img.shields.io/github/stars/qiyuan-studio/postflow-ai?style=flat-square&logo=github)](https://github.com/qiyuan-studio/postflow-ai)

</div>

<p align="center">
  <img src="https://img.shields.io/github/stars/qiyuan-studio/postflow-ai?style=for-the-badge&logo=github" alt="stars">
  <img src="https://img.shields.io/github/forks/qiyuan-studio/postflow-ai?style=for-the-badge&logo=github" alt="forks">
</p>

---

## 🌟 为什么选择 PostFlow AI？

| 特性 | PostFlow AI | Postiz | Brightbean Studio | Free AI Scheduler |
|------|-------------|--------|-------------------|-------------------|
| **技术栈** | Next.js 15 + TypeScript | Next.js + TypeScript | Python + Django | Next.js |
| **AI 生成** | ✅ OpenAI GPT-4o | ❌ 需要额外配置 | ❌ 无AI | ❌ 无AI |
| **国内平台** | ✅ 小红书、抖音 | ❌ 仅海外 | ❌ 仅海外 | ❌ 仅海外 |
| **海外平台** | ✅ X、Reddit、TikTok等 | ✅ X、LinkedIn等 | ✅ 10+ 平台 | ✅ 基础平台 |
| **支付系统** | ✅ Stripe 内置 | ❌ 未开源 | ❌ 无付费版 | ✅ 有 |
| **许可证** | ✅ **MIT** (商用友好) | ❌ AGPL (商用受限) | ❌ AGPL | ✅ MIT |
| **部署方式** | ✅ Docker 一键部署 | ✅ Docker | ✅ Docker | ❌ |
| **认证** | ✅ NextAuth (邮箱/Google/GitHub) | ✅ NextAuth | ✅ Django Auth | ✅ |
| **数据库** | ✅ Prisma + SQLite/PostgreSQL | ✅ Redis + PG | ✅ PostgreSQL | ✅ PostgreSQL |
| **响应式** | ✅ 桌面+移动 | ✅ | ✅ | ❌ |
| **中文支持** | ✅ 原生中文 | ❌ 仅英文 | ❌ 仅英文 | ❌ 仅英文 |

---

## ✨ 核心功能

### 🤖 AI 内容生成
- 输入主题，AI 自动生成适配各平台的内容
- 支持多种语气（专业、轻松、幽默、激励等）
- 自动生成标签（Hashtags）和配图建议
- 基于 OpenAI GPT-4o 驱动
- **一键改写已有内容适配不同平台**

### 📤 多平台发布
- **国内平台**: 小红书、抖音
- **海外平台**: X (Twitter)、Reddit、TikTok、LinkedIn、YouTube
- 一键发布到多个平台
- 智能内容格式转换（长度、风格、Emoji）
- 定时发布 + 队列管理

### 📊 数据分析
- 实时追踪各平台数据
- 粉丝增长、互动率、曝光量趋势
- AI 优化建议（最佳发布时间、内容方向）
- **数据导出 CSV/PDF**

### 📅 内容日历
- 可视化日历排期管理
- 拖拽式操作
- 最佳发布时间 AI 推荐
- 批量导入/导出

### 💰 内置订阅系统
- 免费版 / 专业版 / 企业版
- Stripe 支付完整集成
- 按计划的用量限制
- **开源自部署免费，云服务付费**

### 🔌 开放 API 生态
- RESTful API 方便二次开发
- n8n 工作流节点支持 (即将推出)
- Webhook 回调通知发布状态
- 自定义集成 SDK

---

## 🏗️ 技术栈

| 分类 | 技术 |
|------|------|
| **框架** | Next.js 15.5 (App Router) |
| **语言** | TypeScript 5.8 |
| **样式** | Tailwind CSS 4 |
| **数据库** | Prisma 6 + SQLite (开发) / PostgreSQL (生产) |
| **认证** | NextAuth.js 5 (邮箱/Google/GitHub) |
| **AI** | OpenAI API (GPT-4o) |
| **支付** | Stripe |
| **部署** | Docker, Vercel, Railway |
| **监控** | 内置日志 + 健康检查 |

---

## 🚀 快速开始

### 方案一：Docker 一键部署（推荐）

```bash
git clone https://github.com/qiyuan-studio/postflow-ai.git
cd postflow-ai

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 OpenAI API Key、Stripe Key 等

# 启动（后台运行）
docker compose up -d

# 访问 http://localhost:3000
# 注册账号即可开始使用
```

### 方案二：本地开发

```bash
git clone https://github.com/qiyuan-studio/postflow-ai.git
cd postflow-ai

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的配置

# 初始化数据库
npx prisma db push

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 方案三：Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qiyuan-studio/postflow-ai)

> 部署到 Vercel 后记得设置环境变量并配置数据库。

---

## 🔧 环境变量配置

详见 [.env.example](.env.example)

| 变量 | 说明 | 必填 |
|------|------|------|
| `DATABASE_URL` | 数据库连接 | ✅ |
| `NEXTAUTH_SECRET` | 认证密钥 | ✅ |
| `AUTH_GITHUB_ID/SECRET` | GitHub 登录 | 可选 |
| `AUTH_GOOGLE_ID/SECRET` | Google 登录 | 可选 |
| `OPENAI_API_KEY` | AI 内容生成 | ✅ |
| `STRIPE_SECRET_KEY` | 支付 | 可选 |
| `NEXT_PUBLIC_APP_URL` | 应用地址 | ✅ |

---

## 💰 盈利模式

| 计划 | 价格 | 功能 |
|------|------|------|
| 🆓 **免费版** | ¥0 | 1个平台，10篇AI/月，基础分析 |
| ⭐ **专业版** | ¥99/月 | 5个平台，无限AI，高级分析，AI评论 |
| 🏢 **企业版** | ¥299/月 | 无限平台，全功能，API接入，专属支持 |

> 开源版 **MIT 协议** 免费自部署，云服务付费使用。
> 双轨模式让社区和商业共同繁荣。

---

## 🗺️ 开发路线图

### ✅ 已完成
- [x] 用户认证系统（邮箱/Google/GitHub）
- [x] AI内容生成器（GPT-4o）
- [x] 多平台发布引擎框架
- [x] 数据分析仪表盘
- [x] 发布日历
- [x] Stripe 支付集成
- [x] Docker 一键部署
- [x] GitHub 仓库 + 开源发布

### 🔄 进行中
- [ ] 国内平台真实 OAuth 集成（小红书/抖音）
- [ ] Playwright 自动化发布引擎
- [ ] 开放 API + n8n 工作流集成
- [ ] 一键部署模板（Railway / Coolify）
- [ ] 产品截图 + 演示视频

### 📅 计划中
- [ ] 团队协作功能（多用户空间）
- [ ] AI 评论自动回复 + 情感分析
- [ ] Chrome 浏览器扩展
- [ ] PWA 移动端支持
- [ ] 英文版 + 国际化 (i18n)
- [ ] 自定义 AI 模型（Claude / Gemini 接入）

---

## 📁 项目结构（简要）

```
src/
├── app/
│   ├── (auth)/              # 登录/注册
│   ├── (dashboard)/          # 仪表盘（dashboard/content/analytics/calendar/settings）
│   ├── api/                  # API 路由（auth/content/platforms/analytics/subscription/stripe）
│   ├── layout.tsx
│   └── page.tsx              # Landing Page
├── components/               # UI 组件
├── lib/                      # 工具函数（prisma/auth/ai/utils）
├── types/                    # TypeScript 类型
└── hooks/                    # React Hooks
```

完整文档请参阅 [docs/](./docs/)。

---

## 🤝 贡献指南

欢迎贡献！以下是当前最需要的帮助：

| 贡献类型 | 说明 | 难度 |
|----------|------|------|
| 📸 产品截图 | 运行项目并截取各页面截图 | 🌱 简单 |
| 🌍 翻译 | 添加英文/日文等语言支持 | 🌱 简单 |
| 🔌 新平台 | 集成 Threads / Bluesky / 微博 等 | 🌿 中等 |
| 🐛 Bug 修复 | 提交 Issue 或 PR | 🌿 中等 |
| 🚀 新功能 | Roadmap 中的功能 | 🌳 较难 |

详见 [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 许可证

[MIT License](LICENSE) - 可自由商用、修改、再分发。

---

## ⭐ 支持

如果你觉得这个项目有用，请点一个 **Star ⭐** 支持我们！这对开源项目的成长非常重要。

---

## 📞 联系与社区

- **Issues**: [提交 Bug 或功能请求](https://github.com/qiyuan-studio/postflow-ai/issues)
- **Discussions**: [加入讨论](https://github.com/qiyuan-studio/postflow-ai/discussions)
- **作者**: qiyuan-studio
- **邮箱**: 8873721@qq.com
