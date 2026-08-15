'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootAdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian-950 text-gold-400">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
        <p className="font-serif text-sm tracking-widest uppercase text-gold-300">
          Entering The Bling Haven Admin Portal...
        </p>
      </div>
    </div>
  );
}
