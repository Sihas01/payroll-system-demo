'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { clsx } from 'clsx';

export default function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { sidebarOpen, darkMode, hydrated, setSidebarOpen } = useStore();
  const syncedMobileSidebarRef = useRef(false);

  useEffect(() => {
    if (!hydrated || syncedMobileSidebarRef.current) return;
    syncedMobileSidebarRef.current = true;

    if (window.matchMedia('(max-width: 767px)').matches) {
      setSidebarOpen(false);
    }
  }, [hydrated, setSidebarOpen]);

  // ── Before localStorage has been read, render a shell that matches the
  //    server-side output exactly.  This prevents the hydration mismatch.
  if (!hydrated) {
    return (
      <div className={clsx('min-h-screen', darkMode ? 'bg-[#0e1117]' : 'bg-[#f0f2f8]')}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 animate-pulse" />
            <div className={clsx('text-sm font-medium', darkMode ? 'text-white/40' : 'text-slate-400')}>
              Loading…
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('min-h-screen overflow-x-hidden', darkMode ? 'dark' : '')}>
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm md:hidden"
        />
      )}
      <Sidebar />
      <div
        className={clsx(
          'min-h-screen flex flex-col transition-all duration-300 min-w-0',
          sidebarOpen ? 'md:ml-[260px]' : 'md:ml-[72px]'
        )}
      >
        <Topbar title={title} />
        <main className={clsx('flex-1 w-full max-w-full p-4 sm:p-5 lg:p-6', darkMode ? 'text-white' : 'text-slate-800')}>
          {children}
        </main>
      </div>
    </div>
  );
}
