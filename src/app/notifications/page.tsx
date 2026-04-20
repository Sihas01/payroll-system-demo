'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppShell from '@/components/AppShell';
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { Notification } from '@/lib/data';

const TYPE_CONFIG: Record<Notification['type'], { icon: React.ReactNode; color: string; bg: string }> = {
  success: { icon: <CheckCircle size={16} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  warning: { icon: <AlertTriangle size={16} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  error:   { icon: <AlertCircle size={16} />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  info:    { icon: <Info size={16} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

export default function NotificationsPage() {
  const { currentUser, notifications, markNotificationRead, darkMode , hydrated } = useStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !currentUser) router.push('/login'); }, [currentUser, hydrated, router]);

  if (!hydrated || !currentUser) return null;

  const unread = notifications.filter(n => !n.read);
  const read   = notifications.filter(n => n.read);

  const card = clsx('rounded-2xl p-5', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm');

  const NotifRow = ({ n }: { n: Notification }) => {
    const cfg = TYPE_CONFIG[n.type];
    return (
      <div
        className={clsx(
          'flex items-start gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer animate-fade-in',
          !n.read
            ? darkMode ? 'bg-indigo-500/5 border border-indigo-500/10' : 'bg-indigo-50/50 border border-indigo-100'
            : darkMode ? 'hover:bg-white/3' : 'hover:bg-slate-50',
        )}
        onClick={() => markNotificationRead(n.id)}
      >
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', cfg.bg, cfg.color)}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className={clsx('text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>{n.title}</div>
            {!n.read && <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />}
          </div>
          <div className={clsx('text-xs mt-0.5', darkMode ? 'text-white/50' : 'text-slate-500')}>{n.message}</div>
          <div className="text-[10px] text-slate-400 mt-1.5">
            {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppShell title="Notifications">
      {/* Header stats */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total', value: notifications.length, color: 'text-indigo-500 bg-indigo-500/10', icon: Bell },
          { label: 'Unread', value: unread.length, color: 'text-amber-500 bg-amber-500/10', icon: AlertCircle },
          { label: 'Read', value: read.length, color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className={card}>
            <div className="flex items-center justify-between">
              <div>
                <p className={clsx('text-xs font-semibold uppercase tracking-wider mb-1', darkMode ? 'text-white/40' : 'text-slate-400')}>{label}</p>
                <p className={clsx('text-2xl font-extrabold', darkMode ? 'text-white' : 'text-slate-800')}>{value}</p>
              </div>
              <div className={clsx('w-11 h-11 rounded-2xl flex items-center justify-center', color)}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={clsx('rounded-2xl overflow-hidden', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm')}>
        {/* Unread */}
        {unread.length > 0 && (
          <div>
            <div className={clsx('px-5 py-3 border-b flex items-center justify-between', darkMode ? 'border-white/5' : 'border-slate-100')}>
              <h3 className={clsx('font-semibold text-sm', darkMode ? 'text-white' : 'text-slate-800')}>Unread ({unread.length})</h3>
              <button onClick={() => unread.forEach(n => markNotificationRead(n.id))} className="text-right text-xs text-indigo-400 hover:text-indigo-300 font-medium">Mark all as read</button>
            </div>
            <div className="p-3 space-y-2">
              {unread.map(n => <NotifRow key={n.id} n={n} />)}
            </div>
          </div>
        )}

        {/* Read */}
        {read.length > 0 && (
          <div className={unread.length > 0 ? clsx('border-t', darkMode ? 'border-white/5' : 'border-slate-100') : ''}>
            <div className={clsx('px-5 py-3 border-b', darkMode ? 'border-white/5' : 'border-slate-100')}>
              <h3 className={clsx('font-semibold text-sm', darkMode ? 'text-white/50' : 'text-slate-500')}>Earlier</h3>
            </div>
            <div className="p-3 space-y-2">
              {read.map(n => <NotifRow key={n.id} n={n} />)}
            </div>
          </div>
        )}

        {notifications.length === 0 && (
          <div className="py-20 text-center">
            <Bell size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400">No notifications yet.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
