'use client';
import { createContext, useContext, useState, useEffect, ReactNode, createElement } from 'react';
import {
  User, Employee, AttendanceRecord, LeaveRequest, PayrollRecord, Notification, Department,
  USERS, DEPARTMENTS, NOTIFICATIONS,
  generateEmployees, generateAttendance, generateLeaveRequests, generatePayroll,
} from './data';

interface AppState {
  currentUser: User | null;
  users: User[];
  employees: Employee[];
  departments: Department[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
  notifications: Notification[];
  darkMode: boolean;
  sidebarOpen: boolean;
  /** true once the client has loaded persisted state from localStorage */
  hydrated: boolean;
}

interface AppActions {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  markAttendance: (empId: string, status: AttendanceRecord['status']) => void;
  applyLeave: (req: Omit<LeaveRequest, 'id'>) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status']) => void;
  generatePayrollForMonth: (month: string) => void;
  approvePayroll: (id: string) => void;
  markPayrollPaid: (id: string) => void;
  addNotification: (n: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

type Store = AppState & AppActions;

const StoreContext = createContext<Store | null>(null);

const LS_KEY = 'payroll_state';

function loadState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState(state: Partial<AppState>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

// ─── Initial state is IDENTICAL on server and client ─────────────────────────
// This prevents the hydration mismatch. localStorage is loaded in useEffect.
function getDefaultState(): AppState {
  const employees = generateEmployees();
  return {
    currentUser: null,
    users: USERS,
    employees,
    departments: DEPARTMENTS,
    attendance: generateAttendance(employees),
    leaveRequests: generateLeaveRequests(employees),
    payroll: generatePayroll(employees),
    notifications: NOTIFICATIONS,
    darkMode: false,
    sidebarOpen: true,
    hydrated: false,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getDefaultState);

  // ── Hydrate from localStorage after first client render ──────────────────
  useEffect(() => {
    const saved = loadState();
    // localStorage is client-only, so hydration must happen after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(prev => {
      const employees = saved.employees ?? prev.employees;
      return {
        ...prev,
        currentUser:   saved.currentUser   ?? null,
        employees,
        attendance:    saved.attendance    ?? prev.attendance,
        leaveRequests: saved.leaveRequests ?? prev.leaveRequests,
        payroll:       saved.payroll       ?? prev.payroll,
        notifications: saved.notifications ?? prev.notifications,
        darkMode:      saved.darkMode      ?? false,
        hydrated: true,
      };
    });
  }, []);

  // ── Persist to localStorage whenever relevant state changes ──────────────
  useEffect(() => {
    if (!state.hydrated) return; // don't overwrite saved data with defaults
    saveState({
      currentUser:   state.currentUser,
      employees:     state.employees,
      attendance:    state.attendance,
      leaveRequests: state.leaveRequests,
      payroll:       state.payroll,
      notifications: state.notifications,
      darkMode:      state.darkMode,
    });
  }, [
    state.hydrated,
    state.currentUser,
    state.employees,
    state.attendance,
    state.leaveRequests,
    state.payroll,
    state.notifications,
    state.darkMode,
  ]);

  // ── Sync dark-mode class on <html> ───────────────────────────────────────
  useEffect(() => {
    if (state.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state.darkMode]);

  const set = (updater: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) =>
    setState(prev => ({ ...prev, ...(typeof updater === 'function' ? updater(prev) : updater) }));

  const actions: AppActions = {
    login: (email, password) => {
      const user = USERS.find(u => u.email === email && u.password === password);
      if (user) { set({ currentUser: user }); return true; }
      return false;
    },
    logout: () => set({ currentUser: null }),

    addEmployee: (emp) => set(prev => ({
      employees: [...prev.employees, { ...emp, id: `emp_${Date.now()}` }],
    })),
    updateEmployee: (id, data) => set(prev => ({
      employees: prev.employees.map(e => e.id === id ? { ...e, ...data } : e),
    })),
    deleteEmployee: (id) => set(prev => ({
      employees: prev.employees.filter(e => e.id !== id),
    })),

    markAttendance: (empId, status) => set(prev => {
      const today = new Date().toISOString().split('T')[0];
      const exists = prev.attendance.find(a => a.employeeId === empId && a.date === today);
      if (exists) {
        return { attendance: prev.attendance.map(a => a.employeeId === empId && a.date === today ? { ...a, status } : a) };
      }
      return {
        attendance: [...prev.attendance, {
          id: `att_${Date.now()}`, employeeId: empId, date: today,
          checkIn: new Date().toTimeString().slice(0, 5), checkOut: null,
          status, overtimeHours: 0,
        }],
      };
    }),

    applyLeave: (req) => set(prev => ({
      leaveRequests: [...prev.leaveRequests, { ...req, id: `lv_${Date.now()}` }],
    })),
    updateLeaveStatus: (id, status) => set(prev => ({
      leaveRequests: prev.leaveRequests.map(l => l.id === id ? { ...l, status } : l),
    })),

    generatePayrollForMonth: (month) => set(prev => {
      const newRecords = prev.employees.filter(e => e.status === 'active').map(emp => {
        const basic = emp.basicSalary / 12;
        const gross = basic * 1.05;
        const deductions = gross * 0.23;
        return {
          id: `pay_${emp.id}_${month}_${Date.now()}`,
          employeeId: emp.id, month,
          basicSalary: Math.round(basic), overtimePay: 0, bonus: 0,
          allowances: Math.round(basic * 0.05), incentives: 0,
          taxDeduction: Math.round(gross * 0.12),
          epfDeduction: Math.round(gross * 0.08),
          etfDeduction: Math.round(gross * 0.03),
          loanDeduction: 0, penalties: 0,
          grossSalary: Math.round(gross),
          totalDeductions: Math.round(deductions),
          netSalary: Math.round(gross - deductions),
          status: 'draft' as const,
        };
      });
      return { payroll: [...prev.payroll.filter(p => p.month !== month), ...newRecords] };
    }),
    approvePayroll: (id) => set(prev => ({
      payroll: prev.payroll.map(p => p.id === id ? { ...p, status: 'approved' } : p),
    })),
    markPayrollPaid: (id) => set(prev => ({
      payroll: prev.payroll.map(p => p.id === id
        ? { ...p, status: 'paid', paymentDate: new Date().toISOString().split('T')[0] }
        : p),
    })),

    addNotification: (n) => set(prev => ({
      notifications: [{ ...n, id: `notif_${Date.now()}` }, ...prev.notifications],
    })),
    markNotificationRead: (id) => set(prev => ({
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    })),

    toggleDarkMode: () => set(prev => ({ darkMode: !prev.darkMode })),
    toggleSidebar: () => set(prev => ({ sidebarOpen: !prev.sidebarOpen })),
    setSidebarOpen: (open) => {
      setState(prev => prev.sidebarOpen === open ? prev : { ...prev, sidebarOpen: open });
    },
  };

  return createElement(StoreContext.Provider, { value: { ...state, ...actions } }, children);
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
