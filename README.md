# PostFlow AI 🚀

> AI 驱动的多平台社交媒体内容管理系统 — 开源替代 Postiz、Buffer、Hootsuite

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://docker.com)

<p align="center">
  <img src="https://img.shields.io/github/stars/yourusername/postflow-ai?style=for-the-badge&logo=github" alt="stars">
  <img src="https://img.shields.io/github/forks/yourusername/postflow-ai?style=for-the-badge&logo=github" alt="forks">
</p>

---

## 📸 预览

| 首页 | 仪表盘 | AI内容生成 |
|------|--------|-----------|
| 现代化Landing Page | 数据看板 | AI一键生成 |

| 内容管理 | 发布日历 | 订阅管理 |
|----------|---------|---------|
| 多平台发布 | 日历排期 | Stripe支付 |

---

## 🌟 为什么选择 PostFlow AI？

| 特性 | PostFlow AI | Brightbean Studio | Free AI Scheduler |
|------|-------------|-------------------|-------------------|
| **技术栈** | Next.js 15 + TypeScript | Python + Django | Next.js 16 |
| **AI生成** | ✅ OpenAI 原生集成 | ❌ 无AI | ❌ 无AI |
| **国内平台** | ✅ 小红书、抖音 | ❌ 仅海外 | ❌ 仅海外 |
| **支付系统** | ✅ Stripe 完整集成 | ❌ 未内置 | ✅ 有 |
| **部署** | ✅ Docker 一键部署 | ✅ Docker | ❌ |
| **认证** | ✅ NextAuth (多种方式) | ✅ | ✅ |
| **数据库** | ✅ Prisma + SQLite/PG | ❌ | ✅ PostgreSQL |
| **响应式** | ✅ 桌面+移动 | ✅ | ❌ |

## ✨ 功能

### 🤖 AI 内容生成
- 输入主题，AI 自动生成适配各平台的内容
- 支持多种语气（专业、轻松、幽默、激励等）
- 自动生成标签（Hashtags）和配图建议
- 基于 OpenAI GPT-4o 驱动

### 📤 多平台发布
- **国内平台**: 小红书、抖音
- **海外平台**: X (Twitter)、Reddit、TikTok、LinkedIn、YouTube
- 一键发布到多个平台
- 智能内容格式转换

### 📊 数据分析
- 实时追踪各平台数据
- 粉丝增长、互动率、曝光量
- AI 优化建议

### 📅 内容日历
- 可视化排期管理
- 最佳发布时间推荐
- 批量操作

### 💰 订阅系统
- 免费版 / 专业版 / 企业版
- Stripe 支付集成
- 按计划的用量限制

## 🏗️ 技术栈

| 分类 | 技术 |
|------|------|
| **框架** | Next.js 15.5 (App Router) |
| **语言** | TypeScript 5.8 |
| **样式** | Tailwind CSS 4 |
| **数据库** | Prisma 6 + SQLite (开发) / PostgreSQL (生产) |
| **认证** | NextAuth.js 5 |
| **AI** | OpenAI API (GPT-4o) |
| **支付** | Stripe |
| **部署** | Docker, Vercel, Netlify |

## 🚀 快速开始

### 方案一：Docker 一键部署（推荐）

```bash
git clone https://github.com/yourusername/postflow-ai.git
cd postflow-ai

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 API keys

# 启动
docker compose up -d

# 访问 http://localhost:3000
```

### 方案二：本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/postflow-ai.git
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

### 方案三：Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/postflow-ai)

## 🔧 环境变量

详见 [.env.example](.env.example)

## 💰 盈利模式

| 计划 | 价格 | 功能 |
|------|------|------|
| 🆓 免费版 | ¥0 | 1个平台，10篇AI/月，基础分析 |
| ⭐ 专业版 | ¥99/月 | 5个平台，无限AI，高级分析，AI评论 |
| 🏢 企业版 | ¥299/月 | 无限平台，全功能，API接入，专属支持 |

## 📁 项目结构

```
src/
├── app/
│   ├── (auth)/              # 登录/注册
│   ├── (dashboard)/          # 仪表盘
│   │   ├── dashboard/
│   │   │   ├── page.tsx      # 首页
│   │   │   ├── content/      # 内容管理
│   │   │   ├── content/new/  # AI内容生成
│   │   │   ├── analytics/    # 数据分析
│   │   │   ├── calendar/     # 发布日历
│   │   │   └── settings/     # 设置+订阅
│   ├── api/                  # API 路由
│   │   ├── auth/             # NextAuth
│   │   ├── content/          # 内容CRUD+AI生成
│   │   ├── platforms/        # 平台连接
│   │   ├── analytics/        # 分析数据
│   │   ├── subscription/     # 订阅管理
│   │   └── stripe/           # Stripe支付
│   ├── layout.tsx
│   └── page.tsx              # 首页
├── components/               # 组件
├── lib/                      # 工具函数
├── types/                    # 类型定义
└── hooks/                    # React Hooks
```

## 🛣️ 开发路线图

- [x] 用户认证系统
- [x] AI内容生成器
- [x] 多平台发布引擎
- [x] 数据分析仪表盘
- [x] 发布日历
- [x] Stripe 支付集成
- [x] Docker 一键部署
- [ ] 真实的社交媒体 OAuth 集成
- [ ] Playwright 自动化发布
- [ ] 团队协作功能
- [ ] AI 评论自动回复
- [ ] Chrome 浏览器扩展
- [ ] 移动端 App

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

## ⭐ 支持

如果你喜欢这个项目，请给一个 Star ⭐ 这对我们很重要！

## 📞 联系

- 问题反馈: [Issues](https://github.com/yourusername/postflow-ai/issues)
- 商业合作: business@postflow.ai
