import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PostFlow AI - AI驱动的多平台社交媒体内容管理系统",
    template: "%s | PostFlow AI",
  },
  description:
    "PostFlow AI 是一款开源的多平台社交媒体内容管理工具。AI内容生成、多平台发布、数据分析、团队协作，一站式管理你的社交媒体内容。支持小红书、抖音、X/Twitter、Reddit、TikTok等平台。",
  keywords: [
    "社交媒体管理",
    "AI内容生成",
    "多平台发布",
    "小红书管理",
    "抖音管理",
    "Twitter管理",
    "内容日历",
    "数据分析",
    "开源",
    "PostFlow",
    "PostFlow AI",
  ],
  authors: [{ name: "PostFlow AI", url: "https://github.com/qiyuan-studio/postflow-ai" }],
  creator: "PostFlow AI Team",
  publisher: "PostFlow AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "PostFlow AI",
    title: "PostFlow AI - AI驱动的多平台社交媒体内容管理",
    description:
      "开源、自托管的社交媒体管理工具。AI内容生成、多平台发布、数据分析，一站式解决方案。",
    url: "https://postflow.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostFlow AI - 多平台社交媒体管理",
    description:
      "开源、自托管的社交媒体管理工具。AI内容生成、多平台发布、数据分析。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
