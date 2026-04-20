'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppShell from '@/components/AppShell';
import { Mail, Phone, MapPin, Briefcase, Edit2, Save, X, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { DEPARTMENTS } from '@/lib/data';

export default function ProfilePage() {
  const { currentUser, employees, payroll, leaveRequests, attendance, updateEmployee, darkMode , hydrated } = useStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !currentUser) router.push('/login'); }, [currentUser, hydrated, router]);

  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState('');

  const emp = employees.find(e => e.id === currentUser?.employeeId || e.email === currentUser?.email);
  const [form, setForm] = useState({ phone: emp?.phone ?? '', address: emp?.address ?? '', bankName: emp?.bankName ?? '', bankAccount: emp?.bankAccount ?? '' });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSave = () => {
    if (emp) { updateEmployee(emp.id, form); }
    setEditing(false);
    showToast('Profile updated successfully!');
  };

  const myPayroll = payroll.filter(p => p.employeeId === emp?.id && p.status === 'paid');
  const myLeaves  = leaveRequests.filter(l => l.employeeId === emp?.id);
  const myAttend  = attendance.filter(a => a.employeeId === emp?.id);
  const dept      = DEPARTMENTS.find(d => d.id === emp?.departmentId);

  if (!hydrated || !currentUser) return null;
  const card = clsx('rounded-2xl p-5', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm');



  return (
    <AppShell title="My Profile">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in">
          ✓ {toast}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left — Profile Card */}
        <div className="xl:col-span-1 space-y-4">
          {/* Avatar + Basic Info */}
          <div className={clsx(card, 'text-center')}>
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-4xl font-extrabold mx-auto shadow-2xl bg-gradient-to-br from-indigo-400 to-cyan-400">
                {currentUser.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white dark:border-[#1a1d2e]" />
            </div>
            <h2 className={clsx('text-xl font-bold mb-1', darkMode ? 'text-white' : 'text-slate-800')}>{currentUser.name}</h2>
            <p className="text-sm text-indigo-400 font-medium capitalize mb-1">{currentUser.role.replace(/_/g,' ')}</p>
            {emp && <p className="text-xs text-slate-400">{emp.designation}</p>}

            {/* Role badge */}
            <div className={clsx(
              'mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400'
            )}>
              <Shield size={12} /> {currentUser.role.replace(/_/g,' ').toUpperCase()}
            </div>

            {emp && (
              <div className={clsx('mt-4 space-y-2 text-sm', darkMode ? 'text-white/60' : 'text-slate-500')}>
                <div className="flex items-center justify-center gap-2"><Mail size={13}/>{emp.email}</div>
                <div className="flex items-center justify-center gap-2"><Phone size={13}/>{emp.phone}</div>
                {emp.address && <div className="flex items-center justify-center gap-2"><MapPin size={13}/><span className="text-xs truncate">{emp.address}</span></div>}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className={card}>
            <h3 className={clsx('font-semibold text-sm mb-3', darkMode ? 'text-white' : 'text-slate-800')}>My Statistics</h3>
            <div className="space-y-3">
              {[
                { label: 'Payslips Received', value: myPayroll.length, color: 'text-indigo-500' },
                { label: 'Leave Requests', value: myLeaves.length, color: 'text-amber-500' },
                { label: 'Days Attended', value: myAttend.filter(a => a.status === 'present').length, color: 'text-emerald-500' },
                { label: 'Overtime Hours', value: `${myAttend.reduce((s, a) => s + a.overtimeHours, 0)}h`, color: 'text-rose-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className={clsx('text-xs', darkMode ? 'text-white/50' : 'text-slate-500')}>{label}</span>
                  <span className={clsx('text-sm font-bold', color)}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department */}
          {dept && (
            <div className={clsx(card, 'flex items-center gap-3')}>
              <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: dept.color + '20' }}>
                <Briefcase size={18} style={{ color: dept.color }} />
              </div>
              <div>
                <div className={clsx('text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>{dept.name}</div>
                <div className="text-xs text-slate-400">Department</div>
              </div>
              <div className="ml-auto shrink-0 text-right">
                <div className="text-xs font-semibold" style={{ color: dept.color }}>{dept.employeeCount} members</div>
              </div>
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div className="xl:col-span-2 space-y-5">
          {/* Employment Details */}
          {emp && (
            <div className={card}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={clsx('font-bold text-sm', darkMode ? 'text-white' : 'text-slate-800')}>Employment Details</h3>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm gap-1.5">
                    <Edit2 size={13} /> Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm gap-1.5"><X size={13}/> Cancel</button>
                    <button onClick={handleSave} className="btn btn-primary btn-sm gap-1.5"><Save size={13}/> Save</button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Employee ID', value: emp.employeeId, editable: false },
                  { label: 'Full Name', value: emp.name, editable: false },
                  { label: 'Email Address', value: emp.email, editable: false },
                  { label: 'Designation', value: emp.designation, editable: false },
                  { label: 'Employment Type', value: emp.employmentType.replace('_',' '), editable: false },
                  { label: 'Join Date', value: emp.joinDate, editable: false },
                  { label: 'NIC', value: emp.nic, editable: false },
                  { label: 'Status', value: emp.status, editable: false, badge: true },
                ].map(({ label, value, badge }) => (
                  <div key={label}>
                    <label className={clsx('block text-[10px] font-semibold uppercase tracking-wider mb-1', darkMode ? 'text-white/40' : 'text-slate-400')}>{label}</label>
                    {badge ? (
                      <span className={`badge badge-${value}`}>{value}</span>
                    ) : (
                      <div className={clsx('text-sm font-semibold capitalize', darkMode ? 'text-white' : 'text-slate-700')}>{value}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editable Fields */}
          <div className={card}>
            <h3 className={clsx('font-bold text-sm mb-4', darkMode ? 'text-white' : 'text-slate-800')}>Personal & Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Phone Number', key: 'phone' as const, icon: Phone },
                { label: 'Bank Name', key: 'bankName' as const, icon: Briefcase },
                { label: 'Bank Account', key: 'bankAccount' as const, icon: Shield },
              ].map(({ label, key, icon: Icon }) => (
                <div key={key}>
                  <label className={clsx('block text-[10px] font-semibold uppercase tracking-wider mb-1.5', darkMode ? 'text-white/40' : 'text-slate-400')}>{label}</label>
                  {editing ? (
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-field" />
                  ) : (
                    <div className={clsx('flex items-center gap-2 text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-700')}>
                      <Icon size={13} className="text-slate-400 shrink-0" />
                      {form[key] || <span className="text-slate-400 italic text-xs">Not set</span>}
                    </div>
                  )}
                </div>
              ))}
              <div className="md:col-span-2">
                <label className={clsx('block text-[10px] font-semibold uppercase tracking-wider mb-1.5', darkMode ? 'text-white/40' : 'text-slate-400')}>Address</label>
                {editing ? (
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input-field" />
                ) : (
                  <div className={clsx('flex items-center gap-2 text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-700')}>
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    {form.address || <span className="text-slate-400 italic text-xs">Not set</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Payslips */}
          <div className={card}>
            <h3 className={clsx('font-bold text-sm mb-4', darkMode ? 'text-white' : 'text-slate-800')}>Recent Payslips</h3>
            {myPayroll.length === 0 ? (
              <p className="text-slate-400 text-sm">No payslips available yet.</p>
            ) : (
              <div className="space-y-2">
                {myPayroll.slice(-6).reverse().map(p => (
                  <div key={p.id} className={clsx(
                    'flex flex-col gap-2 px-4 py-3 rounded-xl transition-colors sm:flex-row sm:items-center sm:justify-between',
                    darkMode ? 'bg-white/3 hover:bg-white/5' : 'bg-slate-50 hover:bg-slate-100'
                  )}>
                    <div>
                      <div className={clsx('text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>
                        {p.month}
                      </div>
                      <div className="text-xs text-slate-400">Paid on {p.paymentDate}</div>
                    </div>
                    <div className="text-right">
                      <div className={clsx('text-sm font-bold', darkMode ? 'text-white' : 'text-slate-800')}>${p.netSalary.toLocaleString()}</div>
                      <span className="badge badge-paid text-[10px]">Paid</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave History */}
          <div className={card}>
            <h3 className={clsx('font-bold text-sm mb-4', darkMode ? 'text-white' : 'text-slate-800')}>Leave History</h3>
            {myLeaves.length === 0 ? (
              <p className="text-slate-400 text-sm">No leave requests yet.</p>
            ) : (
              <div className="space-y-2">
                {myLeaves.slice(0, 5).map(l => (
                  <div key={l.id} className={clsx(
                    'flex flex-col gap-2 px-4 py-3 rounded-xl sm:flex-row sm:items-center sm:justify-between',
                    darkMode ? 'bg-white/3' : 'bg-slate-50'
                  )}>
                    <div>
                      <div className={clsx('text-xs font-semibold capitalize', darkMode ? 'text-white' : 'text-slate-800')}>{l.type} Leave</div>
                      <div className="text-[10px] text-slate-400">{l.startDate} → {l.endDate}</div>
                    </div>
                    <span className={`badge badge-${l.status} text-[10px]`}>{l.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
