export type Platform = 'douyin' | 'xiaohongshu' | 'x' | 'reddit' | 'tiktok';

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
