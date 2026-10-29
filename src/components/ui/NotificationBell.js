'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, Check, Circle, CheckCheck } from 'lucide-react';
import { markAllAsRead, markSingleAsRead, markSingleAsUnread } from '@/actions/notifications';
import { useToast } from '@/components/ui/ToastProvider';

export default function NotificationBell({ initialNotifications }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { addToast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    await markAllAsRead();
    addToast('All notifications marked as read', 'success');
  };

  const toggleReadStatus = async (id, currentStatus) => {
    // অপ্টিমিস্টিক আপডেট
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: !currentStatus } : n));
    
    if (currentStatus) {
      await markSingleAsUnread(id);
    } else {
      await markSingleAsRead(id);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell Icon with Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${isOpen ? 'bg-surface-700 text-white' : 'text-slate-400 hover:text-white hover:bg-surface-700'}`}
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-wiggle' : ''}`} />
        
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-surface-800 shadow-[0_0_8px_rgba(239,68,68,0.6)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface-800 border border-surface-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          
          {/* Header */}
          <div className="p-3 border-b border-surface-700 flex justify-between items-center bg-surface-900/50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>
          
          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
                <Bell className="w-8 h-8 text-slate-600" />
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id}
                  className={`relative p-4 border-b border-surface-700/50 hover:bg-surface-700/30 transition-colors group ${!n.read ? 'bg-brand-500/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread Indicator */}
                    <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-brand-500 shadow-[0_0_6px_rgba(37,99,235,0.8)]' : 'bg-transparent'}`}></div>
                    
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={n.link || '#'} 
                        onClick={() => setIsOpen(false)}
                        className="block"
                      >
                        <p className={`text-sm ${!n.read ? 'text-white font-semibold' : 'text-slate-300 font-medium'}`}>{n.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1.5">{formatTime(n.createdAt)}</p>
                      </Link>
                    </div>

                    {/* Mark Read/Unread Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleReadStatus(n._id, n.read);
                      }}
                      className="p-1.5 text-slate-500 hover:text-brand-400 hover:bg-surface-800 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                      title={n.read ? "Mark as unread" : "Mark as read"}
                    >
                      {n.read ? <Circle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-surface-700 bg-surface-900/50 text-center">
            <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)} className="text-xs text-slate-400 hover:text-white font-medium">
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
