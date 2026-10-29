export const instant = false;

import { Suspense } from 'react';
import { getNotifications } from '@/actions/notifications';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

async function NotificationsList() {
  const notifications = await getNotifications();

  return (
    <div className="bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden shadow-sm">
      {notifications.length === 0 ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <Bell className="w-12 h-12 text-slate-600" />
          <p>You have no notifications.</p>
        </div>
      ) : (
        <div className="divide-y divide-surface-700">
          {notifications.map(n => (
            <NotificationItem key={n._id} notification={n} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <Bell className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-slate-400">All your recent alerts and updates</p>
        </div>
      </div>

      <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
        <NotificationsList />
      </Suspense>
    </div>
  );
}
