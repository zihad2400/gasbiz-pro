export const instant = false;

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';

async function RedirectLogic() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }

  return null; // redirect will never reach here
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <Suspense fallback={
        <div className="text-slate-400 animate-pulse">Loading...</div>
      }>
        <RedirectLogic />
      </Suspense>
    </div>
  );
}
