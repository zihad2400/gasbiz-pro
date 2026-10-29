export const instant = false;

import { Suspense } from 'react';
import { getAllUsers } from '@/actions/users';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import UserList from './UserList';
import { UserCog } from 'lucide-react';

async function UsersLoader() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'owner') redirect('/dashboard');

  const users = await getAllUsers();
  return <UserList initialUsers={users} currentUserId={currentUser._id.toString()} />;
}

export default function UsersPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl"><UserCog className="w-6 h-6 text-brand-500" /></div>
        <div><h1 className="text-2xl font-bold text-white">System Users</h1><p className="text-sm text-slate-400">Manage all registered accounts</p></div>
      </div>

      <Suspense fallback={<div className="text-slate-400">Loading users...</div>}>
        <UsersLoader />
      </Suspense>
    </div>
  );
}
