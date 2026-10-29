'use client';

import { useActionState, useEffect } from 'react';
import { updateProfile } from '@/actions/customer-account';
import { useToast } from '@/components/ui/ToastProvider';
import { Bell, MapPin, Save, Loader2 } from 'lucide-react';

export default function SettingsForm({ user }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);
  const { addToast } = useToast();

  useEffect(() => {
    if (state?.error) addToast(state.error, 'error');
    if (state?.success) addToast(state.success, 'success');
  }, [state, addToast]);

  return (
    <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Notifications */}
      <div className="flex items-center justify-between border-b border-surface-700 pb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-white font-medium">Order Notifications</p>
            <p className="text-xs text-slate-500">Get SMS updates when your order is delivered</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
        </label>
      </div>

      {/* Default Address */}
      <form action={formAction} className="space-y-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-white font-medium">Default Delivery Address</p>
              <p className="text-xs text-slate-500">This address will be auto-filled when you order</p>
            </div>
          </div>
          <input type="hidden" name="name" value={user.name} />
          <textarea name="address" rows="2" defaultValue={user.address} placeholder="House, Road, Area" 
            className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none resize-none"></textarea>
        </div>

        <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg disabled:opacity-50">
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Settings
        </button>
      </form>
    </div>
  );
}
