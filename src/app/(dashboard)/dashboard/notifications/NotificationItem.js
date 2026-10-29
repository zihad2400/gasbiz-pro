'use client';

import { useState } from 'react';
import Link from 'next/link';
import { markSingleAsRead, markSingleAsUnread } from '@/actions/notifications';
import { Check, Circle, ArrowRight } from 'lucide-react';

export default function NotificationItem({ notification: initial }) {
  const [notif, setNotif] = useState(initial);

  const toggleRead = async () => {
    setNotif({ ...notif, read: !notif.read });
    if (notif.read) {
      await markSingleAsUnread(notif._id);
    } else {
      await markSingleAsRead(notif._id);
    }
  };

  return (
    <div className={`p-4 hover:bg-surface-700/30 transition-colors group flex items-start gap-4 ${!notif.read ? 'bg-brand-500/5' : ''}`}>
      <div className={`w-2.5 h-2.5 mt-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-brand-500 shadow-[0_0_8px_rgba(37,99,235,0.8)]' : 'bg-surface-600'}`}></div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`text-base ${!notif.read ? 'text-white font-semibold' : 'text-slate-300 font-medium'}`}>{notif.title}</h3>
          {!notif.read && <span className="text-[10px] px-1.5 py-0.5 bg-brand-500/20 text-brand-400 rounded">New</span>}
        </div>
        <p className="text-sm text-slate-400 mt-1">{notif.message}</p>
        <p className="text-xs text-slate-500 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-2">
        {notif.link && (
          <Link href={notif.link} className="p-2 text-slate-400 hover:text-brand-400 hover:bg-surface-800 rounded-lg transition-colors">
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
        <button 
          onClick={toggleRead}
          className="p-2 text-slate-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
          title={notif.read ? "Mark as unread" : "Mark as read"}
        >
          {notif.read ? <Circle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
