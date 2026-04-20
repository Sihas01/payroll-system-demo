'use client';
import { useStore } from '@/lib/store';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ title, children, onClose, size = 'md' }: Props) {
  const { darkMode } = useStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const maxW = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={clsx('modal-box w-full', maxW[size], darkMode && 'dark')}>
        <div className={clsx('flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-white/10' : 'border-slate-100')}>
          <h3 className={clsx('font-bold text-base', darkMode ? 'text-white' : 'text-slate-800')}>{title}</h3>
          <button onClick={onClose} className={clsx('p-1.5 rounded-lg transition-colors', darkMode ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400')}>
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
