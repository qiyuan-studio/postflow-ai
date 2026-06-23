export type Platform = 'douyin' | 'xiaohongshu' | 'twitter' | 'reddit' | 'tiktok' | 'weibo' | 'weixin' | 'zhihu';

export type ContentType = 'text' | 'image' | 'video';

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface PlatformAccount {
  id: string;
  platform: Platform;
  name: string;
  avatar?: string;
  connected: boolean;
  followers?: number;
}

export interface ContentPost {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  platforms: Platform[];
  status: ContentStatus;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  mediaUrls?: string[];
  aiGenerated?: boolean;
  performance?: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
  };
}

export interface AnalyticsData {
  totalPosts: number;
  totalImpressions: number;
  totalEngagement: number;
  followerGrowth: number;
  postsByPlatform: Record<Platform, number>;
  engagementRate: number;
  dailyData: { date: string; impressions: number; engagement: number }[];
}

export interface AIContentRequest {
  topic: string;
  platform: Platform;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
}

export interface AIContentResponse {
  title: string;
  content: string;
  hashtags: string[];
  suggestions: string[];
}


// ===== 模板系统 =====
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'social' | 'blog' | 'email' | 'product' | 'custom';
  platforms: Platform[];
  structure: TemplateSection[];
  tone: string;
  isBuiltin: boolean;
  usageCount: number;
  createdAt: string;
}

export interface TemplateSection {
  name: string;
  type: 'title' | 'body' | 'cta' | 'hashtags' | 'image_prompt';
  prompt: string;
  maxLength?: number;
  required: boolean;
}

// ===== 批量生成 =====
export interface BatchGenerateRequest {
  topic: string;
  platforms: Platform[];
  count: number;
  tone?: string;
  templateId?: string;
  keywords?: string[];
  includeImages?: boolean;
}

export interface BatchGenerateItem {
  index: number;
  platform: Platform;
  title: string;
  content: string;
  hashtags: string[];
  imagePrompt?: string;
}

export interface BatchGenerateResponse {
  items: BatchGenerateItem[];
  totalTokens: number;
  generatedAt: string;
}

// ===== 内容对比 =====
export interface ContentDiff {
  field: string;
  before: string;
  after: string;
  changes: string[];
}
