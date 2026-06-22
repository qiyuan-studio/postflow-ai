import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostFlow AI - 多平台社交媒体管理",
  description: "AI驱动的内容创作与多平台发布工具",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
