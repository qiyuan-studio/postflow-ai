"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Wand2,
  Key,
  PenLine,
  Video,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/dashboard/content", label: "内容管理", icon: FileText },
  { href: "/dashboard/content/new", label: "AI生成", icon: Wand2 },
  { href: "/dashboard/calendar", label: "发布日历", icon: Calendar },
  { href: "/dashboard/analytics", label: "数据分析", icon: BarChart3 },
  { href: "/dashboard/video", label: "短视频脚本", icon: Video },
  { href: "/dashboard/trending", label: "爆款选题", icon: TrendingUp },
  { href: "/dashboard/blog", label: "博客生成", icon: PenLine },
  { href: "/dashboard/settings", label: "设置", icon: Settings },
  { href: "/dashboard/api-keys", label: "API密钥", icon: Key },
  { href: "/dashboard/licenses", label: "授权管理", icon: Key },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white border-r border-primary-100 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-primary-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-primary-900 text-lg">PostFlow</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-accent-50 text-accent-700 font-medium"
                  : "text-primary-600 hover:bg-primary-50 hover:text-primary-800"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-primary-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
