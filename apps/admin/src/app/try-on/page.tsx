'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TryOnAdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/catalog');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 font-mono text-xs">
      <span>Redirecting to Catalog...</span>
    </div>
  );
}
