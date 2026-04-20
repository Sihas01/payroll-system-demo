'use client';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppShell from '@/components/AppShell';
import KPICard from '@/components/KPICard';
import {
  Users, DollarSign, Clock, CheckCircle, TrendingUp, CalendarX,
  ArrowRight, Activity, Zap,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { MONTHLY_PAYROLL_TREND, DEPT_PAYROLL } from '@/lib/data';
import { clsx } from 'clsx';
import Link from 'next/link';

const DEPT_COLORS = ['#6366f1','#22d3ee','#10b981','#f59e0b','#ef4444','#8b5cf6'];

const QUICK_ACTIONS = [
  { label: 'Add Employee', href: '/employees', color: 'bg-indigo-500', icon: Users },
  { label: 'Run Payroll', href: '/payroll', color: 'bg-emerald-500', icon: DollarSign },
  { label: 'View Reports', href: '/reports', color: 'bg-amber-500', icon: TrendingUp },
  { label: 'Leave Approval', href: '/leave', color: 'bg-rose-500', icon: CalendarX },
];

function MeasuredChart({
  height,
  children,
}: {
  height: number;
  children: (width: number, height: number) => ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const applyWidth = (nextWidth: number) => {
      const roundedWidth = Math.floor(nextWidth);
      if (roundedWidth > 0) {
        setWidth(prev => prev === roundedWidth ? prev : roundedWidth);
      }
    };

    applyWidth(frame.getBoundingClientRect().width);

    const observer = new ResizeObserver(entries => {
      applyWidth(entries[0]?.contentRect.width ?? 0);
    });
    observer.observe(frame);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} style={{ width: '100%', height, minWidth: 0 }}>
      {width > 0 ? children(width, height) : (
        <div className="h-full w-full rounded-xl bg-slate-100/60 dark:bg-white/5 animate-pulse" />
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { currentUser, employees, payroll, leaveRequests, attendance, darkMode , hydrated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !currentUser) router.push('/login');
  }, [currentUser, hydrated, router]);

  if (!hydrated || !currentUser) return null;

  const activeEmps = employees.filter(e => e.status === 'active').length;
  const totalPayroll = payroll.filter(p => p.month === '2025-12').reduce((s, p) => s + p.netSalary, 0);
  const paidThisMonth = payroll.filter(p => p.month === '2025-12' && p.status === 'paid').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;
  const overtimeHrs = attendance.reduce((s, a) => s + a.overtimeHours, 0);

  const recentActivity = [
    { text: 'Payroll for December generated', time: '2 hrs ago', type: 'success' },
    { text: 'James Smith applied for annual leave', time: '4 hrs ago', type: 'info' },
    { text: 'Maria Johnson updated bank details', time: '6 hrs ago', type: 'info' },
    { text: 'November salaries disbursed', time: '2 days ago', type: 'success' },
    { text: '3 employees missed attendance', time: '2 days ago', type: 'warning' },
  ];

  const card = (dark: boolean) =>
    clsx('rounded-2xl p-5', dark ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm');

  return (
    <AppShell title="Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <KPICard title="Total Employees" value={activeEmps} icon={<Users size={18}/>} gradient="bg-gradient-to-br from-indigo-500 to-indigo-700" trend={{ value: 3.2, label: 'vs last month' }} delay={0} />
        <KPICard title="Monthly Payroll" value={`$${(totalPayroll/1000).toFixed(0)}K`} subtitle="December 2025" icon={<DollarSign size={18}/>} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" trend={{ value: 4.1, label: 'vs Nov' }} delay={80} />
        <KPICard title="Paid This Month" value={paidThisMonth} icon={<CheckCircle size={18}/>} gradient="bg-gradient-to-br from-cyan-500 to-blue-600" trend={{ value: 8, label: 'completion' }} delay={160} />
        <KPICard title="Pending Approvals" value={pendingLeaves} icon={<Clock size={18}/>} gradient="bg-gradient-to-br from-amber-500 to-orange-600" trend={{ value: -2, label: 'vs last week' }} delay={240} />
        <KPICard title="Overtime Hours" value={`${overtimeHrs}h`} icon={<Activity size={18}/>} gradient="bg-gradient-to-br from-rose-500 to-pink-600" trend={{ value: 1.8, label: 'this month' }} delay={320} />
        <KPICard title="Leave Requests" value={leaveRequests.length} icon={<CalendarX size={18}/>} gradient="bg-gradient-to-br from-purple-500 to-violet-700" trend={{ value: -5, label: 'vs last month' }} delay={400} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Payroll Trend */}
        <div className={clsx(card(darkMode), 'xl:col-span-2 animate-fade-in')}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={clsx('font-semibold text-sm', darkMode ? 'text-white' : 'text-slate-800')}>Salary Expenses — 2025</h3>
              <p className="text-xs text-slate-400">Monthly payroll disbursement trend</p>
            </div>
            <span className="text-xs text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg">Annual</span>
          </div>
          <MeasuredChart height={220}>
            {(width, height) => (
              <AreaChart width={width} height={height} data={MONTHLY_PAYROLL_TREND}>
                <defs>
                  <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff08' : '#f1f5f9'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, 'Total Payroll']}
                  contentStyle={{ background: darkMode ? '#1a1d2e' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                  labelStyle={{ color: darkMode ? '#fff' : '#1e293b', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2.5} fill="url(#payGrad)" dot={false} />
              </AreaChart>
            )}
          </MeasuredChart>
        </div>

        {/* Department Pie */}
        <div className={clsx(card(darkMode), 'animate-fade-in')}>
          <h3 className={clsx('font-semibold text-sm mb-1', darkMode ? 'text-white' : 'text-slate-800')}>Dept. Payroll Split</h3>
          <p className="text-xs text-slate-400 mb-3">Distribution by department</p>
          <MeasuredChart height={160}>
            {(width, height) => (
              <PieChart width={width} height={height}>
                <Pie data={DEPT_PAYROLL} dataKey="amount" nameKey="dept" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {DEPT_PAYROLL.map((_, i) => <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={{ background: darkMode ? '#1a1d2e' : '#fff', border: 'none', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} />
              </PieChart>
            )}
          </MeasuredChart>
          <div className="space-y-2 mt-2">
            {DEPT_PAYROLL.slice(0,4).map((d, i) => (
              <div key={d.dept} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: DEPT_COLORS[i] }} />
                  <span className={darkMode ? 'text-white/70' : 'text-slate-600'}>{d.dept}</span>
                </div>
                <span className={clsx('font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Payroll Bar Chart */}
        <div className={clsx(card(darkMode), 'animate-fade-in')}>
          <h3 className={clsx('font-semibold text-sm mb-1', darkMode ? 'text-white' : 'text-slate-800')}>Quarterly Overview</h3>
          <p className="text-xs text-slate-400 mb-3">Q4 2025 employee count</p>
          <MeasuredChart height={140}>
            {(width, height) => (
              <BarChart width={width} height={height} data={MONTHLY_PAYROLL_TREND.slice(9,12)} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff08' : '#f1f5f9'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: darkMode ? '#1a1d2e' : '#fff', border: 'none', borderRadius: 10 }} />
                <Bar dataKey="employees" fill="#6366f1" radius={[6,6,0,0]} />
              </BarChart>
            )}
          </MeasuredChart>
        </div>

        {/* Quick Actions */}
        <div className={clsx(card(darkMode), 'animate-fade-in')}>
          <h3 className={clsx('font-semibold text-sm mb-3', darkMode ? 'text-white' : 'text-slate-800')}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map(({ label, href, color, icon: Icon }) => (
              <Link key={href} href={href}
                className={clsx('flex flex-col items-center gap-2 p-3 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5', color)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className={clsx('mt-3 p-3 rounded-xl flex items-center gap-3', darkMode ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-100')}>
            <Zap size={16} className="text-indigo-400 shrink-0" />
            <div>
              <div className={clsx('text-xs font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>Next Pay Date</div>
              <div className="text-[11px] text-indigo-400">January 28, 2026</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={clsx(card(darkMode), 'animate-fade-in')}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={clsx('font-semibold text-sm', darkMode ? 'text-white' : 'text-slate-800')}>Recent Activity</h3>
            <ArrowRight size={14} className="text-indigo-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', {
                  'bg-emerald-400': a.type === 'success',
                  'bg-amber-400': a.type === 'warning',
                  'bg-blue-400': a.type === 'info',
                })} />
                <div className="flex-1 min-w-0">
                  <p className={clsx('text-xs font-medium truncate', darkMode ? 'text-white/80' : 'text-slate-700')}>{a.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
