"use client";

import { useState } from "react";
import { Bell, Search, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white border-b border-primary-100 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          <input
            type="text"
            placeholder="搜索内容..."
            className="w-full pl-10 pr-4 py-2 bg-primary-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-primary-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-primary-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-primary-50 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
              {user?.image ? (
                <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-accent-600" />
              )}
            </div>
            <span className="text-sm font-medium text-primary-700 hidden sm:block">
              {user?.name || user?.email || "用户"}
            </span>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-primary-100 py-2 z-20">
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50"
                  onClick={() => setShowMenu(false)}
                >
                  ⚙️ 设置
                </Link>
                <hr className="my-1 border-primary-100" />
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
