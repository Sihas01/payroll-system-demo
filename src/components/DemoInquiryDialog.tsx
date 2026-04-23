'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AtSign, ChevronRight, Mail, MessageSquare, Phone, User, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const RECIPIENT_EMAIL = 'zeylun.team@gmil.com';

type InquiryForm = {
  name: string;
  mobile: string;
  email: string;
  description: string;
};

const initialForm: InquiryForm = {
  name: '',
  mobile: '',
  email: '',
  description: '',
};

export default function DemoInquiryDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<InquiryForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const updateField = (field: keyof InquiryForm, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setSubmitted(false);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submittedAt = new Date().toLocaleString();
    const subject = `PayrollPro demo inquiry - ${form.name}`;
    const body = [
      'New PayrollPro Demo Inquiry',
      '',
      `Name: ${form.name}`,
      `Mobile no: ${form.mobile}`,
      `Email: ${form.email}`,
      '',
      'Description:',
      form.description,
      '',
      'Inquiry context:',
      'Payment plans section - Book a Demo',
      '',
      `Submitted at: ${submittedAt}`,
    ].join('\n');

    window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
      >
        Book a Demo <ChevronRight size={16} />
      </button>

      {typeof document !== 'undefined' &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-inquiry-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeDialog();
            }}
          >
            <div className="max-h-[calc(100vh-1.5rem)] w-full max-w-[22rem] overflow-y-auto rounded-[1.15rem] border border-white/70 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.16)] sm:max-h-[calc(100vh-3rem)] sm:max-w-xl sm:rounded-[1.35rem] sm:shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">Demo inquiry</p>
                  <h3 id="demo-inquiry-title" className="mt-2 text-[2rem] font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-2xl sm:leading-tight">
                    Book a PayrollPro demo
                  </h3>
                  <p className="mt-2 text-[15px] leading-7 text-slate-600 sm:text-sm sm:leading-6">
                    Share your contact details and payroll needs. We will prepare a structured inquiry email for the team.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:text-violet-600"
                  aria-label="Close demo inquiry form"
                >
                  <X size={17} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-6 sm:py-6">
                <label className="block text-left">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <User size={15} className="text-violet-600" />
                    Name
                  </span>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Enter your name"
                    className="h-11 w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:h-12 sm:rounded-2xl"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-left">
                    <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Phone size={15} className="text-violet-600" />
                      Mobile no
                    </span>
                    <input
                      required
                      type="tel"
                    value={form.mobile}
                    onChange={(event) => updateField('mobile', event.target.value)}
                    placeholder="+94 77 123 4567"
                    className="h-11 w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:h-12 sm:rounded-2xl"
                  />
                </label>

                  <label className="block text-left">
                    <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <AtSign size={15} className="text-violet-600" />
                      Email
                    </span>
                    <input
                      required
                      type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="name@company.com"
                    className="h-11 w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:h-12 sm:rounded-2xl"
                  />
                </label>
              </div>

                <label className="block text-left">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <MessageSquare size={15} className="text-violet-600" />
                    Description
                  </span>
                  <textarea
                  required
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Tell us about your team size, payroll workflow, and what you want to review in the demo."
                  rows={4}
                  className="min-h-[108px] w-full resize-none rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:min-h-[140px] sm:rounded-2xl"
                />
              </label>

                {submitted && (
                  <div className="flex items-start gap-3 rounded-2xl bg-violet-50 px-4 py-3 text-left text-sm leading-6 text-slate-700">
                    <Mail size={17} className="mt-1 shrink-0 text-violet-600" />
                    Your email app should open with the inquiry prepared for {RECIPIENT_EMAIL}.
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-1 sm:gap-3 sm:pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:border-violet-200 hover:text-violet-600 sm:min-h-11"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 sm:min-h-11"
                  >
                    Send inquiry <Mail size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          ,
          document.body
        )}
    </>
  );
}
