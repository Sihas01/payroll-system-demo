'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function Home() {
  const { currentUser, hydrated } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (!hydrated) return;
    router.push(currentUser ? '/dashboard' : '/login');
  }, [currentUser, hydrated, router]);
  return null;
}
