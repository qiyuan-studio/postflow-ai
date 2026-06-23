#!/bin/bash
# PostFlow AI - 一键部署脚本
# 用法: bash <(curl -sL https://raw.githubusercontent.com/qiyuan-studio/postflow-ai/main/scripts/quick-deploy.sh)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  PostFlow AI - 一键部署${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ 需要安装 Docker${NC}"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ 需要安装 Docker Compose${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker 已安装${NC}"
echo ""

# 配置
echo -e "${BLUE}请输入配置信息：${NC}"
echo ""

read -p "DeepSeek API Key (必填): " DEEPSEEK_KEY
if [ -z "$DEEPSEEK_KEY" ]; then
    echo -e "${RED}❌ API Key 不能为空${NC}"
    exit 1
fi

read -p "Auth Secret (回车自动生成): " AUTH_SECRET
if [ -z "$AUTH_SECRET" ]; then
    AUTH_SECRET=$(openssl rand -hex 32)
    echo "自动生成: $AUTH_SECRET"
fi

read -p "部署域名 (默认: http://localhost:3000): " DEPLOY_URL
if [ -z "$DEPLOY_URL" ]; then
    DEPLOY_URL="http://localhost:3000"
fi

# 创建目录
mkdir -p postflow-data
cd postflow-data

# 创建 docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  postflow-ai:
    image: ghcr.io/qiyuan-studio/postflow-ai:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/dev.db
      - AUTH_SECRET=${AUTH_SECRET}
      - AUTH_URL=${DEPLOY_URL}
      - DEEPSEEK_API_KEY=${DEEPSEEK_KEY}
      - DEEPSEEK_BASE_URL=https://api.deepseek.com
      - DEEPSEEK_MODEL=deepseek-v4-flash
    volumes:
      - postflow-data:/app/data
    restart: unless-stopped

volumes:
  postflow-data:
EOF

echo ""
echo -e "${GREEN}✅ 配置完成，正在启动...${NC}"
echo ""

docker compose up -d

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  🎉 PostFlow AI 部署成功！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  访问地址: ${BLUE}${DEPLOY_URL}${NC}"
echo -e "  注册账号: ${BLUE}${DEPLOY_URL}/register${NC}"
echo -e "  管理后台: ${BLUE}${DEPLOY_URL}/dashboard${NC}"
echo ""
echo -e "  部署目录: $(pwd)"
echo ""
echo -e "${BLUE}提示: 首次使用需要注册管理员账号${NC}"
echo -e "${BLUE}      购买授权码后可激活全部功能${NC}"
echo ""
