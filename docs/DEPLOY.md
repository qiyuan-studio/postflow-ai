# PostFlow AI 部署指南

## 快速部署到 Vercel（推荐）

### 前置条件
1. 一个 [Vercel 账号](https://vercel.com)（用 GitHub 登录）
2. 一个 [Stripe 账号](https://dashboard.stripe.com)（如果要收钱）
3. 一个 PostgreSQL 数据库（推荐 [Supabase](https://supabase.com) 免费版）
4. DeepSeek API Key（已配置）

### 部署步骤

#### 1. 数据库设置
```bash
# 创建 Supabase 免费数据库
# 1. 去 https://supabase.com → 创建项目
# 2. 在项目 Settings → Database → Connection string
# 3. 获取 PostgreSQL 连接字符串
```

#### 2. Vercel 部署
```bash
# 方式一：一键部署（推荐）
# 打开以下链接：
# https://vercel.com/new/clone?repository-url=https://github.com/qiyuan-studio/postflow-ai

# 方式二：手动
# 1. 去 https://vercel.com/new
# 2. Import Git Repository → qiyuan-studio/postflow-ai
# 3. 添加以下环境变量：
```

#### 3. 必需的环境变量
```env
# 数据库（生产用 PostgreSQL）
DATABASE_URL="postgresql://user:pass@host:5432/postflow"

# NextAuth.js（生产环境必须改！）
AUTH_SECRET="<用 openssl rand -base64 32 生成>"
AUTH_URL="https://your-domain.vercel.app"

# DeepSeek AI
DEEPSEEK_API_KEY="<你的DeepSeek API Key>"
DEEPSEEK_BASE_URL="https://api.deepseek.com"
DEEPSEEK_MODEL="deepseek-v4-flash"

# Stripe 支付（不配置则使用 Mock 模式）
NEXT_PUBLIC_STRIPE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_xxx"
STRIPE_ENTERPRISE_PRICE_ID="price_xxx"
```

#### 4. 运行数据库迁移
```bash
# 部署后，在 Vercel 的 Terminal 或本地运行：
npx prisma migrate deploy
```

#### 5. 部署完成
- 访问 `https://your-domain.vercel.app`
- 注册账号即可使用

## 低价自托管方案

### 方案1: Railway ($5/月起)
```bash
# Railway 支持一键部署 + PostgreSQL
# 1. 去 https://railway.app
# 2. New Project → Deploy from GitHub repo
# 3. 添加环境变量
# 4. 自动部署
```

### 方案2: 阿里云 ECS ($10/月)
```bash
# 1. 购买 ECS 实例（2核4G，Ubuntu 22.04）
# 2. 安装 Docker
# 3. docker-compose up -d
```

## 定价计划（可调整）
| 计划 | 价格 | 核心限制 |
|------|------|----------|
| 免费 | ¥0/月 | 1平台, 10次AI/月 |
| 专业 | ¥99/月 | 5平台, 无限AI |
| 企业 | ¥299/月 | 无限, 全功能 |

## 推广渠道
1. **ProductHunt** - 英文推广
2. **V2EX** - 中文开发者社区
3. **小红书** - 内容创作者群体
4. **知乎** - SEO 内容营销
5. **ClawHub** - 作为AI Agent技能发布

## 项目架构
```
postflow-ai/
├── src/
│   ├── app/
│   │   ├── (auth)/          # 登录注册
│   │   ├── (dashboard)/     # 仪表盘（需要登录）
│   │   │   └── dashboard/
│   │   │       ├── content/     # 内容管理 + AI生成
│   │   │       ├── blog/        # SEO博客生成（NEW）
│   │   │       ├── analytics/   # 数据分析
│   │   │       ├── calendar/    # 发布日历
│   │   │       ├── api-keys/    # API管理
│   │   │       └── settings/    # 设置 + 订阅
│   │   ├── api/             # 后端API
│   │   └── page.tsx         # Landing Page（含定价）
│   ├── lib/                 # 工具库
│   └── components/          # UI组件
├── prisma/                  # 数据库Schema
└── docs/                    # 文档
```
