'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TryOnPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/gallery');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian-950 text-gold-400 font-mono text-xs">
      <span>Redirecting to Interactive Jewellery Gallery...</span>
    </div>
  );
}
