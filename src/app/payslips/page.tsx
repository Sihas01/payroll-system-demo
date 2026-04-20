'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppShell from '@/components/AppShell';
import Modal from '@/components/Modal';
import { PayrollRecord } from '@/lib/data';
import { FileText, Download, Printer, Search } from 'lucide-react';
import { clsx } from 'clsx';

const MONTHS_LABELS: Record<string, string> = {
  '2025-01': 'January 2025', '2025-02': 'February 2025', '2025-03': 'March 2025',
  '2025-04': 'April 2025',   '2025-05': 'May 2025',      '2025-06': 'June 2025',
  '2025-07': 'July 2025',    '2025-08': 'August 2025',   '2025-09': 'September 2025',
  '2025-10': 'October 2025', '2025-11': 'November 2025', '2025-12': 'December 2025',
};

export default function PayslipsPage() {
  const { currentUser, employees, payroll, darkMode , hydrated } = useStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !currentUser) router.push('/login'); }, [currentUser, hydrated, router]);

  const [search, setSearch] = useState('');
  const [viewSlip, setViewSlip] = useState<PayrollRecord | null>(null);
  const [filterMonth, setFilterMonth] = useState('');

  const employeeById = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

  const paidPayroll = useMemo(() =>
    payroll.filter(p => p.status === 'paid' &&
      (!filterMonth || p.month === filterMonth)
    ), [payroll, filterMonth]);

  const emp = (id: string) => employeeById.get(id);

  const filtered = useMemo(() =>
    paidPayroll.filter(p => {
      const e = employeeById.get(p.employeeId);
      return !search || e?.name.toLowerCase().includes(search.toLowerCase()) || e?.employeeId.toLowerCase().includes(search.toLowerCase());
    }), [employeeById, paidPayroll, search]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (rec: PayrollRecord) => {
    const e = emp(rec.employeeId);
    const content = `
PAYSLIP — ${MONTHS_LABELS[rec.month]}
=====================================
Employee: ${e?.name}
Employee ID: ${e?.employeeId}
Department: ${e?.departmentId}
Designation: ${e?.designation}
Payment Date: ${rec.paymentDate}

EARNINGS
--------
Basic Salary:     $${rec.basicSalary.toLocaleString()}
Overtime Pay:     $${rec.overtimePay.toLocaleString()}
Bonus:            $${rec.bonus.toLocaleString()}
Allowances:       $${rec.allowances.toLocaleString()}
Incentives:       $${rec.incentives.toLocaleString()}
GROSS SALARY:     $${rec.grossSalary.toLocaleString()}

DEDUCTIONS
----------
Income Tax:       -$${rec.taxDeduction.toLocaleString()}
EPF:              -$${rec.epfDeduction.toLocaleString()}
ETF:              -$${rec.etfDeduction.toLocaleString()}
Loan Deduction:   -$${rec.loanDeduction.toLocaleString()}
Penalties:        -$${rec.penalties.toLocaleString()}
TOTAL DEDUCTIONS: -$${rec.totalDeductions.toLocaleString()}

NET SALARY:       $${rec.netSalary.toLocaleString()}
=====================================
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `payslip-${e?.employeeId}-${rec.month}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!hydrated || !currentUser) return null;
  const card = clsx('rounded-2xl p-5', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm');

  return (
    <AppShell title="Payslips">
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
        <div className={clsx('flex items-center gap-2 flex-1 rounded-xl px-3 py-2.5 border', darkMode ? 'bg-[#1a1d2e] border-white/8' : 'bg-white border-slate-200')}>
          <Search size={15} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by employee name or ID…" className={clsx('bg-transparent text-sm outline-none flex-1', darkMode ? 'text-white placeholder:text-white/30' : 'text-slate-700')} />
        </div>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className={clsx('w-full text-sm rounded-xl px-3 py-2.5 border outline-none md:w-auto', darkMode ? 'bg-[#1a1d2e] border-white/8 text-white' : 'bg-white border-slate-200')}>
          <option value="">All Months</option>
          {Object.entries(MONTHS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Grid of payslip cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.slice(0, 30).map(rec => {
          const e = emp(rec.employeeId);
          if (!e) return null;
          return (
            <div key={rec.id} className={clsx(card, 'hover:-translate-y-1 transition-all duration-200 cursor-pointer group animate-fade-in')}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {e.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={clsx('text-sm font-semibold truncate', darkMode ? 'text-white' : 'text-slate-800')}>{e.name}</div>
                  <div className="text-[11px] text-slate-400">{e.employeeId} · {e.designation}</div>
                </div>
                <span className="badge badge-paid text-[10px]">PAID</span>
              </div>

              {/* Period */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Pay Period</div>
                  <div className={clsx('text-xs font-semibold', darkMode ? 'text-white' : 'text-slate-700')}>{MONTHS_LABELS[rec.month]}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Payment Date</div>
                  <div className={clsx('text-xs font-semibold', darkMode ? 'text-white' : 'text-slate-700')}>{rec.paymentDate}</div>
                </div>
              </div>

              {/* Salary breakdown mini */}
              <div className={clsx('rounded-xl p-3 space-y-1.5 mb-4', darkMode ? 'bg-white/5' : 'bg-slate-50')}>
                {[
                  ['Gross Salary', `$${rec.grossSalary.toLocaleString()}`, ''],
                  ['Total Deductions', `-$${rec.totalDeductions.toLocaleString()}`, 'text-rose-500'],
                  ['Net Salary', `$${rec.netSalary.toLocaleString()}`, 'text-emerald-600 font-bold'],
                ].map(([l, v, cls]) => (
                  <div key={l} className="flex justify-between text-xs">
                    <span className={darkMode ? 'text-white/50' : 'text-slate-500'}>{l}</span>
                    <span className={clsx(darkMode ? 'text-white' : 'text-slate-800', cls)}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => setViewSlip(rec)} className="btn btn-secondary btn-sm flex-1 gap-1.5 justify-center">
                  <FileText size={13} /> View
                </button>
                <button onClick={() => handleDownload(rec)} className="btn btn-sm gap-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex-1 justify-center">
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400">
            <FileText size={48} className="mx-auto mb-3 text-slate-300" />
            <p>No payslips found.</p>
          </div>
        )}
      </div>

      {/* Payslip Detail Modal */}
      {viewSlip && (() => {
        const e = emp(viewSlip.employeeId);
        return (
          <Modal title={`Payslip — ${MONTHS_LABELS[viewSlip.month]}`} onClose={() => setViewSlip(null)} size="lg">
            {/* Payslip document */}
            <div id="payslip-print" className={clsx('rounded-xl overflow-hidden border', darkMode ? 'border-white/10' : 'border-slate-200')}>
              {/* Header band */}
              <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-5 text-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs opacity-70 uppercase tracking-widest mb-1">PayrollPro Inc.</div>
                    <div className="text-xl font-bold">Payslip</div>
                    <div className="text-xs opacity-80 mt-0.5">{MONTHS_LABELS[viewSlip.month]}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-70">Payment Date</div>
                    <div className="font-semibold">{viewSlip.paymentDate}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Employee Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {[
                    ['Employee Name', e?.name],
                    ['Employee ID', e?.employeeId],
                    ['Designation', e?.designation],
                    ['Bank Account', e?.bankAccount],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{k}</div>
                      <div className={clsx('font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>{v}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Earnings */}
                  <div className={clsx('rounded-xl p-4', darkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100')}>
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Earnings</h4>
                    <div className="space-y-2">
                      {[
                        ['Basic Salary', viewSlip.basicSalary],
                        ['Overtime Pay', viewSlip.overtimePay],
                        ['Bonus', viewSlip.bonus],
                        ['Allowances', viewSlip.allowances],
                        ['Incentives', viewSlip.incentives],
                      ].map(([l, v]) => (
                        <div key={l as string} className="flex justify-between text-xs">
                          <span className="text-slate-500">{l}</span>
                          <span className={clsx('font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>${(v as number).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className={clsx('border-t pt-2 flex justify-between text-sm font-bold', darkMode ? 'border-emerald-500/20' : 'border-emerald-200')}>
                        <span className="text-emerald-600">Gross Total</span>
                        <span className="text-emerald-600">${viewSlip.grossSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className={clsx('rounded-xl p-4', darkMode ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-100')}>
                    <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-3">Deductions</h4>
                    <div className="space-y-2">
                      {[
                        ['Income Tax (12%)', viewSlip.taxDeduction],
                        ['EPF (8%)', viewSlip.epfDeduction],
                        ['ETF (3%)', viewSlip.etfDeduction],
                        ['Loan Deduction', viewSlip.loanDeduction],
                        ['Penalties', viewSlip.penalties],
                      ].map(([l, v]) => (
                        <div key={l as string} className="flex justify-between text-xs">
                          <span className="text-slate-500">{l}</span>
                          <span className="text-rose-500 font-semibold">-${(v as number).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className={clsx('border-t pt-2 flex justify-between text-sm font-bold', darkMode ? 'border-rose-500/20' : 'border-rose-200')}>
                        <span className="text-rose-600">Total Deductions</span>
                        <span className="text-rose-600">-${viewSlip.totalDeductions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl p-4 flex flex-col gap-3 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs opacity-70 uppercase tracking-wider">Net Salary</div>
                    <div className="text-2xl font-extrabold">${viewSlip.netSalary.toLocaleString()}</div>
                  </div>
                  <div className="text-right text-xs opacity-80">
                    <div>Paid on {viewSlip.paymentDate}</div>
                    <div>via {e?.bankName}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 mt-4 sm:flex-row sm:justify-end">
              <button onClick={handlePrint} className="btn btn-secondary gap-2"><Printer size={14} /> Print</button>
              <button onClick={() => handleDownload(viewSlip)} className="btn btn-primary gap-2"><Download size={14} /> Download</button>
            </div>
          </Modal>
        );
      })()}
    </AppShell>
  );
}
