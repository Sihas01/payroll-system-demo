
// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = 'admin';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave';
export type LeaveType = 'annual' | 'sick' | 'casual' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type PayrollStatus = 'draft' | 'approved' | 'paid';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  employeeId?: string;
}

export interface Department {
  id: string;
  name: string;
  headId: string;
  budget: number;
  employeeCount: number;
  color: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  nic: string;
  departmentId: string;
  designation: string;
  joinDate: string;
  employmentType: EmploymentType;
  bankName: string;
  bankAccount: string;
  basicSalary: number;
  status: EmployeeStatus;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  overtimeHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  basicSalary: number;
  overtimePay: number;
  bonus: number;
  allowances: number;
  incentives: number;
  taxDeduction: number;
  epfDeduction: number;
  etfDeduction: number;
  loanDeduction: number;
  penalties: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: PayrollStatus;
  paymentDate?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Morgan', email: 'admin@payroll.io', password: 'admin123', role: 'admin', employeeId: 'EMP001' },
];

export const DEPARTMENTS: Department[] = [
  { id: 'dept1', name: 'Engineering', headId: 'EMP003', budget: 450000, employeeCount: 15, color: '#6366f1' },
  { id: 'dept2', name: 'Human Resources', headId: 'EMP001', budget: 180000, employeeCount: 8, color: '#22d3ee' },
  { id: 'dept3', name: 'Finance', headId: 'EMP002', budget: 220000, employeeCount: 7, color: '#10b981' },
  { id: 'dept4', name: 'Marketing', headId: 'EMP015', budget: 160000, employeeCount: 9, color: '#f59e0b' },
  { id: 'dept5', name: 'Operations', headId: 'EMP020', budget: 280000, employeeCount: 8, color: '#ef4444' },
  { id: 'dept6', name: 'Sales', headId: 'EMP025', budget: 320000, employeeCount: 11, color: '#8b5cf6' },
];

const depts = ['dept1', 'dept2', 'dept3', 'dept4', 'dept5', 'dept6'];
const designations: Record<string, string[]> = {
  dept1: ['Senior Engineer', 'Junior Engineer', 'Tech Lead', 'DevOps Engineer', 'QA Engineer'],
  dept2: ['HR Specialist', 'Recruiter', 'Training Manager', 'Payroll Specialist'],
  dept3: ['Accountant', 'Financial Analyst', 'CFO', 'Budget Analyst'],
  dept4: ['Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Brand Designer'],
  dept5: ['Operations Manager', 'Logistics Coordinator', 'Supply Chain Analyst'],
  dept6: ['Sales Executive', 'Account Manager', 'Sales Director', 'BDM'],
};

const firstNames = ['James','Maria','Robert','Patricia','John','Jennifer','Michael','Linda','William','Barbara','David','Susan','Richard','Jessica','Joseph','Sarah','Thomas','Karen','Charles','Lisa','Christopher','Nancy','Daniel','Betty','Matthew','Margaret','Anthony','Sandra','Mark','Ashley','Donald','Dorothy','Steven','Kimberly','Paul','Emily','Andrew','Donna','Joshua','Michelle'];
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson'];

function randItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pad(n: number) { return String(n).padStart(2, '0'); }

export function generateEmployees(): Employee[] {
  const emps: Employee[] = [];
  for (let i = 1; i <= 58; i++) {
    const deptIdx = (i - 1) % 6;
    const deptId = depts[deptIdx];
    const desList = designations[deptId];
    emps.push({
      id: `emp${i}`,
      employeeId: `EMP${pad(i)}`,
      name: `${randItem(firstNames)} ${randItem(lastNames)}`,
      email: `emp${i}@payroll.io`,
      phone: `+1-${randInt(200,999)}-${randInt(200,999)}-${randInt(1000,9999)}`,
      address: `${randInt(100,999)} Main St, City ${i % 10}, State`,
      nic: `NIC${randInt(10000000,99999999)}`,
      departmentId: deptId,
      designation: randItem(desList),
      joinDate: `${randInt(2018,2024)}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
      employmentType: randItem(['full_time','part_time','contract','intern'] as EmploymentType[]),
      bankName: randItem(['Chase Bank','Bank of America','Wells Fargo','Citibank','TD Bank']),
      bankAccount: `${randInt(100000000,999999999)}`,
      basicSalary: randInt(35000, 120000),
      status: i % 10 === 0 ? 'inactive' : i % 15 === 0 ? 'on_leave' : 'active',
    });
  }
  return emps;
}

export function generateAttendance(employees: Employee[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  employees.slice(0,20).forEach(emp => {
    for (let d = 1; d <= 30; d++) {
      const date = new Date(today.getFullYear(), today.getMonth() - 1, d);
      const dow = date.getDay();
      if (dow === 0 || dow === 6) continue;
      const status: AttendanceStatus = Math.random() < 0.05 ? 'absent' : Math.random() < 0.1 ? 'late' : Math.random() < 0.05 ? 'half_day' : 'present';
      records.push({
        id: `att_${emp.id}_${d}`,
        employeeId: emp.id,
        date: `${today.getFullYear()}-${pad(today.getMonth())}-${pad(d)}`,
        checkIn: status === 'absent' ? null : status === 'late' ? `09:${pad(randInt(15,55))}` : `08:${pad(randInt(45,59))}`,
        checkOut: status === 'absent' ? null : `${randInt(17,19)}:${pad(randInt(0,59))}`,
        status,
        overtimeHours: Math.random() < 0.2 ? randInt(1,4) : 0,
      });
    }
  });
  return records;
}

export function generateLeaveRequests(employees: Employee[]): LeaveRequest[] {
  const reqs: LeaveRequest[] = [];
  employees.slice(0,30).forEach((emp, i) => {
    reqs.push({
      id: `lv${i+1}`,
      employeeId: emp.id,
      type: randItem(['annual','sick','casual','unpaid'] as LeaveType[]),
      startDate: `2025-${pad(randInt(1,12))}-${pad(randInt(1,20))}`,
      endDate: `2025-${pad(randInt(1,12))}-${pad(randInt(21,28))}`,
      reason: randItem(['Medical appointment','Family emergency','Personal matters','Vacation','Sick - fever','Annual holiday']),
      status: randItem(['pending','approved','rejected'] as LeaveStatus[]),
      appliedDate: `2025-${pad(randInt(1,12))}-${pad(randInt(1,15))}`,
    });
  });
  return reqs;
}

export function generatePayroll(employees: Employee[]): PayrollRecord[] {
  const records: PayrollRecord[] = [];
  const months = ['2025-01','2025-02','2025-03','2025-04','2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12'];
  employees.slice(0,20).forEach(emp => {
    months.forEach((month, mi) => {
      const basic = emp.basicSalary / 12;
      const overtime = randInt(0, 20) * (basic / 160);
      const bonus = mi % 6 === 5 ? basic * 0.1 : 0;
      const allowances = basic * 0.05;
      const incentives = Math.random() < 0.3 ? randInt(200,500) : 0;
      const gross = basic + overtime + bonus + allowances + incentives;
      const tax = gross * 0.12;
      const epf = gross * 0.08;
      const etf = gross * 0.03;
      const loan = Math.random() < 0.2 ? randInt(100,500) : 0;
      const penalties = Math.random() < 0.05 ? randInt(50,200) : 0;
      const totalDed = tax + epf + etf + loan + penalties;
      records.push({
        id: `pay_${emp.id}_${month}`,
        employeeId: emp.id,
        month,
        basicSalary: Math.round(basic),
        overtimePay: Math.round(overtime),
        bonus: Math.round(bonus),
        allowances: Math.round(allowances),
        incentives: Math.round(incentives),
        taxDeduction: Math.round(tax),
        epfDeduction: Math.round(epf),
        etfDeduction: Math.round(etf),
        loanDeduction: Math.round(loan),
        penalties: Math.round(penalties),
        grossSalary: Math.round(gross),
        totalDeductions: Math.round(totalDed),
        netSalary: Math.round(gross - totalDed),
        status: mi < 11 ? 'paid' : mi === 11 ? 'approved' : 'draft',
        paymentDate: mi < 11 ? `${month}-28` : undefined,
      });
    });
  });
  return records;
}

export const NOTIFICATIONS: Notification[] = [
  { id:'n1', userId:'u1', title:'Payroll Generated', message:'December 2025 payroll has been generated successfully.', type:'success', read:false, createdAt:'2025-12-01T09:00:00Z' },
  { id:'n2', userId:'u1', title:'Leave Request Pending', message:'5 leave requests are awaiting your approval.', type:'warning', read:false, createdAt:'2025-12-02T10:30:00Z' },
  { id:'n3', userId:'u1', title:'Salary Disbursed', message:'November salaries have been disbursed successfully.', type:'info', read:true, createdAt:'2025-11-28T14:00:00Z' },
  { id:'n4', userId:'u1', title:'New Employee Added', message:'Sarah Johnson has been added to the Engineering team.', type:'info', read:true, createdAt:'2025-11-25T11:00:00Z' },
  { id:'n5', userId:'u1', title:'Attendance Alert', message:'3 employees missed attendance this week.', type:'warning', read:false, createdAt:'2025-12-03T08:00:00Z' },
];

export const MONTHLY_PAYROLL_TREND = [
  { month: 'Jan', total: 284000, employees: 56 },
  { month: 'Feb', total: 291000, employees: 56 },
  { month: 'Mar', total: 302000, employees: 57 },
  { month: 'Apr', total: 298000, employees: 57 },
  { month: 'May', total: 315000, employees: 58 },
  { month: 'Jun', total: 322000, employees: 58 },
  { month: 'Jul', total: 318000, employees: 58 },
  { month: 'Aug', total: 335000, employees: 59 },
  { month: 'Sep', total: 341000, employees: 59 },
  { month: 'Oct', total: 328000, employees: 59 },
  { month: 'Nov', total: 349000, employees: 60 },
  { month: 'Dec', total: 362000, employees: 60 },
];

export const DEPT_PAYROLL = [
  { dept: 'Engineering', amount: 142000, percentage: 39 },
  { dept: 'Finance', amount: 68000, percentage: 19 },
  { dept: 'Sales', amount: 74000, percentage: 20 },
  { dept: 'Marketing', amount: 38000, percentage: 10 },
  { dept: 'HR', amount: 24000, percentage: 7 },
  { dept: 'Operations', amount: 18000, percentage: 5 },
];
