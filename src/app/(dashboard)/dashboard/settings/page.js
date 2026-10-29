export const instant = false;

import { Suspense } from 'react';
import { getBusinessSettings } from '@/actions/settings';
import SettingsForm from './SettingsForm';

async function SettingsLoader() {
  const settings = await getBusinessSettings();
  return <SettingsForm initialSettings={settings} />;
}

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Suspense fallback={<div className="text-slate-400">Loading settings...</div>}>
        <SettingsLoader />
      </Suspense>
    </div>
  );
}
