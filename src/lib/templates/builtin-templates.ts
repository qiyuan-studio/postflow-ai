import type { ContentTemplate } from "@/types";

/**
 * 内置内容模板
 * 提供高质量的内容结构，让 AI 生成更有针对性的内容
 */
export const builtinTemplates: ContentTemplate[] = [
  // ===== 社交媒体 =====
  {
    id: "social-product-launch",
    name: "产品发布公告",
    description: "新产品/功能上线时的多平台发布文案",
    category: "social",
    platforms: ["xiaohongshu", "weibo", "twitter", "weixin"],
    tone: "兴奋、专业",
    isBuiltin: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    structure: [
      { name: "标题", type: "title", prompt: "吸引眼球的发布标题，可以用问句或数字", required: true, maxLength: 60 },
      { name: "痛点引入", type: "body", prompt: "2-3句话描述用户的痛点/需求，引起共鸣", required: true },
      { name: "解决方案", type: "body", prompt: "介绍产品如何解决上述痛点，突出3个核心卖点", required: true },
      { name: "使用场景", type: "body", prompt: "描述1-2个具体使用场景，让用户想象'我也可以'", required: false },
      { name: "行动号召", type: "cta", prompt: "明确的下一步行动，如'立即体验'、'限时优惠'", required: true, maxLength: 100 },
      { name: "话题标签", type: "hashtags", prompt: "5-8个相关标签，包含品牌词+品类词+热点词", required: true },
    ],
  },
  {
    id: "social-knowledge",
    name: "干货知识分享",
    description: "展示专业度的知识型内容，建立权威感",
    category: "social",
    platforms: ["zhihu", "xiaohongshu", "weixin", "twitter"],
    tone: "专业、易懂",
    isBuiltin: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    structure: [
      { name: "标题", type: "title", prompt: "包含核心关键词+数字/效果承诺，如'3个方法…'", required: true, maxLength: 50 },
      { name: "核心观点", type: "body", prompt: "开门见山给出核心结论或观点，1-2句", required: true },
      { name: "详细讲解", type: "body", prompt: "分点展开，每个点包含：原理+案例+可操作步骤", required: true },
      { name: "案例分析", type: "body", prompt: "1个真实案例，展示前后的对比数据或效果", required: false },
      { name: "总结金句", type: "cta", prompt: "朗朗上口的一句话总结，方便用户记忆和转发", required: true },
      { name: "互动提问", type: "body", prompt: "引导用户评论的开放式问题", required: false },
      { name: "标签", type: "hashtags", prompt: "相关领域标签+话题标签", required: true },
    ],
  },
  {
    id: "social-trending",
    name: "热点追踪",
    description: "借势热点话题，快速产出的时效性内容",
    category: "social",
    platforms: ["weibo", "douyin", "tiktok", "twitter"],
    tone: "快速、犀利",
    isBuiltin: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    structure: [
      { name: "标题", type: "title", prompt: "热点关键词+独特角度或观点", required: true, maxLength: 40 },
      { name: "热点简述", type: "body", prompt: "简要概括热点事件，假设读者已了解背景", required: true },
      { name: "核心观点", type: "body", prompt: "你对这个热点的独特看法，不人云亦云", required: true },
      { name: "延伸思考", type: "body", prompt: "从热点延伸出的更深度观察或对行业的启示", required: false },
      { name: "标签", type: "hashtags", prompt: "热点标签+相关领域标签", required: true },
    ],
  },
  {
    id: "social-storytelling",
    name: "个人故事/经历",
    description: "真实的个人经历分享，建立情感连接",
    category: "social",
    platforms: ["xiaohongshu", "zhihu", "weixin"],
    tone: "真诚、有温度",
    isBuiltin: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    structure: [
      { name: "标题", type: "title", prompt: "故事核心+情感钩子，引发好奇心", required: true, maxLength: 50 },
      { name: "背景", type: "body", prompt: "故事发生的背景，当时的情况和心情", required: true },
      { name: "转折/冲突", type: "body", prompt: "遇到的困难、意外或转折点，制造戏剧张力", required: true },
      { name: "解决方案", type: "body", prompt: "如何应对和解决，学到的经验教训", required: true },
      { name: "感悟升华", type: "body", prompt: "从个人经历中提炼的普适道理或建议", required: false },
      { name: "互动", type: "cta", prompt: "引导读者分享自己的类似经历", required: false },
      { name: "标签", type: "hashtags", prompt: "情感标签+话题标签", required: true },
    ],
  },

  // ===== 博客 =====
  {
    id: "blog-seo",
    name: "SEO 优化博客",
    description: "针对搜索引擎优化的深度长文",
    category: "blog",
    platforms: ["weixin", "zhihu"],
    tone: "专业、系统",
    isBuiltin: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    structure: [
      { name: "SEO标题", type: "title", prompt: "包含核心关键词，吸引点击，60字以内", required: true, maxLength: 60 },
      { name: "导语", type: "body", prompt: "概括文章价值，包含关键词，让读者知道为什么值得读", required: true },
      { name: "目录", type: "body", prompt: "2-4个小标题，逻辑递进", required: true },
      { name: "第一节", type: "body", prompt: "定义问题/介绍背景，数据或引用支撑", required: true },
      { name: "第二节", type: "body", prompt: "核心方法论，分3-5个步骤，每个步骤有案例", required: true },
      { name: "第三节", type: "body", prompt: "常见误区或进阶技巧", required: false },
      { name: "FAQ", type: "body", prompt: "3-5个常见问题及答案，包含长尾关键词", required: false },
      { name: "总结CTA", type: "cta", prompt: "总结要点+引导行动（订阅/下载/咨询）", required: true },
      { name: "标签", type: "hashtags", prompt: "核心关键词+长尾关键词+话题标签", required: true },
    ],
  },
  {
    id: "blog-listicle",
    name: "清单/排名文",
    description: "高点击率的清单体文章，如'Top 10…'",
    category: "blog",
    platforms: ["weixin", "zhihu", "xiaohongshu"],
    tone: "轻松、有料",
    isBuiltin: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    structure: [
      { name: "标题", type: "title", prompt: "数字+名词+效果承诺，如'5个让你…的方法'", required: true, maxLength: 45 },
      { name: "开篇", type: "body", prompt: "为什么这个清单值得看，阅读门槛低", required: true },
      { name: "清单正文", type: "body", prompt: "每条包含：序号+小标题+详细说明+小贴士", required: true },
      { name: "总结排名", type: "body", prompt: "哪个最好/最适合哪种情况，给出选择建议", required: false },
      { name: "互动CTA", type: "cta", prompt: "让读者在评论区补充自己的推荐", required: false },
      { name: "标签", type: "hashtags", prompt: "清单类标签+领域标签", required: true },
    ],
  },

  // ===== 电商/产品 =====
  {
    id: "product-review",
    name: "产品测评",
    description: "深度产品体验评测，适用于种草和带货",
    category: "product",
    platforms: ["xiaohongshu", "zhihu", "weibo"],
    tone: "客观、真实",
    isBuiltin: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    structure: [
      { name: "标题", type: "title", prompt: "产品名+使用时长+核心评价", required: true, maxLength: 50 },
      { name: "背景/动机", type: "body", prompt: "为什么买/为什么关注这个产品", required: true },
      { name: "开箱/第一印象", type: "body", prompt: "包装、外观、质感等第一感受", required: false },
      { name: "使用体验", type: "body", prompt: "分维度评测：功能、效果、续航、价格等", required: true },
      { name: "优缺点总结", type: "body", prompt: "客观列出优缺点，不回避缺点更可信", required: true },
      { name: "购买建议", type: "cta", prompt: "哪些人适合买、什么时候买划算", required: true },
      { name: "标签", type: "hashtags", prompt: "品牌标签+品类标签+评测标签", required: true },
    ],
  },
  {
    id: "email-newsletter",
    name: "邮件订阅",
    description: "定期邮件通讯，维护用户关系",
    category: "email",
    platforms: ["weixin"],
    tone: "亲切、有价值",
    isBuiltin: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    structure: [
      { name: "邮件主题", type: "title", prompt: "吸引打开，可包含名字个性化标记", required: true, maxLength: 40 },
      { name: "问候语", type: "body", prompt: "温暖的问候，建立连接感", required: true },
      { name: "核心内容", type: "body", prompt: "本期最重要的1-2条内容，每条包含观点+数据+可操作建议", required: true },
      { name: "精选推荐", type: "body", prompt: "推荐好文章/工具/书单等", required: false },
      { name: "行动号召", type: "cta", prompt: "希望读者做的下一步（回复/分享/点击）", required: true },
      { name: "结尾", type: "body", prompt: "温馨结尾+下期预告", required: true },
    ],
  },
];

/**
 * 根据平台和类别获取推荐模板
 */
export function getRecommendedTemplates(platform?: string, category?: string): ContentTemplate[] {
  let results = [...builtinTemplates];

  if (platform) {
    results = results.filter(t => t.platforms.includes(platform as any));
  }
  if (category) {
    results = results.filter(t => t.category === category);
  }

  return results;
}

/**
 * 根据 ID 获取模板
 */
export function getTemplateById(id: string): ContentTemplate | undefined {
  return builtinTemplates.find(t => t.id === id);
}

/**
 * 构建模板使用的 AI system prompt
 */
export function buildTemplatePrompt(template: ContentTemplate, topic: string, tone?: string): string {
  const structureDesc = template.structure
    .map(s => `  - 【${s.type === "title" ? "标题" : s.type === "body" ? "正文" : s.type === "cta" ? "行动号召" : s.type === "hashtags" ? "标签" : "配图"}】${s.name}：${s.prompt}${s.maxLength ? `（${s.maxLength}字以内）` : ""}${s.required ? "（必填）" : "（可选）"}`)
    .join("\n");

  return `你使用模板「${template.name}」生成内容。

模板结构：
${structureDesc}

主题：${topic}
语气：${tone || template.tone}
目标平台：${template.platforms.join("、")}

请严格按照模板结构生成内容，输出 JSON 格式。`;
}
