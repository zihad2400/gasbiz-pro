'use client';
import { useActionState, useEffect, useState } from 'react';
import { addExpense } from '@/actions/expenses';
import { useToast } from '@/components/ui/ToastProvider';
import { DollarSign, Plus, Loader2, X } from 'lucide-react';

export default function ExpenseList({ initialExpenses }) {
  const [state, formAction, isPending] = useActionState(addExpense, null);
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
          <div className="p-3 bg-brand-500/10 rounded-xl"><DollarSign className="w-6 h-6 text-brand-500" /></div>
          <div><h1 className="text-2xl font-bold text-white">Expenses</h1><p className="text-sm text-slate-400">Track your business expenses</p></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-5 rounded-lg transition-all">
          {showForm ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> Add Expense</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 shadow-sm">
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm text-slate-300 mb-1.5">Expense Title *</label><input type="text" name="title" required placeholder="e.g. Shop Rent" className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" /></div>
              <div><label className="block text-sm text-slate-300 mb-1.5">Amount (৳) *</label><input type="number" name="amount" required min="1" className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" /></div>
              <div><label className="block text-sm text-slate-300 mb-1.5">Category</label><input type="text" name="category" placeholder="e.g. Utility" className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg text-slate-200 outline-none" /></div>
            </div>
            <div className="flex justify-end"><button type="submit" disabled={isPending} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg disabled:opacity-50">{isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Expense'}</button></div>
          </form>
        </div>
      )}

      <div className="bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden shadow-sm">
        {initialExpenses.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No expenses recorded yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-surface-900/50 text-slate-400 text-sm"><tr><th className="px-6 py-3 font-medium">Title</th><th className="px-6 py-3 font-medium">Category</th><th className="px-6 py-3 font-medium">Date</th><th className="px-6 py-3 font-medium text-right">Amount</th></tr></thead>
            <tbody className="divide-y divide-surface-700">
              {initialExpenses.map(e => (
                <tr key={e._id} className="hover:bg-surface-700/50">
                  <td className="px-6 py-4 text-slate-200 font-medium">{e.title}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{e.category || 'General'}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right text-red-400 font-medium">৳{e.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
