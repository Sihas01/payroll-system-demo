import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import LandingRevealObserver from '@/components/LandingRevealObserver';
import {
  ArrowRight,
  ArrowDown,
  BarChart3,
  Briefcase,
  Building2,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock,
  FileCheck2,
  Play,
  Sparkles,
  Users,
  WalletCards,
  Workflow,
} from 'lucide-react';

const NAV_ITEMS = [
  ['Product', '#product'],
  ['Workflow', '#workflow'],
  ['Pricing', '#pricing'],
  ['Demo', '#demo'],
];

const PRODUCT_CONNECTIONS: { icon: LucideIcon; title: string; detail: string; metric: string }[] = [
  { icon: Users, title: 'Employees', detail: 'Profiles and roles', metric: '51' },
  { icon: CalendarCheck, title: 'Leave', detail: 'Requests and balances', metric: '30' },
  { icon: Clock, title: 'Attendance', detail: 'Daily exceptions', metric: '22h' },
  { icon: Check, title: 'Approvals', detail: 'Pending actions', metric: '8' },
  { icon: WalletCards, title: 'Payroll runs', detail: 'Salary cycles', metric: '$270K' },
  { icon: FileCheck2, title: 'Payslips', detail: 'Ready documents', metric: '51' },
  { icon: BarChart3, title: 'Reports', detail: 'Workforce insight', metric: '12' },
];

const UNORGANIZED_ITEMS: { icon: LucideIcon; title: string; detail: string; className: string }[] = [
  { icon: Users, title: 'Employee list.xlsx', detail: 'Outdated rows', className: 'sm:-rotate-2' },
  { icon: CalendarCheck, title: 'Leave forms', detail: 'Waiting for review', className: 'sm:rotate-1' },
  { icon: Clock, title: 'Attendance sheet', detail: 'Missing entries', className: 'sm:rotate-2' },
  { icon: WalletCards, title: 'Payroll notes', detail: 'Separate approvals', className: 'sm:-rotate-1' },
];

const FLOW: { step: string; title: string; body: string; mobileBody: string; icon: LucideIcon }[] = [
  {
    step: '01',
    title: 'Organize',
    body: 'Your employee, leave, attendance, and payroll data sits in a shared structure HR and finance can trust.',
    mobileBody: 'Keep employee, leave, attendance, and payroll data together.',
    icon: Building2,
  },
  {
    step: '02',
    title: 'Process',
    body: 'Teams review changes, resolve exceptions, approve leave, and prepare payroll with fewer manual handoffs.',
    mobileBody: 'Review changes, approvals, and payroll actions faster.',
    icon: Workflow,
  },
  {
    step: '03',
    title: 'Report',
    body: 'Leaders see payroll cost, employee status, requests, and trends without waiting for spreadsheet updates.',
    mobileBody: 'See payroll cost, employee status, and trends clearly.',
    icon: FileCheck2,
  },
];

const PROBLEM_SOLVERS = [
  ['Reduce manual mistakes', 'Replace repeated spreadsheet entry with structured payroll, employee, leave, and attendance records.', 'Replace spreadsheet repetition with structured records.'],
  ['Speed up approvals', 'Make pending leave and payroll actions visible so HR can move work forward with confidence.', 'Keep leave and payroll actions easy to review.'],
  ['Improve accountability', 'Keep statuses, dates, departments, and transaction context attached to the records that matter.', 'Keep status and department context attached.'],
];

const BENEFITS = [
  ['One source of truth', 'HR, finance, and leadership can work from the same operational data.', 'One shared data source for every team.'],
  ['Cleaner month-end', 'Payroll preparation becomes a review process instead of a last-minute reconstruction.', 'Turn payroll closing into a review flow.'],
  ['Better workforce visibility', 'Leave, attendance, departments, employees, and payroll trends are easier to understand.', 'Understand people, leave, and payroll trends faster.'],
  ['Demo-ready adoption', 'Clients can access the working platform quickly and see the system in context.', 'Open the demo and review the workflow quickly.'],
];

const PRICING_STRUCTURE = [
  'Priced per employee, per month',
  'Tailored based on company size and payroll complexity',
  'No hidden fees or surprise charges',
];

const PRICING_INCLUDES = [
  'Automated payroll processing',
  'Payslip generation and distribution',
  'Tax and statutory calculations',
  'Attendance and leave integration',
  'Secure data handling',
];

function HeroDashboardImage() {
  return (
    <>
      <div className="landing-reveal landing-delay-5 mx-auto mt-10 w-full px-4 sm:hidden">
        <div className="relative mx-auto w-[304px] rounded-[3rem] bg-slate-950 p-[7px]">
          <span className="absolute -left-[3px] top-24 h-12 w-[3px] rounded-l bg-slate-800" aria-hidden="true" />
          <span className="absolute -left-[3px] top-40 h-10 w-[3px] rounded-l bg-slate-800" aria-hidden="true" />
          <span className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r bg-slate-800" aria-hidden="true" />
          <div className="overflow-hidden rounded-[2.55rem] bg-[#f5f7fb]">
            <div className="relative flex h-11 items-center justify-between bg-white px-7 pt-1 text-[12px] font-bold text-slate-950">
              <span>11:59 AM</span>
              <span className="absolute left-1/2 top-2 flex h-[22px] w-[78px] -translate-x-1/2 items-center justify-end rounded-full bg-slate-950 pr-2" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-slate-700" />
              </span>
              <div className="flex items-center gap-1.5 text-slate-950" aria-hidden="true">
                <span className="flex h-[11px] items-end gap-0.5">
                  <span className="h-[5px] w-[3px] rounded-sm bg-slate-950" />
                  <span className="h-[7px] w-[3px] rounded-sm bg-slate-950" />
                  <span className="h-[9px] w-[3px] rounded-sm bg-slate-950" />
                  <span className="h-[11px] w-[3px] rounded-sm bg-slate-950" />
                </span>
                <span className="flex items-center gap-[1.5px]">
                  <span className="flex h-[12px] w-[25px] items-center rounded-[4.5px] bg-slate-950 p-[2px]">
                    <span className="relative h-full flex-1 overflow-hidden rounded-[3px] bg-white">
                      <span className="absolute inset-y-0 left-0 w-[65%] rounded-l-[2px] bg-slate-950" />
                    </span>
                  </span>
                  <span className="h-[6px] w-[2px] rounded-r-[2px] bg-slate-950" />
                </span>
              </div>
            </div>
            <Image
              src="/iphone-14-plus-dashboard.png"
              alt="PayrollPro mobile dashboard shown inside an iPhone 14 Plus frame"
              width={822}
              height={1693}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>

      <div className="landing-reveal landing-delay-5 mx-auto mt-14 hidden w-full max-w-6xl px-4 sm:block">
        <div className="rounded-[1.4rem] border border-slate-200/80 bg-white p-2 shadow-[0_30px_80px_rgba(76,69,132,0.14)]">
          <Image
            src="/dashboard-white-new.png"
            alt="PayrollPro dashboard showing payroll KPIs, charts, department split, quick actions, and recent activity"
            width={1920}
            height={945}
            priority
            className="h-auto w-full rounded-[1rem] border border-slate-100"
          />
        </div>
      </div>
    </>
  );
}

export default function LandingPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white text-slate-950">
      <LandingRevealObserver />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[14vw] -top-[18vh] h-[56vh] w-[56vw] rounded-[45%_55%_62%_38%/44%_42%_58%_56%] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.22)_0%,rgba(124,58,237,0.13)_34%,rgba(124,58,237,0.045)_56%,transparent_76%)] blur-3xl" />
        <div className="absolute -bottom-[20vh] -right-[14vw] h-[60vh] w-[56vw] rounded-[58%_42%_48%_52%/52%_46%_54%_48%] bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.2)_0%,rgba(124,58,237,0.12)_36%,rgba(124,58,237,0.042)_58%,transparent_78%)] blur-3xl" />
      </div>
      <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="landing-reveal flex items-center gap-2.5" aria-label="PayrollPro home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
              <Briefcase size={16} />
            </span>
            <span className="text-sm font-bold tracking-tight">PayrollPro</span>
          </Link>
          <div className="landing-reveal landing-delay-1 hidden items-center gap-8 text-[13px] font-semibold text-slate-500 md:flex">
            {NAV_ITEMS.map(([label, href]) => (
              <a key={href} href={href} className="transition hover:text-violet-600">
                {label}
              </a>
            ))}
          </div>
          <Link href="/login" className="landing-reveal landing-delay-2 inline-flex min-h-9 items-center rounded-full bg-violet-600 px-4 text-[13px] font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5">
            Try demo
          </Link>
        </nav>
      </header>

      <section className="landing-reveal relative z-10 overflow-hidden bg-white pb-2 pt-20 sm:pb-20 sm:pt-24">
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="landing-reveal mx-auto mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">
            <Sparkles size={13} />
            Payroll clarity for growing teams
          </div>
          <h1 className="landing-reveal landing-delay-1 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Effortless precision for modern payroll
          </h1>
          <p className="landing-reveal landing-delay-2 mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            PayrollPro brings employee records, attendance, leave approvals, salary runs, payslips, and reporting into one calm system built for HR and finance teams.
          </p>
          <div className="landing-reveal landing-delay-3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#product" className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-600">
              Explore system
            </a>
            <Link href="/login" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-bold text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5">
              Run demo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <HeroDashboardImage />
      </section>

      <section id="product" className="landing-reveal relative z-10 bg-white pb-2 pt-16 sm:bg-transparent sm:pb-6 sm:pt-24">
        <div className="mx-auto grid max-w-5xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="landing-reveal order-1 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">What this system is</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              A single operating layer for payroll and HR decisions.
            </h2>
            <p className="mx-auto mt-6 text-[15px] leading-7 text-slate-600 sm:mx-0 sm:leading-8">
              <span className="sm:hidden">
                PayrollPro brings employee records, leave, attendance, approvals, payroll runs, payslips, and reports into one connected workspace for HR and finance teams.
              </span>
              <span className="hidden sm:inline">
                PayrollPro brings employee records, leave management, attendance tracking, approvals, payroll runs, payslips, and reports into one connected workspace. Instead of moving between separate files and scattered tools, HR and finance teams can understand what is ready, what needs attention, and how each action affects the organization&apos;s payroll process.
              </span>
            </p>
          </div>

          <div className="landing-reveal landing-delay-2 order-2 mx-auto h-[238px] w-[300px] max-w-full overflow-hidden sm:h-auto sm:w-full sm:overflow-visible">
            <div className="relative w-[620px] max-w-none scale-[0.48] origin-top-left sm:mx-auto sm:w-auto sm:max-w-[620px] sm:scale-100">
              <div className="absolute -right-5 top-16 hidden h-28 w-28 rounded-full border border-violet-100 sm:block" />
              <div className="absolute -bottom-4 left-8 hidden h-20 w-44 rounded-full border border-violet-100 sm:block" />

              <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white/95 shadow-[0_28px_80px_rgba(76,69,132,0.13)] backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
                      <Briefcase size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-950">PayrollPro workspace</p>
                      <p className="text-[11px] font-semibold text-slate-400">Organization-wide operations</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
                    Live sync
                  </span>
                </div>

                <div className="grid grid-cols-[58px_1fr]">
                  <div className="border-r border-slate-100 bg-slate-50/80 py-4">
                    <div className="flex flex-col items-center gap-2.5">
                      {PRODUCT_CONNECTIONS.map(({ icon: Icon, title }, index) => (
                        <span
                          key={title}
                          className={`landing-reveal landing-delay-${(index % 5) + 1} flex h-10 w-10 items-center justify-center rounded-xl ${
                            index === 4 ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white text-slate-500 shadow-sm'
                          }`}
                          aria-label={title}
                        >
                          <Icon size={17} />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-3 gap-3">
                      {PRODUCT_CONNECTIONS.slice(0, 3).map(({ icon: Icon, title, metric }, index) => (
                        <div key={title} className={`landing-reveal landing-delay-${index + 1} rounded-2xl border border-slate-100 bg-white p-3 shadow-sm`}>
                          <div className="flex items-center justify-between">
                            <Icon size={15} className="text-violet-600" />
                            <span className="text-sm font-bold text-slate-950">{metric}</span>
                          </div>
                          <p className="mt-3 text-[11px] font-bold leading-4 text-slate-500">{title}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-[1.15fr_0.85fr] gap-4">
                      <div className="landing-reveal landing-delay-2 rounded-[1.35rem] bg-slate-950 p-4 text-white">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-200">Payroll run</p>
                            <h3 className="mt-2 text-2xl font-bold tracking-tight">$270K</h3>
                          </div>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white">
                            Ready
                          </span>
                        </div>
                        <div className="mt-6 flex h-24 items-end gap-2">
                          {[48, 62, 54, 72, 66, 88, 78, 94].map((height, index) => (
                            <span
                              key={index}
                              className="flex-1 rounded-t-lg bg-violet-400"
                              style={{ height: `${height}%`, opacity: 0.48 + index * 0.055 }}
                            />
                          ))}
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-2">
                          {[
                            ['Approvals', '8'],
                            ['Payslips', '51'],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-xl bg-white/10 px-3 py-2">
                              <p className="text-[10px] font-semibold text-slate-300">{label}</p>
                              <p className="mt-1 text-sm font-bold text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="landing-reveal landing-delay-3 rounded-[1.35rem] border border-slate-100 bg-white p-4 shadow-sm">
                        <p className="text-xs font-bold text-slate-950">Today in HR</p>
                        <div className="mt-4 space-y-3">
                          {PRODUCT_CONNECTIONS.slice(3).map(({ icon: Icon, title, detail, metric }) => (
                            <div key={title} className="flex items-center gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                <Icon size={15} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="truncate text-[11px] font-bold text-slate-950">{title}</p>
                                  <span className="text-[11px] font-bold text-violet-600">{metric}</span>
                                </div>
                                <p className="truncate text-[10px] font-semibold text-slate-400">{detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="landing-reveal relative z-10 bg-transparent pb-2 pt-16 sm:pb-24 sm:pt-6">
        <div className="landing-reveal mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">The flow of precision</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Every section answers the next operational question.
          </h2>
          <div className="mt-7 grid gap-4 sm:mt-12 md:grid-cols-3">
            {FLOW.map(({ step, title, body, mobileBody, icon: Icon }) => (
              <div key={step} className="landing-reveal rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-[0_20px_60px_rgba(76,69,132,0.05)] sm:text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.2em] text-violet-600">{step}</span>
                  <Icon size={21} className="text-violet-500" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  <span className="sm:hidden">{mobileBody}</span>
                  <span className="hidden sm:inline">{body}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-reveal relative z-10 bg-transparent pb-2 pt-16 sm:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="landing-reveal order-1 text-center sm:text-left lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">From chaos to clarity</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              How this applies to your organization
            </h2>
            <p className="mx-auto mt-5 text-[15px] leading-8 text-slate-600 sm:mx-0">
              <span className="sm:hidden">
                Give HR, finance, and leaders one clear operational view.
              </span>
              <span className="hidden sm:inline">
                Whether your team is small or scaling, the system gives each department the same foundation. HR owns employee and leave operations. Finance sees payroll readiness. Leaders get workforce and cost visibility in one place.
              </span>
            </p>
            <div className="mt-7 space-y-4">
              {PROBLEM_SOLVERS.map(([title, body, mobileBody]) => (
                <div key={title} className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                  <Check className="mt-1 shrink-0 text-violet-600" size={18} />
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      <span className="sm:hidden">{mobileBody}</span>
                      <span className="hidden sm:inline">{body}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-reveal landing-delay-2 order-2 mx-auto h-[400px] w-[302px] max-w-full overflow-hidden sm:h-auto sm:w-full sm:overflow-visible lg:order-1">
            <div className="relative w-[520px] max-w-none scale-[0.58] origin-top-left rounded-[1.6rem] border border-slate-100 bg-white/95 p-5 shadow-[0_28px_80px_rgba(76,69,132,0.12)] backdrop-blur-sm sm:mx-auto sm:w-auto sm:max-w-[520px] sm:scale-100">
              <div className="rounded-[1.2rem] border border-slate-100 bg-slate-50/80 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Unorganized system</span>
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-500">Manual</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {UNORGANIZED_ITEMS.map(({ icon: Icon, title, detail, className }, index) => (
                    <div
                      key={title}
                      className={`landing-reveal landing-delay-${index + 1} rounded-2xl border border-slate-200 bg-white p-3 shadow-sm ${className}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <Icon size={15} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-bold text-slate-900">{title}</p>
                          <p className="truncate text-[10px] font-semibold text-slate-400">{detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center py-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-600 shadow-[0_12px_30px_rgba(124,58,237,0.14)]">
                  <ArrowDown size={19} />
                </span>
              </div>

              <div className="rounded-[1.2rem] bg-white p-5 shadow-[0_20px_60px_rgba(76,69,132,0.08)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                        <Briefcase size={15} />
                      </span>
                      <span className="text-sm font-bold text-slate-950">Organized in PayrollPro</span>
                    </div>
                    <div className="ml-10 mt-1 h-2 w-24 rounded-full bg-violet-100" />
                  </div>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-600">Resolved</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Leave approvals', 82],
                    ['Payroll review', 91],
                    ['Attendance logs', 68],
                    ['Payslip release', 74],
                  ].map(([label, height]) => (
                    <div key={label as string} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="text-[11px] font-bold text-slate-500">{label}</div>
                      <div className="mt-4 flex h-16 items-end gap-2">
                        {[0.55, 0.78, 0.45, 1].map((scale, index) => (
                          <span
                            key={index}
                            className="flex-1 rounded-t-md bg-violet-500"
                            style={{ height: `${Number(height) * scale}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-reveal relative z-10 bg-transparent pb-2 pt-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="landing-reveal mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">Benefits</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              A system that gives the organization a clearer payroll rhythm.
            </h2>
          </div>
          <div className="mt-7 grid gap-x-10 gap-y-8 sm:mt-12 sm:grid-cols-2">
            {BENEFITS.map(([title, body, mobileBody]) => (
              <div key={title} className="landing-reveal border-t border-violet-100 pt-6 text-center first:border-t-0 first:pt-0 sm:first:border-t sm:first:pt-6 sm:text-left">
                <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  <span className="sm:hidden">{mobileBody}</span>
                  <span className="hidden sm:inline">{body}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="landing-reveal relative z-10 bg-transparent pb-2 pt-16 sm:py-24">
        <div className="landing-reveal mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">Payment plans</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Pricing that scales with your business
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            <span className="sm:hidden">
              Flexible pricing based on team size, payroll complexity, and automation needs.
            </span>
            <span className="hidden sm:inline">
              Payroll is not one-size-fits-all. Our pricing reflects your team size, complexity, and the level of automation you need, so you only pay for what actually delivers value.
            </span>
          </p>
          <div className="mx-auto mt-7 max-w-4xl sm:mt-12">
            <div className="landing-reveal rounded-2xl border border-violet-200 bg-white p-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.05)] ring-4 ring-violet-50 sm:p-8 sm:text-left">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">
                    Custom quote
                  </span>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Flexible, transparent structure</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    <span className="sm:hidden">
                      Adapt pricing as your team and payroll needs grow.
                    </span>
                    <span className="hidden sm:inline">
                      Whether you are managing a small team or scaling operations, the system adapts with you without forcing your organization into rigid plans.
                    </span>
                  </p>
                  <div className="mt-6 rounded-2xl bg-violet-50/70 p-5">
                    <p className="text-sm font-bold text-slate-950">Get your custom quote</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      <span className="sm:hidden">
                        We review your workflow and provide a tailored quote.
                      </span>
                      <span className="hidden sm:inline">
                        Every business is different. We will walk you through the platform, understand your workflow, and provide a clear, tailored pricing plan.
                      </span>
                    </p>
                    <Link href="/login" className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5">
                      Book a Demo <ChevronRight size={16} />
                    </Link>
                  </div>
                  <p className="mt-4 text-xs leading-6 text-slate-500">
                    Most teams are priced on a per-employee basis, depending on features and scale.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm">
                    <h4 className="text-sm font-bold text-slate-950">Pricing structure</h4>
                    <ul className="mt-5 space-y-3">
                      {PRICING_STRUCTURE.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-600">
                          <Check size={16} className="mt-1 shrink-0 text-violet-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm">
                    <h4 className="text-sm font-bold text-slate-950">What is included</h4>
                    <ul className="mt-5 space-y-3">
                      {PRICING_INCLUDES.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-600">
                          <Check size={16} className="mt-1 shrink-0 text-violet-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="landing-reveal relative z-10 bg-transparent px-4 pb-20 pt-16 sm:px-6 sm:pt-0">
        <div className="landing-reveal mx-auto max-w-5xl rounded-[1.4rem] bg-[#d8d3e6] px-6 py-14 text-center sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">Experience the flow</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Access the demo platform and review the complete payroll workflow.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-700">
            <span className="sm:hidden">
              Explore sample employees, leave, payroll, payslips, and reports.
            </span>
            <span className="hidden sm:inline">
              The demo includes sample employees, departments, leave requests, payroll records, payslips, reports, attendance data, and notifications.
            </span>
          </p>
          <Link href="/login" className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-violet-700 px-6 text-sm font-bold text-white shadow-xl shadow-violet-700/20 transition hover:-translate-y-0.5">
            Try demo <Play size={15} />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-100 bg-white/85 py-8 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-[13px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="font-bold text-slate-950">PayrollPro</div>
          <div className="flex flex-wrap gap-5">
            {NAV_ITEMS.map(([label, href]) => (
              <a key={href} href={href} className="hover:text-violet-600">
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
