# PostFlow AI × n8n 集成指南

通过 n8n 工作流自动化平台，将 PostFlow AI 的内容生成和发布能力集成到你的自动化流程中。

## 为什么选择 n8n 集成？

- **开源免费**：n8n 是 MIT 许可的开源工作流自动化工具（193K ⭐ GitHub）
- **100+ 节点**：连接 Slack、Discord、Telegram、Notion、Google Sheets 等
- **自托管**：数据不外泄，完全控制
- **AI 原生**：内置 OpenAI、LangChain 节点

## 快速开始

### 1. 获取 API Key

1. 登录 PostFlow AI → API密钥 页面
2. 点击「新建密钥」输入名称
3. 复制生成的密钥

### 2. 在 n8n 中添加 PostFlow AI 凭证

n8n 使用 HTTP Request 节点调用 PostFlow AI API。

**配置方法：**
- 节点：HTTP Request
- 认证方式：Generic Credential (Header Auth)
- Header Name：`Authorization`
- Header Value：`Bearer YOUR_API_KEY`

### 3. 导入工作流模板

#### 模板 1：自动生成并发布内容

```json
{
  "name": "AI Content Generator → Publish",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": { "interval": 86400 }
      }
    },
    {
      "name": "Get Trending Topics",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{ $env.POSTFLOW_API_URL }}/api/open/v1/content/generate",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            { "name": "topic", "value": "={{ $json.topic }}" },
            { "name": "platform", "value": "xiaohongshu" },
            { "name": "tone", "value": "专业" }
          ]
        }
      }
    }
  ]
}
```

> 完整工作流 JSON 文件见 `docs/n8n-workflows/` 目录

### 4. API 端点参考

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/open/v1/me` | GET | 获取用户信息和订阅状态 |
| `/api/open/v1/content` | GET | 获取内容列表 |
| `/api/open/v1/content` | POST | 创建新内容 |
| `/api/open/v1/content/generate` | POST | AI 生成内容 |
| `/api/open/v1/analytics` | GET | 获取分析数据 |

### 5. 常见自动化场景

#### 📅 每日内容自动生成
1. Schedule Trigger（每天 9:00）
2. RSS Feed → 获取行业新闻
3. HTTP Request → PostFlow AI 生成内容
4. HTTP Request → 创建内容
5. Slack → 发送审核通知

#### 📊 周报自动生成
1. Schedule Trigger（每周一 10:00）
2. HTTP Request → PostFlow AI 分析数据
3. Google Sheets → 写入报告
4. Email → 发送周报

#### 🔔 实时发布通知
1. Webhook Trigger（PostFlow AI 回调）
2. IF 条件判断
3. Discord/Slack/Telegram 发送通知

## 部署 n8n

### Docker Compose

```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password
      - POSTFLOW_API_URL=https://your-postflow-instance.com
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

### Railway 一键部署

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/n8n)

## 资源

- [n8n 官方文档](https://docs.n8n.io/)
- [n8n 社区工作流](https://n8n.io/workflows/)
- [PostFlow AI API 文档](https://github.com/qiyuan-studio/postflow-ai#api)
