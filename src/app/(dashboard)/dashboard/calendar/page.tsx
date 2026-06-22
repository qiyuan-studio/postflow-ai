'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

const events: Record<number, {title: string; platform: string; time: string}[]> = {
  25: [{ title: 'AI工具推荐2025', platform: '小红书', time: '10:00' }],
  27: [{ title: '产品更新预告', platform: 'X/Twitter', time: '14:00' }],
  28: [{ title: '运营技巧分享', platform: '抖音', time: '09:30' }],
  30: [{ title: '用户案例展示', platform: 'Reddit', time: '11:00' }],
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 22)); // June 2025

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">发布日历</h1>
          <p className="text-gray-500 mt-1">规划和管理你的内容发布时间</p>
        </div>
        <Link href="/dashboard/content/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg">
          <Plus className="w-4 h-4" />新建内容
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{year}年 {monthNames[month]}</h2>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => (
            <div key={i} className={`min-h-[100px] p-2 rounded-xl border ${
              day ? 'border-gray-100 hover:border-primary-200 hover:bg-primary-50/30' : 'border-transparent'
            } transition-all`}>
              {day && (
                <>
                  <span className={`text-sm font-medium ${
                    new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
                      ? 'bg-primary-500 text-white w-7 h-7 flex items-center justify-center rounded-full'
                      : 'text-gray-700'
                  }`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {(events[day] || []).map((evt, j) => (
                      <div key={j} className="text-xs bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded truncate">
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
