"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

const platformEmojis: Record<string, string> = {
  xiaohongshu: "📕",
  douyin: "🎵",
  twitter: "🐦",
  reddit: "👽",
  tiktok: "📱",
};

const statusColors: Record<string, string> = {
  draft: "bg-amber-100 border-amber-300",
  scheduled: "bg-purple-100 border-purple-300",
  published: "bg-green-100 border-green-300",
};

interface Post {
  id: string;
  title: string | null;
  platforms: string[];
  status: string;
  scheduledAt: string | null;
}

export function CalendarClient({ posts }: { posts: Post[] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthName = `${currentYear}年${currentMonth + 1}月`;

  // Group posts by date
  const postsByDate = useMemo(() => {
    const map: Record<string, Post[]> = {};
    for (const post of posts) {
      if (!post.scheduledAt) continue;
      const date = new Date(post.scheduledAt);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(post);
    }
    return map;
  }, [posts]);

  const getPostsForDay = (day: number) => {
    const key = `${currentYear}-${currentMonth}-${day}`;
    return postsByDate[key] || [];
  };

  return (
    <div className="bg-white rounded-2xl border border-primary-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary-900">{monthName}</h2>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-primary-600" />
          </button>
          <button
            onClick={() => {
              setCurrentMonth(today.getMonth());
              setCurrentYear(today.getFullYear());
            }}
            className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            今天
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-primary-600" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm text-primary-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the 1st */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] bg-primary-50/30 rounded-xl" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
          const dayPosts = getPostsForDay(day);

          return (
            <div
              key={day}
              className={`min-h-[100px] p-1.5 rounded-xl border transition-colors ${
                isToday
                  ? "border-accent-500 bg-accent-50/30"
                  : "border-primary-100 hover:bg-primary-50"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  isToday ? "text-accent-600" : "text-primary-600"
                }`}
              >
                {day}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayPosts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    className={`text-xs px-1.5 py-0.5 rounded border truncate ${
                      statusColors[post.status] || "bg-primary-100"
                    }`}
                    title={post.title || "无标题"}
                  >
                    {post.platforms
                      .map((p) => platformEmojis[p] || "📄")
                      .join("")}{" "}
                    {post.title || "无标题"}
                  </div>
                ))}
                {dayPosts.length > 3 && (
                  <div className="text-xs text-primary-400 text-center">
                    +{dayPosts.length - 3} 更多
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-primary-100 flex gap-4 text-xs text-primary-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span> 草稿
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></span> 待发布
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-100 border border-green-300"></span> 已发布
        </span>
      </div>
    </div>
  );
}
