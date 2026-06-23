# PostFlow AI 部署与变现指南

## 📋 今晚需要你操作的事项

### 1. Stripe 注册（收款）
1. 访问 https://dashboard.stripe.com/register
2. 注册账号（用你的邮箱 8873721@qq.com）
3. 验证邮箱后进入 Dashboard
4. 获取密钥：
   - **Publishable Key**: 在 Dashboard → API Keys
   - **Secret Key**: 在 Dashboard → API Keys
5. 填写到 `.env`：
   ```
   NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
   STRIPE_SECRET_KEY=sk_live_xxx
   ```
6. 创建产品（Products）：
   - Pro 版: ¥99/月
   - 企业版: ¥299/月
7. 设置 Webhook：在 Stripe Dashboard → Webhooks → 添加端点
   - URL: `https://你的域名/api/stripe/webhook`
   - 事件: `checkout.session.completed`
   - 获取 Webhook Secret 填入 `.env`

### 2. 部署到 Vercel（免费）
1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. Import Repository → 选择 `qiyuan-studio/postflow-ai`
4. 在环境变量页面填入所有 `.env` 变量
5. 部署后获得域名如 `postflow-ai.vercel.app`

### 3. Supabase 数据库（免费额度足够）
1. 访问 https://supabase.com
2. 注册 → 创建新项目
3. 在 Project Settings → Database → Connection string
4. 获取 `postgresql://...` 连接字符串
5. 将 `.env` 中的 `DATABASE_URL` 替换为这个地址
6. 运行 `npx prisma db push` 同步数据库

### 4. ClawHub 发布（闭源版）
```bash
clawhub login
# 输入你的 ClawHub API Key: clh_71G6EiTVNG1We-sRVXrVQK1T8uTADHV0Y8mYaxEFI3Q
clawhub publish
```

---

## 💰 变现方式

### 方式一：SaaS 订阅（主要收入）
通过 Stripe 自动收款，用户按月/年订阅

### 方式二：ClawHub 闭源包销售
- 专业版: ¥199/次（买断）
- 企业版: ¥499/次（买断）
- 用户购买后获得授权码，部署自己的服务器

### 方式三：API 调用（开发者市场）
- 用户在平台购买 API 套餐
- 获取 API Key 后调用 AI 能力
- 适用于 n8n / Make 等自动化工具集成

### 方式四：授权码分销
- 企业版用户可生成授权码
- 自定义价格和有效期
- 适合转售给终端客户

---

## 📈 推广建议

1. **GitHub 开源** → 吸引 Star 和社区用户
2. **功能限制**：开源版限制功能（仅1平台、每月10次AI）
3. **SEO 优化**：Landing Page 已有基础 SEO
4. **小红书/知乎**：发布使用教程引流
5. **Product Hunt**：准备英文版发布

---

## 🔧 维护

- `npm run dev` — 本地开发
- `npm run build` — 构建检查
- `npx prisma studio` — 数据库管理
- `git push` — 部署到 Vercel（自动触发）
