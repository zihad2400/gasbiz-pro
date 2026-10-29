'use client';
import { useActionState, useEffect, useState } from 'react';
import { addSupplier } from '@/actions/suppliers';
import { useToast } from '@/components/ui/ToastProvider';
import { Store, Plus, Loader2, X } from 'lucide-react';

export default function SupplierList({ initialSuppliers }) {
  const [state, formAction, isPending] = useActionState(addSupplier, null);
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (state?.error) addToast(state.error, 'error');
    if (state?.success) { addToast(state.success, 'success'); setShowForm(false); setTimeout(() => window.location.reload(), 1000); }
  }, [state, addToast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 rounded-xl"><Store className="w-6 h-6 text-brand-500" /></div>
          <div><h1 className="text-2xl font-bold text-white">Suppliers</h1><p className="text-sm text-slate-400">Manage your suppliers</p></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-5 rounded-lg transition-all">
          {showForm ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> Add Supplier</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 shadow-sm">
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm text-slate-300 mb-1.5">Supplier Name *</label><input type="text" name="name" required className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" /></div>
              <div><label className="block text-sm text-slate-300 mb-1.5">Phone *</label><input type="text" name="phone" required className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" /></div>
            </div>
            <div><label className="block text-sm text-slate-300 mb-1.5">Address</label><input type="text" name="address" className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" /></div>
            <div className="flex justify-end"><button type="submit" disabled={isPending} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg disabled:opacity-50">{isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Supplier'}</button></div>
          </form>
        </div>
      )}

      <div className="bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden shadow-sm">
        {initialSuppliers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No suppliers yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-surface-900/50 text-slate-400 text-sm"><tr><th className="px-6 py-3 font-medium">Name</th><th className="px-6 py-3 font-medium">Phone</th><th className="px-6 py-3 font-medium">Address</th></tr></thead>
            <tbody className="divide-y divide-surface-700">
              {initialSuppliers.map(s => (
                <tr key={s._id} className="hover:bg-surface-700/50"><td className="px-6 py-4 text-slate-200 font-medium">{s.name}</td><td className="px-6 py-4 text-slate-400">{s.phone}</td><td className="px-6 py-4 text-slate-400 text-sm">{s.address || '-'}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
