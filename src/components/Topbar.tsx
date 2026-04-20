'use client';
import { useStore } from '@/lib/store';
import { Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';

export default function Topbar({ title }: { title: string }) {
  const { darkMode, notifications, markNotificationRead, toggleSidebar, currentUser } = useStore();
  const [showNotif, setShowNotif] = useState(false);
  const unread = notifications.filter(n => !n.read);

  return (
    <header className={clsx(
      'min-h-[64px] sm:min-h-[70px] flex items-center px-4 sm:px-6 gap-3 sm:gap-4 border-b sticky top-0 z-30',
      darkMode
        ? 'bg-[#12141f]/80 backdrop-blur-xl border-white/5'
        : 'bg-white/80 backdrop-blur-xl border-slate-100 shadow-sm'
    )}>
      <button
        onClick={toggleSidebar}
        className={clsx('p-2 rounded-lg md:hidden', darkMode ? 'text-white/60 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100')}
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0 flex-1 md:flex-none">
        <h1 className={clsx('truncate text-base sm:text-lg font-bold leading-tight', darkMode ? 'text-white' : 'text-slate-800')}>{title}</h1>
        <p className="hidden min-[420px]:block truncate text-[11px] sm:text-xs text-slate-400">{new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
      </div>

      {/* Search */}
      <div className={clsx('hidden md:flex items-center gap-2 ml-auto rounded-xl px-3 py-2 w-64 border', darkMode ? 'bg-white/5 border-white/8 text-white/50' : 'bg-slate-50 border-slate-200 text-slate-400')}>
        <Search size={15} />
        <input placeholder="Search..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-current" />
      </div>

      {/* Notifications */}
      <div className="relative ml-auto md:ml-2">
        <button
          onClick={() => setShowNotif(v => !v)}
          className={clsx('relative p-2.5 rounded-xl transition-colors', darkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600')}
        >
          <Bell size={18} />
          {unread.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </button>

        {showNotif && (
          <div className={clsx(
            'fixed right-3 left-3 top-[72px] sm:absolute sm:left-auto sm:top-full sm:right-0 sm:mt-2 sm:w-80 rounded-2xl shadow-2xl border animate-fade-in overflow-hidden',
            darkMode ? 'bg-[#1a1d2e] border-white/10' : 'bg-white border-slate-100'
          )}>
            <div className={clsx('px-4 py-3 border-b flex justify-between items-center', darkMode ? 'border-white/5' : 'border-slate-100')}>
              <span className={clsx('font-semibold text-sm', darkMode ? 'text-white' : 'text-slate-800')}>Notifications</span>
              <span className="text-xs text-indigo-400">{unread.length} unread</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 6).map(n => (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={clsx(
                    'w-full text-left px-4 py-3 border-b last:border-0 transition-colors',
                    !n.read ? (darkMode ? 'bg-indigo-500/5' : 'bg-indigo-50/50') : '',
                    darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'
                  )}
                >
                  <div className="flex gap-2 items-start">
                    <div className={clsx('w-2 h-2 mt-1.5 rounded-full shrink-0', {
                      'bg-green-400': n.type === 'success',
                      'bg-amber-400': n.type === 'warning',
                      'bg-rose-400': n.type === 'error',
                      'bg-blue-400': n.type === 'info',
                    })} />
                    <div>
                      <div className={clsx('text-xs font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>{n.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{n.message}</div>
                    </div>
                    {!n.read && <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
            <Link href="/notifications" onClick={() => setShowNotif(false)} className="block text-center py-3 text-indigo-400 text-xs font-medium hover:text-indigo-300">
              View all notifications →
            </Link>
          </div>
        )}
      </div>

      {/* Avatar */}
      {currentUser && (
        <Link href="/profile">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform">
            {currentUser.name.charAt(0)}
          </div>
        </Link>
      )}
    </header>
  );
}
