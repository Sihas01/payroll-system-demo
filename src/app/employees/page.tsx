'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppShell from '@/components/AppShell';
import Modal from '@/components/Modal';
import { Employee, DEPARTMENTS } from '@/lib/data';
import { Plus, Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { clsx } from 'clsx';

const EMPTY: Omit<Employee, 'id'> = {
  employeeId: '', name: '', email: '', phone: '', address: '', nic: '',
  departmentId: 'dept1', designation: '', joinDate: new Date().toISOString().split('T')[0],
  employmentType: 'full_time', bankName: '', bankAccount: '',
  basicSalary: 0, status: 'active',
};

export default function EmployeesPage() {
  const { currentUser, employees, addEmployee, updateEmployee, deleteEmployee, darkMode , hydrated } = useStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !currentUser) router.push('/login'); }, [currentUser, hydrated, router]);

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [viewEmp, setViewEmp] = useState<Employee | null>(null);
  const [form, setForm] = useState<Omit<Employee, 'id'>>(EMPTY);
  const [toast, setToast] = useState('');
  const PER_PAGE = 10;

  const filtered = useMemo(() => employees.filter(e =>
    (!search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase())) &&
    (!filterDept || e.departmentId === filterDept) &&
    (!filterStatus || e.status === filterStatus)
  ), [employees, search, filterDept, filterStatus]);

  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openAdd = () => { setForm(EMPTY); setShowAdd(true); };
  const openEdit = (e: Employee) => { setForm({ ...e }); setEditEmp(e); };
  const handleSave = () => {
    if (editEmp) { updateEmployee(editEmp.id, form); showToast('Employee updated!'); setEditEmp(null); }
    else { addEmployee(form); showToast('Employee added!'); setShowAdd(false); }
  };
  const handleDelete = (id: string) => { if (confirm('Delete this employee?')) { deleteEmployee(id); showToast('Employee deleted.'); } };

  const dept = (id: string) => DEPARTMENTS.find(d => d.id === id);

  const formField = (label: string, key: keyof Omit<Employee,'id'>, type = 'text', opts?: {options?: {value:string;label:string}[]}) => (
    <div key={key}>
      <label className={clsx('block text-xs font-semibold mb-1.5 uppercase tracking-wide', darkMode ? 'text-white/50' : 'text-slate-500')}>{label}</label>
      {opts?.options ? (
        <select value={form[key] as string} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} className="input-field">
          {opts.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key] as string} onChange={e => setForm(f => ({...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value}))} className="input-field" />
      )}
    </div>
  );

  if (!hydrated || !currentUser) return null;

  return (
    <AppShell title="Employees">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className={clsx('flex items-center gap-2 flex-1 rounded-xl px-3 py-2.5 border', darkMode ? 'bg-[#1a1d2e] border-white/8' : 'bg-white border-slate-200')}>
          <Search size={15} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, ID…" className={clsx('bg-transparent text-sm outline-none flex-1', darkMode ? 'text-white placeholder:text-white/30' : 'text-slate-700')} />
          {search && <button onClick={() => setSearch('')}><X size={14} className="text-slate-400" /></button>}
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <select value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(1); }} className={clsx('w-full text-sm rounded-xl px-3 py-2.5 border outline-none sm:w-auto', darkMode ? 'bg-[#1a1d2e] border-white/8 text-white' : 'bg-white border-slate-200 text-slate-700')}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className={clsx('w-full text-sm rounded-xl px-3 py-2.5 border outline-none sm:w-auto', darkMode ? 'bg-[#1a1d2e] border-white/8 text-white' : 'bg-white border-slate-200 text-slate-700')}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
          <button onClick={openAdd} className="btn btn-primary w-full gap-2 whitespace-nowrap sm:w-auto">
            <Plus size={15} /> Add Employee
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', count: employees.length, color: 'text-indigo-500 bg-indigo-50' },
          { label: 'Active', count: employees.filter(e => e.status === 'active').length, color: 'text-emerald-500 bg-emerald-50' },
          { label: 'On Leave', count: employees.filter(e => e.status === 'on_leave').length, color: 'text-amber-500 bg-amber-50' },
          { label: 'Inactive', count: employees.filter(e => e.status === 'inactive').length, color: 'text-rose-500 bg-rose-50' },
        ].map(s => (
          <div key={s.label} className={clsx('rounded-xl p-3 flex items-center justify-between', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100')}>
            <span className={clsx('text-xs font-semibold', darkMode ? 'text-white/50' : 'text-slate-500')}>{s.label}</span>
            <span className={clsx('text-lg font-bold px-2.5 py-0.5 rounded-lg text-sm', s.color, darkMode && 'bg-opacity-10')}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={clsx('rounded-2xl overflow-hidden', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm')}>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr className={darkMode ? 'bg-white/3' : 'bg-slate-50'}>
                {['Employee', 'ID', 'Department', 'Designation', 'Employment', 'Salary', 'Status', 'Actions'].map(h => (
                  <th key={h} className={clsx('text-left', darkMode ? 'text-white/40' : 'text-slate-400')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(emp => {
                const d = dept(emp.departmentId);
                return (
                  <tr key={emp.id} className={clsx('transition-colors', darkMode ? 'hover:bg-white/3' : 'hover:bg-slate-50/70')}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className={clsx('font-semibold text-xs', darkMode ? 'text-white' : 'text-slate-800')}>{emp.name}</div>
                          <div className="text-[10px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="text-xs font-mono text-indigo-400">{emp.employeeId}</span></td>
                    <td>
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d?.color }} />
                        <span className={darkMode ? 'text-white/70' : 'text-slate-600'}>{d?.name}</span>
                      </span>
                    </td>
                    <td className={clsx('text-xs', darkMode ? 'text-white/70' : 'text-slate-600')}>{emp.designation}</td>
                    <td><span className={clsx('badge', emp.employmentType === 'full_time' ? 'badge-approved' : 'badge-pending')}>{emp.employmentType.replace('_',' ')}</span></td>
                    <td className={clsx('font-semibold text-xs', darkMode ? 'text-white' : 'text-slate-800')}>${emp.basicSalary.toLocaleString()}</td>
                    <td><span className={`badge badge-${emp.status}`}>{emp.status.replace('_',' ')}</span></td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => setViewEmp(emp)} className={clsx('btn btn-icon btn-sm', darkMode ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}><Eye size={13}/></button>
                        <button onClick={() => openEdit(emp)} className={clsx('btn btn-icon btn-sm', darkMode ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-500 hover:bg-indigo-100')}><Edit2 size={13}/></button>
                        <button onClick={() => handleDelete(emp.id)} className="btn btn-icon btn-sm bg-rose-50 text-rose-500 hover:bg-rose-100"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={clsx('flex flex-col gap-3 px-4 py-3 border-t sm:flex-row sm:items-center sm:justify-between', darkMode ? 'border-white/5' : 'border-slate-100')}>
          <span className="text-xs text-slate-400">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} employees</span>
          <div className="flex flex-wrap gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn btn-secondary btn-sm btn-icon disabled:opacity-40"><ChevronLeft size={14}/></button>
            {Array.from({length: Math.min(5, totalPages)}, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={clsx('btn btn-sm w-8', p === page ? 'btn-primary' : 'btn-secondary')}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="btn btn-secondary btn-sm btn-icon disabled:opacity-40"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAdd || editEmp) && (
        <Modal title={editEmp ? 'Edit Employee' : 'Add New Employee'} onClose={() => { setShowAdd(false); setEditEmp(null); }} size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formField('Employee ID', 'employeeId')}
            {formField('Full Name', 'name')}
            {formField('Email', 'email', 'email')}
            {formField('Phone', 'phone')}
            {formField('NIC / National ID', 'nic')}
            {formField('Department', 'departmentId', 'text', { options: DEPARTMENTS.map(d => ({ value: d.id, label: d.name })) })}
            {formField('Designation', 'designation')}
            {formField('Join Date', 'joinDate', 'date')}
            {formField('Employment Type', 'employmentType', 'text', { options: [
              {value:'full_time',label:'Full Time'},{value:'part_time',label:'Part Time'},
              {value:'contract',label:'Contract'},{value:'intern',label:'Intern'},
            ]})}
            {formField('Basic Salary ($)', 'basicSalary', 'number')}
            {formField('Bank Name', 'bankName')}
            {formField('Bank Account', 'bankAccount')}
            <div className="md:col-span-2">{formField('Address', 'address')}</div>
            {formField('Status', 'status', 'text', { options: [
              {value:'active',label:'Active'},{value:'inactive',label:'Inactive'},{value:'on_leave',label:'On Leave'},
            ]})}
          </div>
          <div className="flex flex-col-reverse gap-2 mt-6 sm:flex-row sm:justify-end">
            <button className="btn btn-secondary" onClick={() => { setShowAdd(false); setEditEmp(null); }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{editEmp ? 'Update Employee' : 'Add Employee'}</button>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewEmp && (
        <Modal title="Employee Details" onClose={() => setViewEmp(null)} size="lg">
          <div className="flex flex-col items-start gap-4 mb-6 pb-6 border-b border-slate-100 sm:flex-row sm:items-center dark:border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
              {viewEmp.name.charAt(0)}
            </div>
            <div>
              <h2 className={clsx('text-lg font-bold', darkMode ? 'text-white' : 'text-slate-800')}>{viewEmp.name}</h2>
              <div className="text-sm text-indigo-400">{viewEmp.designation}</div>
              <div className="text-xs text-slate-400">{viewEmp.email}</div>
            </div>
            <span className="sm:ml-auto"><span className={`badge badge-${viewEmp.status}`}>{viewEmp.status}</span></span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              ['Employee ID', viewEmp.employeeId],
              ['Department', dept(viewEmp.departmentId)?.name],
              ['Phone', viewEmp.phone],
              ['NIC', viewEmp.nic],
              ['Join Date', viewEmp.joinDate],
              ['Employment', viewEmp.employmentType.replace('_',' ')],
              ['Bank', viewEmp.bankName],
              ['Account', viewEmp.bankAccount],
              ['Basic Salary', `$${viewEmp.basicSalary.toLocaleString()}`],
              ['Status', viewEmp.status],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-slate-400 mb-0.5">{k}</div>
                <div className={clsx('font-semibold', darkMode ? 'text-white' : 'text-slate-700')}>{v}</div>
              </div>
            ))}
            <div className="col-span-2">
              <div className="text-xs text-slate-400 mb-0.5">Address</div>
              <div className={clsx('font-semibold', darkMode ? 'text-white' : 'text-slate-700')}>{viewEmp.address}</div>
            </div>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}
