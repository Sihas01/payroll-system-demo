'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Briefcase, Eye, EyeOff, Shield, TrendingUp, Users, DollarSign } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@payroll.io', password: 'admin123', color: 'from-violet-500 to-purple-600' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('admin@payroll.io');
  const [password, setPassword] = useState('admin123');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 700));
    const ok = login(email, password);
    if (ok) router.push('/dashboard');
    else { setError('Invalid email or password. Try a demo account below.'); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-[-100px] left-[-100px] w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-80px] w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center shadow-2xl">
              <Briefcase size={26} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-extrabold text-2xl">PayrollPro</div>
              <div className="text-indigo-300 text-xs tracking-widest uppercase font-medium">Management Suite</div>
            </div>
          </div>

          <h2 className="text-white text-3xl font-bold mb-4 leading-tight">
            Streamline Your<br />
            <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">Payroll Operations</span>
          </h2>
          <p className="text-indigo-200/70 text-sm leading-relaxed max-w-xs mx-auto mb-10">
            A modern, secure, and intelligent payroll management platform built for growing businesses.
          </p>

          {/* Feature pills */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Users, label: 'Employee Mgmt' },
              { icon: DollarSign, label: 'Auto Payroll' },
              { icon: TrendingUp, label: 'Analytics' },
              { icon: Shield, label: 'Role-Based' },
              { icon: Briefcase, label: 'Payslips' },
              { icon: TrendingUp, label: 'Reports' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                <Icon size={16} className="text-cyan-300 mx-auto mb-1" />
                <div className="text-white/70 text-[10px] font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-[#f0f2f8] p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 p-6 sm:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Welcome back 👋</h1>
              <p className="text-slate-400 text-sm">Sign in to your PayrollPro account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@payroll.io"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pr-11"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                  <input type="checkbox" className="rounded" /> Remember me
                </label>
                <span className="text-indigo-500 cursor-pointer hover:text-indigo-700">Forgot password?</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center py-3 text-sm mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center mb-3 font-medium uppercase tracking-wider">Demo Account</p>
              <div className="flex justify-center">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                    className={`bg-gradient-to-r ${acc.color} text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity w-full text-center`}
                  >
                    <div>{acc.role} Auto-Fill</div>
                    <div className="opacity-75 mt-0.5 text-[10px]">{acc.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
