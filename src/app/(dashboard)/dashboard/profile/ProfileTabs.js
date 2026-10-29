'use client';

import { useState, useActionState, useEffect } from 'react';
import { updateProfile, changePassword } from '@/actions/customer-account';
import { useToast } from '@/components/ui/ToastProvider';
import { User, Shield, Package, Loader2, Save, Key } from 'lucide-react';

export default function ProfileTabs({ user, orders }) {
  const [activeTab, setActiveTab] = useState('info');
  
  const [profileState, profileAction, isProfilePending] = useActionState(updateProfile, null);
  const [passwordState, passwordAction, isPasswordPending] = useActionState(changePassword, null);
  const { addToast } = useToast();

  useEffect(() => {
    if (profileState?.error) addToast(profileState.error, 'error');
    if (profileState?.success) addToast(profileState.success, 'success');
    if (passwordState?.error) addToast(passwordState.error, 'error');
    if (passwordState?.success) addToast(passwordState.success, 'success');
  }, [profileState, passwordState, addToast]);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-surface-800 border border-surface-700 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 shadow-sm">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-500/20 rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold text-brand-500 shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-sm text-slate-400">{user.email}</p>
          <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 bg-brand-500/10 text-brand-500 rounded-full capitalize">{user.role}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-surface-700 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'info' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <User className="w-4 h-4" /> Personal Info
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'security' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Shield className="w-4 h-4" /> Security
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'orders' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Package className="w-4 h-4" /> My Orders
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-surface-800 border border-surface-700 rounded-2xl p-4 md:p-6 shadow-sm">
        
        {activeTab === 'info' && (
          <form action={profileAction} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input type="text" name="name" defaultValue={user.name} required className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
              <input type="text" name="phone" defaultValue={user.phone || ''} placeholder="017XXXXXXXX" className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Default Delivery Address</label>
              <textarea name="address" rows="2" defaultValue={user.address || ''} placeholder="House, Road, Area" className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none resize-none"></textarea>
            </div>
            <button type="submit" disabled={isProfilePending} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg disabled:opacity-50">
              {isProfilePending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Update Profile
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form action={passwordAction} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Password</label>
              <input type="password" name="oldPassword" required className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
              <input type="password" name="newPassword" required min="6" className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" />
              <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
            </div>
            <button type="submit" disabled={isPasswordPending} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg disabled:opacity-50">
              {isPasswordPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />} Change Password
            </button>
          </form>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-slate-400 text-sm">No orders yet.</p>
            ) : (
              orders.map(o => (
                <div key={o._id} className="flex justify-between items-center p-3 md:p-4 bg-surface-900 border border-surface-700 rounded-xl">
                  <div>
                    <p className="text-sm md:text-base text-white font-medium">{o.productName}</p>
                    <p className="text-[10px] md:text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString()} | ৳{o.totalAmount}</p>
                  </div>
                  <span className="text-[10px] md:text-xs font-medium px-2 py-1 bg-surface-800 text-slate-300 rounded capitalize border border-surface-700">{o.status}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
