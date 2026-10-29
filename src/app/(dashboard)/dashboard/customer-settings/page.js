export const instant = false;

import { getCurrentUser } from '@/lib/auth/session';
import { Settings } from 'lucide-react';
import DangerZone from './DangerZone';
import SettingsForm from './SettingsForm'; // আমরা আগের সেটিংস ফর্মটি আলাদা করব

export default async function CustomerSettingsPage() {
  const user = await getCurrentUser();

  const safeUser = {
    name: user.name,
    email: user.email,
    address: user.address || '',
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl"><Settings className="w-6 h-6 text-brand-500" /></div>
        <div><h1 className="text-2xl font-bold text-white">Account Settings</h1><p className="text-sm text-slate-400">Manage your preferences</p></div>
      </div>

      {/* সাধারণ সেটিংস */}
      <SettingsForm user={safeUser} />

      {/* Danger Zone (Account Delete) */}
      <DangerZone />
    </div>
  );
}
