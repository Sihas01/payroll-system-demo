'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppShell from '@/components/AppShell';
import { CalendarCheck, CalendarX, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { AttendanceStatus } from '@/lib/data';

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string; bg: string }> = {
  present:  { label: 'Present',  color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
  absent:   { label: 'Absent',   color: 'text-rose-600',    bg: 'bg-rose-100 dark:bg-rose-500/10' },
  late:     { label: 'Late',     color: 'text-amber-600',   bg: 'bg-amber-100 dark:bg-amber-500/10' },
  half_day: { label: 'Half Day', color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-500/10' },
};

export default function AttendancePage() {
  const { currentUser, employees, attendance, markAttendance, darkMode , hydrated } = useStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !currentUser) router.push('/login'); }, [currentUser, hydrated, router]);

  const [filterEmp, setFilterEmp] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const PER_PAGE = 12;

  const today = new Date().toISOString().split('T')[0];

  // Per-employee today attendance
  const todayAttendance = useMemo(() =>
    employees.map(emp => {
      const rec = attendance.find(a => a.employeeId === emp.id && a.date === today);
      return { emp, rec };
    }), [employees, attendance, today]);

  const filtered = useMemo(() =>
    todayAttendance.filter(({ emp }) =>
      !filterEmp || emp.name.toLowerCase().includes(filterEmp.toLowerCase())
    ), [todayAttendance, filterEmp]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleMark = (empId: string, status: AttendanceStatus) => {
    markAttendance(empId, status);
    showToast(`Marked as ${STATUS_CONFIG[status].label}`);
  };

  // Summary stats
  const present  = todayAttendance.filter(({ rec }) => rec?.status === 'present').length;
  const absent   = todayAttendance.filter(({ rec }) => rec?.status === 'absent').length;
  const late     = todayAttendance.filter(({ rec }) => rec?.status === 'late').length;
  const unmarked = todayAttendance.filter(({ rec }) => !rec).length;

  if (!hydrated || !currentUser) return null;

  const card = clsx('rounded-2xl p-5', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm');

  return (
    <AppShell title="Attendance">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Present Today', value: present, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Absent Today',  value: absent,  icon: CalendarX,   color: 'text-rose-500 bg-rose-500/10' },
          { label: 'Late Arrivals', value: late,    icon: Clock,       color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Unmarked',      value: unmarked,icon: CalendarCheck,color: 'text-indigo-500 bg-indigo-500/10' },
        ].map(({ label, value, icon: Icon, color }) => (
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

      {/* Date + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className={clsx('text-base font-bold', darkMode ? 'text-white' : 'text-slate-800')}>Today&apos;s Attendance</h2>
          <p className="text-xs text-slate-400">{new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <input
          value={filterEmp}
          onChange={e => { setFilterEmp(e.target.value); setPage(1); }}
          placeholder="Search employee…"
          className={clsx('input-field w-full md:max-w-xs', darkMode ? 'bg-[#1a1d2e]' : '')}
        />
      </div>

      {/* Attendance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
        {paged.map(({ emp, rec }) => {
          const cfg = rec ? STATUS_CONFIG[rec.status] : null;
          return (
            <div key={emp.id} className={clsx(card, 'flex flex-col gap-3 animate-fade-in')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={clsx('text-sm font-semibold truncate', darkMode ? 'text-white' : 'text-slate-800')}>{emp.name}</div>
                  <div className="text-xs text-slate-400 truncate">{emp.designation}</div>
                </div>
                {cfg ? (
                  <span className={clsx('badge text-xs', cfg.bg, cfg.color)}>{cfg.label}</span>
                ) : (
                  <span className="badge bg-slate-100 text-slate-500 text-xs">Unmarked</span>
                )}
              </div>

              {rec && (
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>In: <span className={darkMode ? 'text-white/70' : 'text-slate-700'}>{rec.checkIn ?? '—'}</span></span>
                  <span>Out: <span className={darkMode ? 'text-white/70' : 'text-slate-700'}>{rec.checkOut ?? '—'}</span></span>
                  {rec.overtimeHours > 0 && <span className="text-amber-500">+{rec.overtimeHours}h OT</span>}
                </div>
              )}

              {/* Mark buttons */}
              <div className="flex gap-1.5 flex-wrap">
                {(['present','late','half_day','absent'] as AttendanceStatus[]).map(s => {
                  const c = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => handleMark(emp.id, s)}
                      className={clsx(
                        'text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all',
                        rec?.status === s ? `${c.bg} ${c.color} ring-1 ring-current` : darkMode ? 'bg-white/5 text-white/50 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      )}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn btn-secondary btn-sm btn-icon disabled:opacity-40"><ChevronLeft size={14}/></button>
          <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="btn btn-secondary btn-sm btn-icon disabled:opacity-40"><ChevronRight size={14}/></button>
        </div>
      )}

      {/* Monthly Summary Table */}
      <div className={clsx('rounded-2xl mt-6 overflow-hidden', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm')}>
        <div className={clsx('px-5 py-4 border-b', darkMode ? 'border-white/5' : 'border-slate-100')}>
          <h3 className={clsx('font-semibold text-sm', darkMode ? 'text-white' : 'text-slate-800')}>Monthly Attendance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr className={darkMode ? 'bg-white/3' : 'bg-slate-50'}>
                {['Employee', 'Present', 'Absent', 'Late', 'Half Day', 'OT Hours', 'Attendance %'].map(h => (
                  <th key={h} className={clsx('text-left', darkMode ? 'text-white/40' : 'text-slate-400')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 10).map(emp => {
                const records = attendance.filter(a => a.employeeId === emp.id);
                const p = records.filter(r => r.status === 'present').length;
                const ab = records.filter(r => r.status === 'absent').length;
                const lt = records.filter(r => r.status === 'late').length;
                const hd = records.filter(r => r.status === 'half_day').length;
                const ot = records.reduce((s, r) => s + r.overtimeHours, 0);
                const pct = records.length > 0 ? Math.round((p / records.length) * 100) : 0;
                return (
                  <tr key={emp.id} className={darkMode ? 'hover:bg-white/3' : 'hover:bg-slate-50/70'}>
                    <td>
                      <div className={clsx('text-xs font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>{emp.name}</div>
                      <div className="text-[10px] text-slate-400">{emp.employeeId}</div>
                    </td>
                    <td><span className="badge badge-approved">{p}</span></td>
                    <td><span className="badge badge-rejected">{ab}</span></td>
                    <td><span className="badge badge-pending">{lt}</span></td>
                    <td className={clsx('text-xs', darkMode ? 'text-white/60' : 'text-slate-600')}>{hd}</td>
                    <td className="text-xs text-amber-500 font-semibold">{ot}h</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className={clsx('text-xs font-semibold w-8', pct >= 90 ? 'text-emerald-500' : pct >= 70 ? 'text-amber-500' : 'text-rose-500')}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
