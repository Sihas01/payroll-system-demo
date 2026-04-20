'use client';
import { useStore } from '@/lib/store';
import { clsx } from 'clsx';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: { value: number; label: string };
  delay?: number;
}

export default function KPICard({ title, value, subtitle, icon, gradient, trend, delay = 0 }: Props) {
  const { darkMode } = useStore();
  return (
    <div
      className={clsx(
        'rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in',
        darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white shadow-sm shadow-slate-200 border border-slate-100'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* BG Glow */}
      <div className={clsx('absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10 blur-2xl', gradient)} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={clsx('text-xs font-semibold uppercase tracking-wider mb-1', darkMode ? 'text-white/40' : 'text-slate-400')}>{title}</p>
          <div className={clsx('text-xl sm:text-2xl font-extrabold tracking-tight animate-count-up', darkMode ? 'text-white' : 'text-slate-800')}>
            {value}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={clsx('w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0', gradient)}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className={clsx('mt-3 flex items-center gap-1 text-xs font-medium', trend.value >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
          <span>{trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}%</span>
          <span className={darkMode ? 'text-white/30' : 'text-slate-400'}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
