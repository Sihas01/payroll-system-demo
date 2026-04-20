'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppShell from '@/components/AppShell';
import { DollarSign, CheckCircle, Clock, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { clsx } from 'clsx';

const MONTHS = [
  { value: '2025-01', label: 'January 2025' },
  { value: '2025-02', label: 'February 2025' },
  { value: '2025-03', label: 'March 2025' },
  { value: '2025-04', label: 'April 2025' },
  { value: '2025-05', label: 'May 2025' },
  { value: '2025-06', label: 'June 2025' },
  { value: '2025-07', label: 'July 2025' },
  { value: '2025-08', label: 'August 2025' },
  { value: '2025-09', label: 'September 2025' },
  { value: '2025-10', label: 'October 2025' },
  { value: '2025-11', label: 'November 2025' },
  { value: '2025-12', label: 'December 2025' },
];

export default function PayrollPage() {
  const { currentUser, employees, payroll, generatePayrollForMonth, approvePayroll, markPayrollPaid, darkMode , hydrated } = useStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !currentUser) router.push('/login'); }, [currentUser, hydrated, router]);

  const [selectedMonth, setSelectedMonth] = useState('2025-12');
  const [toast, setToast] = useState('');
  const [generating, setGenerating] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const monthRecords = useMemo(() =>
    payroll.filter(p => p.month === selectedMonth), [payroll, selectedMonth]);

  const empName = (id: string) => employees.find(e => e.id === id)?.name ?? id;
  const empId   = (id: string) => employees.find(e => e.id === id)?.employeeId ?? id;

  const totalGross = monthRecords.reduce((s, p) => s + p.grossSalary, 0);
  const totalNet   = monthRecords.reduce((s, p) => s + p.netSalary, 0);
  const totalDed   = monthRecords.reduce((s, p) => s + p.totalDeductions, 0);
  const paidCount  = monthRecords.filter(p => p.status === 'paid').length;
  const draftCount = monthRecords.filter(p => p.status === 'draft').length;

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    generatePayrollForMonth(selectedMonth);
    setGenerating(false);
    showToast(`Payroll for ${MONTHS.find(m => m.value === selectedMonth)?.label} generated!`);
  };

  const handleApproveAll = () => {
    monthRecords.filter(p => p.status === 'draft').forEach(p => approvePayroll(p.id));
    showToast('All draft payroll records approved!');
  };

  const handlePayAll = () => {
    monthRecords.filter(p => p.status === 'approved').forEach(p => markPayrollPaid(p.id));
    showToast('All approved payrolls marked as paid!');
  };

  const handleExportCSV = () => {
    const header = 'Employee ID,Name,Gross Salary,Total Deductions,Net Salary,Status\n';
    const rows = monthRecords.map(p =>
      `${empId(p.employeeId)},${empName(p.employeeId)},${p.grossSalary},${p.totalDeductions},${p.netSalary},${p.status}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `payroll-${selectedMonth}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported!');
  };

  if (!hydrated || !currentUser) return null;
  const card = clsx('rounded-2xl p-5', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm');

  return (
    <AppShell title="Payroll">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className={clsx('w-full text-sm rounded-xl px-4 py-2.5 border outline-none font-semibold md:w-auto', darkMode ? 'bg-[#1a1d2e] border-white/8 text-white' : 'bg-white border-slate-200 text-slate-700')}
        >
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <div className="flex w-full flex-col gap-2 md:ml-auto md:w-auto md:flex-row md:flex-wrap">
          <button onClick={handleGenerate} disabled={generating} className="btn btn-secondary gap-2">
            <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Generating…' : 'Generate Payroll'}
          </button>
          {draftCount > 0 && (
            <button onClick={handleApproveAll} className="btn gap-2 bg-amber-500 text-white hover:bg-amber-600">
              <CheckCircle size={14} /> Approve All ({draftCount})
            </button>
          )}
          {monthRecords.some(p => p.status === 'approved') && (
            <button onClick={handlePayAll} className="btn btn-success gap-2">
              <DollarSign size={14} /> Mark All Paid
            </button>
          )}
          <button onClick={handleExportCSV} className="btn btn-secondary gap-2">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Gross', value: `$${totalGross.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Total Deductions', value: `$${totalDed.toLocaleString()}`, icon: AlertCircle, color: 'text-rose-500 bg-rose-500/10' },
          { label: 'Net Payable', value: `$${totalNet.toLocaleString()}`, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Paid / Total', value: `${paidCount} / ${monthRecords.length}`, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={card}>
            <div className="flex items-center justify-between">
              <div>
                <p className={clsx('text-xs font-semibold uppercase tracking-wider mb-1', darkMode ? 'text-white/40' : 'text-slate-400')}>{label}</p>
                <p className={clsx('text-xl font-extrabold', darkMode ? 'text-white' : 'text-slate-800')}>{value}</p>
              </div>
              <div className={clsx('w-11 h-11 rounded-2xl flex items-center justify-center', color)}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payroll Table */}
      <div className={clsx('rounded-2xl overflow-hidden', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm')}>
        <div className={clsx('flex items-center justify-between px-5 py-4 border-b', darkMode ? 'border-white/5' : 'border-slate-100')}>
          <h3 className={clsx('font-semibold text-sm', darkMode ? 'text-white' : 'text-slate-800')}>
            Payroll Records — {MONTHS.find(m => m.value === selectedMonth)?.label}
          </h3>
          <span className="text-xs text-slate-400">{monthRecords.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr className={darkMode ? 'bg-white/3' : 'bg-slate-50'}>
                {['Employee', 'Basic', 'OT Pay', 'Bonus', 'Allowance', 'Gross', 'Tax', 'EPF', 'ETF', 'Total Ded.', 'Net Salary', 'Status', 'Actions'].map(h => (
                  <th key={h} className={clsx('text-left text-[11px]', darkMode ? 'text-white/40' : 'text-slate-400')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthRecords.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <DollarSign size={40} className="text-slate-300" />
                      <p className="text-slate-400 text-sm">No payroll generated for this month.</p>
                      <button onClick={handleGenerate} className="btn btn-primary btn-sm gap-2">
                        <RefreshCw size={13} /> Generate Now
                      </button>
                    </div>
                  </td>
                </tr>
              ) : monthRecords.map(rec => (
                <tr key={rec.id} className={clsx('transition-colors', darkMode ? 'hover:bg-white/3' : 'hover:bg-slate-50/70')}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {empName(rec.employeeId).charAt(0)}
                      </div>
                      <div>
                        <div className={clsx('text-xs font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>{empName(rec.employeeId)}</div>
                        <div className="text-[10px] text-slate-400">{empId(rec.employeeId)}</div>
                      </div>
                    </div>
                  </td>
                  {[rec.basicSalary, rec.overtimePay, rec.bonus, rec.allowances, rec.grossSalary].map((v, i) => (
                    <td key={i} className={clsx('text-xs', darkMode ? 'text-white/70' : 'text-slate-600')}>${v.toLocaleString()}</td>
                  ))}
                  {[rec.taxDeduction, rec.epfDeduction, rec.etfDeduction, rec.totalDeductions].map((v, i) => (
                    <td key={i} className="text-xs text-rose-500">-${v.toLocaleString()}</td>
                  ))}
                  <td className={clsx('text-xs font-bold', darkMode ? 'text-white' : 'text-slate-800')}>${rec.netSalary.toLocaleString()}</td>
                  <td><span className={`badge badge-${rec.status}`}>{rec.status}</span></td>
                  <td>
                    <div className="flex gap-1">
                      {rec.status === 'draft' && (
                        <button onClick={() => { approvePayroll(rec.id); showToast('Approved!'); }} className="btn btn-sm bg-amber-50 text-amber-600 hover:bg-amber-100 text-[10px]">Approve</button>
                      )}
                      {rec.status === 'approved' && (
                        <button onClick={() => { markPayrollPaid(rec.id); showToast('Marked as Paid!'); }} className="btn btn-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[10px]">Pay</button>
                      )}
                      {rec.status === 'paid' && (
                        <span className="text-[10px] text-emerald-500 font-semibold">{rec.paymentDate}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
