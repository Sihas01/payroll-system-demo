'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppShell from '@/components/AppShell';
import Modal from '@/components/Modal';
import { LeaveType, DEPARTMENTS } from '@/lib/data';
import { Plus, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { clsx } from 'clsx';

const LEAVE_TYPES: { value: LeaveType; label: string; color: string }[] = [
  { value: 'annual',  label: 'Annual Leave',  color: 'text-blue-500 bg-blue-50' },
  { value: 'sick',    label: 'Sick Leave',    color: 'text-rose-500 bg-rose-50' },
  { value: 'casual',  label: 'Casual Leave',  color: 'text-amber-500 bg-amber-50' },
  { value: 'unpaid',  label: 'Unpaid Leave',  color: 'text-slate-500 bg-slate-100' },
];

const LEAVE_BALANCE: Record<LeaveType, number> = {
  annual: 14, sick: 7, casual: 5, unpaid: 0,
};

export default function LeavePage() {
  const { currentUser, employees, leaveRequests, applyLeave, updateLeaveStatus, darkMode , hydrated } = useStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !currentUser) router.push('/login'); }, [currentUser, hydrated, router]);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showApply, setShowApply] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ type: 'annual' as LeaveType, startDate: '', endDate: '', reason: '' });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = useMemo(() =>
    leaveRequests.filter(l =>
      (!filterStatus || l.status === filterStatus) &&
      (!filterType || l.type === filterType)
    ), [leaveRequests, filterStatus, filterType]);

  const empName = (id: string) => employees.find(e => e.id === id)?.name ?? id;
  const empDept = (id: string) => {
    const e = employees.find(e => e.id === id);
    return e ? DEPARTMENTS.find(d => d.id === e.departmentId)?.name ?? '' : '';
  };

  const handleApply = () => {
    if (!form.startDate || !form.endDate || !form.reason) { alert('Please fill all fields.'); return; }
    const emp = employees.find(e => e.id === currentUser?.employeeId) ?? employees[0];
    applyLeave({
      employeeId: emp.id,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    });
    showToast('Leave request submitted!');
    setShowApply(false);
    setForm({ type: 'annual', startDate: '', endDate: '', reason: '' });
  };

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    updateLeaveStatus(id, action);
    showToast(action === 'approved' ? 'Leave approved!' : 'Leave rejected.');
  };

  const pending  = leaveRequests.filter(l => l.status === 'pending').length;
  const approved = leaveRequests.filter(l => l.status === 'approved').length;
  const rejected = leaveRequests.filter(l => l.status === 'rejected').length;

  if (!hydrated || !currentUser) return null;
  const card = clsx('rounded-2xl p-5', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm');

  return (
    <AppShell title="Leave Management">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in">
          ✓ {toast}
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Requests', value: leaveRequests.length, color: 'text-indigo-500 bg-indigo-500/10', icon: Filter },
          { label: 'Pending',        value: pending,              color: 'text-amber-500 bg-amber-500/10',   icon: Clock },
          { label: 'Approved',       value: approved,             color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle },
          { label: 'Rejected',       value: rejected,             color: 'text-rose-500 bg-rose-500/10',     icon: XCircle },
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

      {/* Leave Balance Cards */}
      <div className={clsx(card, 'mb-6')}>
        <h3 className={clsx('font-semibold text-sm mb-4', darkMode ? 'text-white' : 'text-slate-800')}>Your Leave Balance</h3>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4 gap-3">
          {LEAVE_TYPES.map(({ value, label, color }) => {
            const used = leaveRequests.filter(l => l.type === value && l.status === 'approved').length;
            const total = LEAVE_BALANCE[value];
            const remaining = Math.max(0, total - used);
            const pct = total > 0 ? (remaining / total) * 100 : 0;
            return (
              <div key={value} className={clsx('rounded-xl p-3.5', darkMode ? 'bg-white/5' : 'bg-slate-50 border border-slate-100')}>
                <span className={clsx('badge text-[10px] mb-2', color)}>{label}</span>
                <div className={clsx('text-2xl font-extrabold', darkMode ? 'text-white' : 'text-slate-800')}>{remaining}<span className="text-sm font-medium text-slate-400">/{total}</span></div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">days remaining</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter + Apply */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={clsx('w-full text-sm rounded-xl px-3 py-2.5 border outline-none sm:w-auto', darkMode ? 'bg-[#1a1d2e] border-white/8 text-white' : 'bg-white border-slate-200')}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className={clsx('w-full text-sm rounded-xl px-3 py-2.5 border outline-none sm:w-auto', darkMode ? 'bg-[#1a1d2e] border-white/8 text-white' : 'bg-white border-slate-200')}>
            <option value="">All Types</option>
            {LEAVE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <button onClick={() => setShowApply(true)} className="btn btn-primary w-full gap-2 sm:w-auto">
          <Plus size={15} /> Apply Leave
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className={clsx('rounded-2xl overflow-hidden', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm')}>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr className={darkMode ? 'bg-white/3' : 'bg-slate-50'}>
                {['Employee', 'Department', 'Leave Type', 'Duration', 'Days', 'Reason', 'Applied', 'Status', 'Actions'].map(h => (
                  <th key={h} className={clsx('text-left', darkMode ? 'text-white/40' : 'text-slate-400')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map(req => {
                const lt = LEAVE_TYPES.find(t => t.value === req.type);
                const days = Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / 86400000) + 1;
                return (
                  <tr key={req.id} className={clsx('transition-colors', darkMode ? 'hover:bg-white/3' : 'hover:bg-slate-50/70')}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {empName(req.employeeId).charAt(0)}
                        </div>
                        <span className={clsx('text-xs font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>{empName(req.employeeId)}</span>
                      </div>
                    </td>
                    <td className={clsx('text-xs', darkMode ? 'text-white/60' : 'text-slate-500')}>{empDept(req.employeeId)}</td>
                    <td><span className={clsx('badge text-[10px] max-md:w-[74px] max-md:min-h-9 max-md:justify-center max-md:text-center max-md:leading-tight', lt?.color ?? '')}>{lt?.label}</span></td>
                    <td className={clsx('text-xs whitespace-nowrap', darkMode ? 'text-white/60' : 'text-slate-500')}>{req.startDate} → {req.endDate}</td>
                    <td className={clsx('text-xs font-semibold', darkMode ? 'text-white' : 'text-slate-700')}>{days}d</td>
                    <td className={clsx('text-xs max-w-[120px] truncate', darkMode ? 'text-white/60' : 'text-slate-500')}>{req.reason}</td>
                    <td className={clsx('text-xs', darkMode ? 'text-white/40' : 'text-slate-400')}>{req.appliedDate}</td>
                    <td><span className={`badge badge-${req.status}`}>{req.status}</span></td>
                    <td>
                      {req.status === 'pending' && (
                        <div className="flex gap-1">
                          <button onClick={() => handleAction(req.id, 'approved')} className="btn btn-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 gap-1"><CheckCircle size={12}/> Approve</button>
                          <button onClick={() => handleAction(req.id, 'rejected')} className="btn btn-sm bg-rose-50 text-rose-600 hover:bg-rose-100 gap-1"><XCircle size={12}/> Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-slate-400">No leave requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApply && (
        <Modal title="Apply for Leave" onClose={() => setShowApply(false)}>
          <div className="space-y-4">
            <div>
              <label className={clsx('block text-xs font-semibold mb-1.5 uppercase tracking-wide', darkMode ? 'text-white/50' : 'text-slate-500')}>Leave Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as LeaveType }))} className="input-field">
                {LEAVE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={clsx('block text-xs font-semibold mb-1.5 uppercase tracking-wide', darkMode ? 'text-white/50' : 'text-slate-500')}>Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className={clsx('block text-xs font-semibold mb-1.5 uppercase tracking-wide', darkMode ? 'text-white/50' : 'text-slate-500')}>End Date</label>
                <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="input-field" />
              </div>
            </div>
            <div>
              <label className={clsx('block text-xs font-semibold mb-1.5 uppercase tracking-wide', darkMode ? 'text-white/50' : 'text-slate-500')}>Reason</label>
              <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className="input-field resize-none h-24" placeholder="Describe the reason for leave..." />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 mt-6 sm:flex-row sm:justify-end">
            <button className="btn btn-secondary" onClick={() => setShowApply(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleApply}>Submit Request</button>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}
