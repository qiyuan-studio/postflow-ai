'use client';

import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual registration
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              PostFlow
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">创建账户</h1>
          <p className="text-gray-500 mt-2">免费开始使用，无需信用卡</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="你的名字" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="your@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="至少8个字符" required minLength={8} />
          </div>
          <button type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all">
            免费注册
          </button>
          <p className="text-center text-sm text-gray-500">
            已有账户？ <Link href="/login" className="text-primary-600 font-medium hover:text-primary-700">登录</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
