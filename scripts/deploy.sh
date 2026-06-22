#!/bin/bash
set -e

# ============================================
# PostFlow AI - 一键部署脚本
# 支持: Railway, Coolify, 阿里云 ECS
# ============================================

print_banner() {
  echo "=========================================="
  echo "  PostFlow AI Deployment Script v1.0"
  echo "=========================================="
  echo ""
}

check_prerequisites() {
  echo "🔍 检查前置条件..."
  
  if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
  fi
  echo "✅ Node.js $(node -v)"
  
  if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
  fi
  echo "✅ npm $(npm -v)"
  
  if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在，从 .env.example 创建..."
    cp .env.example .env
    echo "❌ 请编辑 .env 文件填入必要的环境变量"
    exit 1
  fi
}

install_dependencies() {
  echo "📦 安装依赖..."
  npm ci --production
  echo "✅ 依赖安装完成"
}

build_project() {
  echo "🔨 构建项目..."
  npm run build
  echo "✅ 构建完成"
}

run_database_migration() {
  echo "🗄️  同步数据库..."
  npx prisma db push
  echo "✅ 数据库同步完成"
}

deploy_to_railway() {
  echo "🚀 部署到 Railway..."
  
  if ! command -v railway &> /dev/null; then
    echo "📥 安装 Railway CLI..."
    npm install -g @railway/cli
  fi
  
  railway login
  railway link
  railway up
  
  echo "✅ Railway 部署完成！"
  echo "📌 访问地址: $(railway domain)"
}

deploy_to_coolify() {
  echo "🚀 部署到 Coolify..."
  
  if [ -z "$COOLIFY_URL" ] || [ -z "$COOLIFY_TOKEN" ]; then
    echo "❌ 请设置 COOLIFY_URL 和 COOLIFY_TOKEN 环境变量"
    exit 1
  fi
  
  # 使用 Coolify API 触发部署
  curl -X POST "${COOLIFY_URL}/api/v1/deploy" \
    -H "Authorization: Bearer ${COOLIFY_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"type":"docker-compose","project":"postflow-ai"}'
  
  echo "✅ Coolify 部署触发完成！"
}

deploy_to_aliyun_ecs() {
  echo "🚀 部署到阿里云 ECS..."
  
  if [ -z "$ALIYUN_HOST" ]; then
    echo "❌ 请设置 ALIYUN_HOST 环境变量 (SSH 地址)"
    exit 1
  fi
  
  # 打包项目
  tar czf /tmp/postflow-ai.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    .
  
  # 上传到服务器
  scp /tmp/postflow-ai.tar.gz ${ALIYUN_HOST}:/opt/postflow-ai/
  
  # 远程部署
  ssh ${ALIYUN_HOST} << 'SSH_CMD'
    cd /opt/postflow-ai
    tar xzf postflow-ai.tar.gz
    docker compose up -d --build
    echo "✅ Docker 容器已启动"
    docker compose ps
SSH_CMD
  
  echo "✅ 阿里云 ECS 部署完成！"
}

start_local_dev() {
  echo "🏠 启动本地开发环境..."
  
  # 检查 Redis (可选)
  if command -v redis-cli &> /dev/null; then
    echo "✅ Redis: $(redis-cli ping 2>/dev/null || echo '未运行')"
  fi
  
  # 启动开发服务器
  npm run dev
}

# ===== 主流程 =====
print_banner

case "${1:-help}" in
  railway)
    check_prerequisites
    install_dependencies
    build_project
    run_database_migration
    deploy_to_railway
    ;;
  coolify)
    check_prerequisites
    install_dependencies
    build_project
    run_database_migration
    deploy_to_coolify
    ;;
  aliyun)
    check_prerequisites
    install_dependencies
    build_project
    run_database_migration
    deploy_to_aliyun_ecs
    ;;
  dev)
    check_prerequisites
    install_dependencies
    run_database_migration
    start_local_dev
    ;;
  build-only)
    check_prerequisites
    install_dependencies
    build_project
    run_database_migration
    echo "✅ 构建完成！可以手动部署 dist 目录"
    ;;
  *)
    echo "使用方法: ./scripts/deploy.sh [参数]"
    echo ""
    echo "参数:"
    echo "  railway   - 部署到 Railway"
    echo "  coolify   - 部署到 Coolify"
    echo "  aliyun    - 部署到阿里云 ECS (需配置 ALIYUN_HOST)"
    echo "  dev       - 启动本地开发环境"
    echo "  build-only - 仅构建项目"
    echo ""
    echo "环境变量:"
    echo "  DATABASE_URL     - 数据库连接地址"
    echo "  NEXTAUTH_SECRET  - JWT 密钥"
    echo "  OPENAI_API_KEY   - OpenAI API 密钥"
    echo "  STRIPE_SECRET_KEY - Stripe 密钥"
    echo "  ALIYUN_HOST      - [阿里云] SSH 连接地址"
    echo "  COOLIFY_URL      - [Coolify] 服务地址"
    echo "  COOLIFY_TOKEN    - [Coolify] API Token"
    ;;
esac
