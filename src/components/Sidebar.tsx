'use client';
import { useStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, CalendarCheck, CalendarX2, DollarSign,
  FileText, BarChart3, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  User, Sun, Moon, Briefcase,
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/employees', icon: Users, label: 'Employees' },
  { href: '/attendance', icon: CalendarCheck, label: 'Attendance' },
  { href: '/leave', icon: CalendarX2, label: 'Leave Management' },
  { href: '/payroll', icon: DollarSign, label: 'Payroll' },
  { href: '/payslips', icon: FileText, label: 'Payslips' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const { currentUser, sidebarOpen, toggleSidebar, setSidebarOpen, logout, toggleDarkMode, darkMode, notifications } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const unread = notifications.filter(n => !n.read).length;

  const closeOnMobile = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    router.push('/login');
  };

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300',
        'w-[260px] md:translate-x-0',
        sidebarOpen ? 'translate-x-0 md:w-[260px]' : '-translate-x-full md:w-[72px]',
        darkMode
          ? 'bg-[#12141f] border-r border-white/5'
          : 'bg-white border-r border-slate-100 shadow-lg shadow-slate-100'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[70px] border-b border-slate-100/10 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg">
          <Briefcase size={18} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="animate-fade-in">
            <div className={clsx('font-bold text-[15px]', darkMode ? 'text-white' : 'text-slate-800')}>PayrollPro</div>
            <div className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">Management Suite</div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={clsx(
            'ml-auto w-7 h-7 rounded-lg hidden md:flex items-center justify-center transition-colors',
            darkMode ? 'bg-white/5 hover:bg-white/10 text-white/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
          )}
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          const isNotif = href === '/notifications';
          return (
            <Link
              key={href}
              href={href}
              onClick={closeOnMobile}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                active
                  ? 'bg-gradient-to-r from-indigo-500/10 to-cyan-400/5 text-indigo-500'
                  : darkMode
                    ? 'text-white/50 hover:text-white hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              )}
            >
              <div className={clsx('relative shrink-0', active && 'text-indigo-500')}>
                <Icon size={18} />
                {isNotif && unread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <span className={clsx('text-sm font-medium truncate', active && 'font-semibold')}>
                  {label}
                  {isNotif && unread > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-rose-500 text-white text-[9px] rounded-full">{unread}</span>
                  )}
                </span>
              )}
              {active && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className={clsx(
        'border-t p-3 space-y-2 shrink-0',
        darkMode ? 'border-white/5' : 'border-slate-100'
      )}>
        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className={clsx(
            'flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors text-sm',
            darkMode ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'
          )}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {sidebarOpen && <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        {/* User info */}
        {sidebarOpen && currentUser && (
          <div className={clsx('flex items-center gap-2.5 px-3 py-2 rounded-xl', darkMode ? 'bg-white/5' : 'bg-slate-50')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className={clsx('text-xs font-semibold truncate', darkMode ? 'text-white' : 'text-slate-800')}>{currentUser.name}</div>
              <div className="text-[10px] text-indigo-400 capitalize">{currentUser.role.replace('_', ' ')}</div>
            </div>
          </div>
        )}
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors text-sm"
        >
          <LogOut size={16} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
