'use client';

import { useActionState, useEffect, useState } from 'react';
import { deleteAccount } from '@/actions/customer-account';
import { useToast } from '@/components/ui/ToastProvider';
import { AlertTriangle, Loader2, X } from 'lucide-react';

export default function DangerZone() {
  const [state, formAction, isPending] = useActionState(deleteAccount, null);
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (state?.error) addToast(state.error, 'error');
  }, [state, addToast]);

  return (
    <>
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h2>
        <p className="text-sm text-slate-400 mb-4">Once you delete your account, there is no going back. All your data (orders, profile) will be permanently removed.</p>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-800 border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="bg-red-500/10 p-5 flex justify-between items-start border-b border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-full"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
                <h2 className="text-xl font-bold text-white">Delete Account</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form action={formAction} className="p-5 space-y-4">
              <p className="text-sm text-slate-300">Are you absolutely sure? This action cannot be undone. Please type <strong className="text-white">DELETE</strong> and enter your password to confirm.</p>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirmation Word</label>
                <input type="text" name="confirmText" required placeholder="Type DELETE" className="w-full px-3 py-2 text-sm bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-red-500 text-slate-200 outline-none transition" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Current Password</label>
                <input type="password" name="password" required className="w-full px-3 py-2 text-sm bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-red-500 text-slate-200 outline-none transition" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-surface-700 hover:bg-surface-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-1 flex justify-center items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Permanently'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
