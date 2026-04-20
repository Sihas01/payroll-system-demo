'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import {
  BarChart3,
  Download,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { MONTHLY_PAYROLL_TREND, DEPARTMENTS } from '@/lib/data';
import { useStore } from '@/lib/store';

const REPORT_TABS = [
  { id: 'payroll', label: 'Payroll Summary', icon: DollarSign },
  { id: 'dept', label: 'Department Report', icon: BarChart3 },
  { id: 'employees', label: 'Employee Report', icon: Users },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
] as const;

type ReportTab = (typeof REPORT_TABS)[number]['id'];
type CsvValue = string | number | boolean | null | undefined;

export default function ReportsContent() {
  const { currentUser, employees, payroll, hydrated, darkMode } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<ReportTab>('payroll');
  const [dateFrom, setDateFrom] = useState('2025-01');
  const [dateTo, setDateTo] = useState('2025-12');

  useEffect(() => {
    if (hydrated && !currentUser) router.push('/login');
  }, [currentUser, hydrated, router]);

  const deptSalaryData = useMemo(() => (
    DEPARTMENTS.map((department) => {
      const departmentEmployees = employees.filter((employee) => employee.departmentId === department.id);
      const monthlyTotal = departmentEmployees.reduce((sum, employee) => sum + employee.basicSalary / 12, 0);

      return {
        name: department.name,
        color: department.color,
        count: departmentEmployees.length,
        total: Math.round(monthlyTotal),
      };
    })
  ), [employees]);

  if (!hydrated || !currentUser) return null;

  const totalPayroll = payroll
    .filter((record) => record.status === 'paid')
    .reduce((sum, record) => sum + record.netSalary, 0);
  const avgSalary = employees.length > 0
    ? Math.round(employees.reduce((sum, employee) => sum + employee.basicSalary, 0) / employees.length / 12)
    : 0;
  const totalTax = payroll.reduce((sum, record) => sum + record.taxDeduction, 0);
  const activeEmployees = employees.filter((employee) => employee.status === 'active').length;
  const inactiveEmployees = employees.filter((employee) => employee.status === 'inactive').length;
  const leaveEmployees = employees.filter((employee) => employee.status === 'on_leave').length;
  const maxDepartmentPayroll = Math.max(...deptSalaryData.map((department) => department.total), 1);

  const exportCSV = (data: Record<string, CsvValue>[], filename: string) => {
    if (data.length === 0) return;

    const keys = Object.keys(data[0]);
    const rows = [
      keys.join(','),
      ...data.map((row) => keys.map((key) => JSON.stringify(row[key] ?? '')).join(',')),
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `${filename}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const card = clsx(
    'rounded-2xl p-5',
    darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm'
  );
  const mutedText = darkMode ? 'text-white/50' : 'text-slate-500';
  const strongText = darkMode ? 'text-white' : 'text-slate-800';

  return (
    <AppShell title="Reports & Analytics">
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Payroll Disbursed', value: `$${(totalPayroll / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Avg Monthly Salary', value: `$${avgSalary.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Total Employees', value: employees.length, icon: Users, color: 'text-cyan-500 bg-cyan-500/10' },
          { label: 'Total Tax Collected', value: `$${(totalTax / 1000).toFixed(1)}K`, icon: BarChart3, color: 'text-amber-500 bg-amber-500/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={card}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={clsx('text-xs font-semibold uppercase tracking-wider mb-1', mutedText)}>{label}</p>
                <p className={clsx('text-xl font-extrabold', strongText)}>{value}</p>
              </div>
              <div className={clsx('w-11 h-11 rounded-2xl flex items-center justify-center shrink-0', color)}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mb-5 xl:flex-row xl:items-center xl:justify-between">
        <div className={clsx('flex flex-wrap gap-1 p-1 rounded-xl w-fit', darkMode ? 'bg-white/5' : 'bg-slate-100')}>
          {REPORT_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                tab === id
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-[#1a1d2e] dark:text-white'
                  : darkMode ? 'text-white/50 hover:text-white' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="grid grid-cols-[auto_1fr] items-center gap-2 text-sm sm:flex">
            <span className={mutedText}>From</span>
            <input type="month" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="input-field w-full sm:w-40" />
            <span className={mutedText}>To</span>
            <input type="month" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="input-field w-full sm:w-40" />
          </div>
          <button
            onClick={() => exportCSV(MONTHLY_PAYROLL_TREND, `report-${tab}-${dateFrom}-${dateTo}`)}
            className="btn btn-secondary gap-2"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {tab === 'payroll' && (
        <div className={clsx(card, 'overflow-hidden')}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={clsx('font-semibold text-sm', strongText)}>Monthly Payroll Expense - 2025</h3>
              <p className="text-xs text-slate-400">Total salary disbursed per month</p>
            </div>
            <span className="text-xs font-semibold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">Annual</span>
          </div>
          <ReportTable
            darkMode={darkMode}
            headers={['Month', 'Employees', 'Total Payroll', 'Avg. Salary', 'Change']}
            rows={MONTHLY_PAYROLL_TREND.map((row, index) => {
              const previous = MONTHLY_PAYROLL_TREND[index - 1];
              const change = previous ? ((row.total - previous.total) / previous.total) * 100 : null;

              return [
                `${row.month} 2025`,
                row.employees.toString(),
                `$${row.total.toLocaleString()}`,
                `$${Math.round(row.total / row.employees).toLocaleString()}`,
                change === null ? '-' : `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
              ];
            })}
          />
        </div>
      )}

      {tab === 'dept' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className={card}>
            <h3 className={clsx('font-semibold text-sm mb-4', strongText)}>Department Payroll Distribution</h3>
            <div className="space-y-4">
              {deptSalaryData.map((department) => (
                <div key={department.name}>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className={clsx('font-semibold', strongText)}>{department.name}</span>
                    <span className={mutedText}>${department.total.toLocaleString()}/mo</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ background: department.color, width: `${(department.total / maxDepartmentPayroll) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={card}>
            <h3 className={clsx('font-semibold text-sm mb-4', strongText)}>Department Details</h3>
            <div className="space-y-3">
              {deptSalaryData.map((department) => (
                <div key={department.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: department.color }} />
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-sm font-semibold truncate', strongText)}>{department.name}</p>
                    <p className="text-xs text-slate-400">{department.count} employees</p>
                  </div>
                  <span className={clsx('text-xs font-semibold', strongText)}>${department.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'employees' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {[
            { label: 'Active', value: activeEmployees, color: 'text-emerald-500 bg-emerald-500/10' },
            { label: 'Inactive', value: inactiveEmployees, color: 'text-rose-500 bg-rose-500/10' },
            { label: 'On Leave', value: leaveEmployees, color: 'text-amber-500 bg-amber-500/10' },
          ].map((status) => (
            <div key={status.label} className={card}>
              <p className={clsx('text-xs font-semibold uppercase tracking-wider mb-2', mutedText)}>{status.label}</p>
              <p className={clsx('text-3xl font-extrabold', status.color, 'rounded-xl w-fit px-3 py-1')}>
                {status.value}
              </p>
            </div>
          ))}

          <div className={clsx(card, 'xl:col-span-3 overflow-hidden')}>
            <ReportTable
              darkMode={darkMode}
              headers={['Employee', 'Department', 'Salary/Month', 'Status']}
              rows={employees.slice(0, 12).map((employee) => [
                employee.name,
                DEPARTMENTS.find((department) => department.id === employee.departmentId)?.name ?? '-',
                `$${Math.round(employee.basicSalary / 12).toLocaleString()}`,
                employee.status.replace('_', ' '),
              ])}
            />
          </div>
        </div>
      )}

      {tab === 'trends' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className={card}>
            <h3 className={clsx('font-semibold text-sm mb-4', strongText)}>Headcount Growth</h3>
            <ReportTable
              darkMode={darkMode}
              headers={['Month', 'Employees']}
              rows={MONTHLY_PAYROLL_TREND.map((row) => [row.month, row.employees.toString()])}
            />
          </div>
          <div className={card}>
            <h3 className={clsx('font-semibold text-sm mb-4', strongText)}>Salary Forecast (Q1 2026)</h3>
            <div className="space-y-3">
              {[
                { month: 'January', projected: 375000 },
                { month: 'February', projected: 382000 },
                { month: 'March', projected: 390000 },
              ].map((forecast) => (
                <div key={forecast.month} className={clsx('flex items-center justify-between rounded-xl p-3', darkMode ? 'bg-white/5' : 'bg-slate-50')}>
                  <span className={clsx('text-sm font-semibold', strongText)}>{forecast.month}</span>
                  <span className="text-sm font-bold text-indigo-500">${forecast.projected.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">Forecast based on the current 3.5% growth trend.</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function ReportTable({
  darkMode,
  headers,
  rows,
}: {
  darkMode: boolean;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table w-full">
        <thead>
          <tr className={darkMode ? 'bg-white/3' : 'bg-slate-50'}>
            {headers.map((header) => (
              <th key={header} className={clsx('text-left', darkMode ? 'text-white/40' : 'text-slate-400')}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`} className={darkMode ? 'hover:bg-white/3' : 'hover:bg-slate-50/70'}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cell}-${cellIndex}`}
                  className={clsx(
                    'text-xs capitalize',
                    cellIndex === 0 ? 'font-semibold' : '',
                    darkMode ? 'text-white/75' : 'text-slate-600'
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
