'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppShell from '@/components/AppShell';
import { Settings, Bell, Shield, Palette, Save } from 'lucide-react';
import { clsx } from 'clsx';

const SETTING_TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

function SettingToggle({
  value,
  onChange,
  label,
  desc,
  darkMode,
}: {
  value: boolean;
  onChange: () => void;
  label: string;
  desc?: string;
  darkMode: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className={clsx('text-sm font-medium', darkMode ? 'text-white' : 'text-slate-700')}>{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={onChange}
        className={clsx('relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none shrink-0', value ? 'bg-indigo-500' : darkMode ? 'bg-white/10' : 'bg-slate-200')}
      >
        <div className={clsx('absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200', value ? 'translate-x-5' : '')} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser, darkMode, toggleDarkMode , hydrated } = useStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !currentUser) router.push('/login'); }, [currentUser, hydrated, router]);

  const [tab, setTab] = useState('general');
  const [toast, setToast] = useState('');
  const [companyName, setCompanyName] = useState('PayrollPro Inc.');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPayroll, setNotifPayroll] = useState(true);
  const [notifLeave, setNotifLeave] = useState(true);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  if (!hydrated || !currentUser) return null;
  const card = clsx('rounded-2xl p-5', darkMode ? 'bg-[#1a1d2e] border border-white/5' : 'bg-white border border-slate-100 shadow-sm');

  return (
    <AppShell title="Settings">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in">
          ✓ {toast}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className={clsx('w-full lg:w-56 shrink-0', card)}>
          <div className="space-y-1">
            {SETTING_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={clsx(
                  'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  tab === id
                    ? 'bg-indigo-500/10 text-indigo-500'
                    : darkMode ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                )}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === 'general' && (
            <div className={clsx(card, 'space-y-5')}>
              <h3 className={clsx('font-bold text-base', darkMode ? 'text-white' : 'text-slate-800')}>General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', value: companyName, setter: setCompanyName, type: 'text' },
                  { label: 'Currency', value: currency, setter: setCurrency, type: 'select', options: ['USD','EUR','GBP','LKR','INR','AUD'] },
                  { label: 'Timezone', value: timezone, setter: setTimezone, type: 'select', options: ['America/New_York','Europe/London','Asia/Colombo','Asia/Kolkata','Australia/Sydney'] },
                  { label: 'Fiscal Year Start', value: '01', setter: () => {}, type: 'select', options: ['01 - January','04 - April','07 - July','10 - October'] },
                ].map(({ label, value, setter, type, options }) => (
                  <div key={label}>
                    <label className={clsx('block text-xs font-semibold mb-1.5 uppercase tracking-wide', darkMode ? 'text-white/50' : 'text-slate-500')}>{label}</label>
                    {type === 'select' ? (
                      <select value={value} onChange={e => setter(e.target.value)} className="input-field">
                        {options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={type} value={value} onChange={e => setter(e.target.value)} className="input-field" />
                    )}
                  </div>
                ))}
              </div>
              <div className={clsx('rounded-xl p-4 border', darkMode ? 'border-white/5 bg-white/3' : 'border-slate-100 bg-slate-50')}>
                <div className={clsx('text-xs font-semibold mb-3 uppercase tracking-wider', darkMode ? 'text-white/50' : 'text-slate-400')}>Pay Cycle</div>
                <div className="flex flex-wrap gap-2">
                  {['Monthly','Bi-weekly','Weekly'].map(c => (
                    <button key={c} className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors', c === 'Monthly' ? 'bg-indigo-500 text-white' : darkMode ? 'bg-white/5 text-white/50 hover:bg-white/10' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200')}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => showToast('Settings saved!')} className="btn btn-primary gap-2">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {tab === 'appearance' && (
            <div className={clsx(card, 'space-y-5')}>
              <h3 className={clsx('font-bold text-base', darkMode ? 'text-white' : 'text-slate-800')}>Appearance</h3>
              <div className={clsx('border-b', darkMode ? 'border-white/5' : 'border-slate-100')}>
                <SettingToggle value={darkMode} onChange={toggleDarkMode} label="Dark Mode" desc="Switch between light and dark theme" darkMode={darkMode} />
              </div>
              <div>
                <div className={clsx('text-sm font-semibold mb-3', darkMode ? 'text-white' : 'text-slate-700')}>Accent Color</div>
                <div className="flex gap-3 flex-wrap">
                  {['#6366f1','#22d3ee','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'].map(c => (
                    <button key={c} className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-current transition-all" style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div>
                <div className={clsx('text-sm font-semibold mb-3', darkMode ? 'text-white' : 'text-slate-700')}>Sidebar Style</div>
                <div className="flex flex-wrap gap-2">
                  {['Expanded','Compact','Hidden'].map(s => (
                    <button key={s} className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors', s === 'Expanded' ? 'bg-indigo-500 text-white' : darkMode ? 'bg-white/5 text-white/50' : 'bg-slate-100 text-slate-500')}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => showToast('Appearance saved!')} className="btn btn-primary gap-2"><Save size={14} /> Save</button>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className={clsx(card, 'space-y-1')}>
              <h3 className={clsx('font-bold text-base mb-4', darkMode ? 'text-white' : 'text-slate-800')}>Notification Preferences</h3>
              <div className={clsx('divide-y', darkMode ? 'divide-white/5' : 'divide-slate-100')}>
                <SettingToggle value={notifEmail} onChange={() => setNotifEmail(v => !v)} label="Email Notifications" desc="Receive notifications via email" darkMode={darkMode} />
                <SettingToggle value={notifSms} onChange={() => setNotifSms(v => !v)} label="SMS Notifications" desc="Receive notifications via SMS" darkMode={darkMode} />
                <SettingToggle value={notifPayroll} onChange={() => setNotifPayroll(v => !v)} label="Payroll Alerts" desc="Notify on payroll generation and disbursement" darkMode={darkMode} />
                <SettingToggle value={notifLeave} onChange={() => setNotifLeave(v => !v)} label="Leave Request Alerts" desc="Notify when leave requests are submitted or updated" darkMode={darkMode} />
                <SettingToggle value={true} onChange={() => {}} label="System Announcements" desc="Company-wide announcements and updates" darkMode={darkMode} />
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={() => showToast('Notification settings saved!')} className="btn btn-primary gap-2"><Save size={14} /> Save</button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className={clsx(card, 'space-y-5')}>
              <h3 className={clsx('font-bold text-base', darkMode ? 'text-white' : 'text-slate-800')}>Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={clsx('block text-xs font-semibold mb-1.5 uppercase tracking-wide', darkMode ? 'text-white/50' : 'text-slate-500')}>Current Password</label>
                  <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className={clsx('block text-xs font-semibold mb-1.5 uppercase tracking-wide', darkMode ? 'text-white/50' : 'text-slate-500')}>New Password</label>
                  <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className={clsx('block text-xs font-semibold mb-1.5 uppercase tracking-wide', darkMode ? 'text-white/50' : 'text-slate-500')}>Confirm New Password</label>
                  <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="input-field" placeholder="••••••••" />
                </div>
              </div>
              <div className={clsx('rounded-xl p-4 border space-y-3', darkMode ? 'border-white/5 bg-white/3' : 'border-slate-100 bg-slate-50')}>
                <div className={clsx('text-xs font-semibold uppercase tracking-wider', darkMode ? 'text-white/50' : 'text-slate-400')}>Two-Factor Authentication</div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className={clsx('text-sm font-medium', darkMode ? 'text-white' : 'text-slate-700')}>Enable 2FA</div>
                    <div className="text-xs text-slate-400">Add an extra layer of security to your account</div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Enable</button>
                </div>
              </div>
              <div className={clsx('rounded-xl p-4 border', darkMode ? 'border-white/5 bg-white/3' : 'border-slate-100 bg-slate-50')}>
                <div className={clsx('text-xs font-semibold uppercase tracking-wider mb-3', darkMode ? 'text-white/50' : 'text-slate-400')}>Session & Audit</div>
                <div className="space-y-2 text-xs">
                  {['Last login: Today at 09:15 AM', 'IP: 192.168.1.1', 'Browser: Chrome 120', 'Session expires in: 4 hours'].map(s => (
                    <div key={s} className={clsx('flex items-center gap-2', darkMode ? 'text-white/50' : 'text-slate-500')}>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => { if (newPw !== confirmPw) { alert('Passwords do not match!'); return; } showToast('Password updated!'); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }} className="btn btn-primary gap-2">
                  <Shield size={14} /> Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
