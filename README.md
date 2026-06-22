# PostFlow AI 🚀

> AI 驱动的多平台社交媒体内容管理系统

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🌟 概述

PostFlow AI 是一个基于 AI 的全栈社交媒体内容管理平台，帮助创作者和企业：

- **🤖 AI 内容生成** — 输入主题，AI 自动生成适配各平台风格的文案、标签
- **📤 一键多平台发布** — 同时发布到抖音、小红书、X(Twitter)、Reddit、TikTok
- **📊 智能数据分析** — 实时追踪各平台数据表现
- **📅 内容日历管理** — 可视化规划和调度内容发布时间
- **💬 AI 评论互动** — 自动回复评论，提升粉丝互动率

## 🎯 目标用户

- **个人创作者** — 博主、UP主、自媒体人
- **中小企业** — 需要多平台营销的品牌方
- **营销团队** — 需要协作和批量管理的机构

## 🏗️ 技术栈

| 前端 | 后端 | 工具 |
|------|------|------|
| Next.js 15.5 (App Router) | Next.js API Routes | TypeScript |
| React 19 | Server Actions | Tailwind CSS 4 |
| Lucide Icons | OpenAI API (AI生成) | Playwright (自动化发布) |

## 📁 项目结构

```
src/
├── app/
│   ├── (auth)/          # 登录/注册页面
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/     # 仪表盘路由组
│   │   └── dashboard/
│   │       ├── page.tsx        # 仪表盘首页
│   │       ├── content/        # 内容管理
│   │       │   ├── page.tsx
│   │       │   └── new/        # AI内容生成
│   │       ├── analytics/      # 数据分析
│   │       ├── calendar/       # 发布日历
│   │       └── settings/       # 设置
│   ├── api/             # API 路由
│   ├── layout.tsx
│   └── page.tsx         # 首页
├── components/
│   ├── layout/          # Sidebar, Header
│   ├── dashboard/       # 仪表盘组件
│   └── content/         # 内容组件
├── lib/                 # 工具函数
├── types/               # TypeScript 类型
└── hooks/               # React Hooks
```

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/yourusername/postflow-ai.git
cd postflow-ai

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加 OpenAI API Key

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
npm start
```

## 🔧 环境变量

```env
# OpenAI API Key (用于AI内容生成)
OPENAI_API_KEY=sk-xxxxxx

# 数据库 (可选，默认使用内存存储)
DATABASE_URL=postgresql://...

# JWT 密钥 (用于用户认证)
JWT_SECRET=your-secret-key

# Stripe (用于支付)
NEXT_PUBLIC_STRIPE_KEY=pk_xxxx
STRIPE_SECRET_KEY=sk_xxxx
```

## 💰 盈利模式

| 计划 | 价格 | 功能 |
|------|------|------|
| 🆓 免费版 | ¥0 | 1个平台，10篇AI/月 |
| ⭐ 专业版 | ¥99/月 | 5个平台，无限AI，高级分析 |
| 🏢 企业版 | ¥299/月 | 全部功能+API+专属支持 |

## 🛣️ 开发路线图

- [x] 项目骨架搭建
- [x] 用户认证系统
- [x] AI内容生成器
- [x] 多平台发布引擎架构
- [x] 数据分析和仪表盘
- [x] 发布日历
- [ ] 真实的 AI API 集成
- [ ] Playwright 自动化发布
- [ ] Stripe 支付集成
- [ ] 团队协作功能
- [ ] Docker 一键部署

## 📄 许可证

MIT License
