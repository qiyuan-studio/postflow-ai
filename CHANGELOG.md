# Changelog

## [v1.0.0] - 2026-06-23

### ✨ 新功能
- **AI 内容生成**：基于 GPT-4o 的多平台内容生成，支持小红书、抖音、X/Twitter 等平台
- **多平台管理**：连接和管理 7+ 社交媒体平台账号
- **内容日历**：可视化内容排期和发布管理
- **数据分析仪表盘**：多维度数据分析和可视化报表
- **Stripe 支付集成**：支持 Pro/Enterprise 订阅计划
- **Open API**：完整的 RESTful API，支持第三方集成
- **Webhook 通知**：实时推送发布状态通知
- **API Key 管理**：安全的多密钥访问控制
- **用户认证系统**：邮箱注册 + JWT 会话管理
- **响应式设计**：完美适配桌面和移动设备

### 🔧 技术特性
- Next.js 15.5 + TypeScript + Tailwind CSS 4
- Prisma 6 + SQLite（支持 PostgreSQL 切换）
- OpenAI GPT-4o API 集成
- Stripe Checkout + Webhook
- NextAuth.js v5 (JWT)
- Docker 一键部署
- n8n 工作流集成支持

### 📦 安装部署
- Docker: `docker compose up -d`
- Railway: 一键部署按钮
- Coolify: Docker Compose 集成

### 📚 文档
- 完整的 README 文档（中英文）
- API 文档（Open API v1）
- n8n 集成指南和预置工作流模板
- 部署脚本 (Railway/Coolify/阿里云)

### 🔒 安全
- API Key 认证（Bearer Token）
- 密码 bcrypt 加密存储
- CSP 安全头
- 输入验证和 XSS 防护

### 🚀 开始使用
1. 访问 https://postflow.ai
2. 注册账号
3. 创建 API Key
4. 调用 API 或使用 n8n 工作流
