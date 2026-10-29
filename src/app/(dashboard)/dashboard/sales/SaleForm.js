'use client';

import { useActionState, useEffect, useState } from 'react';
import { createSale } from '@/actions/sales';
import { useToast } from '@/components/ui/ToastProvider';
import { Plus, Loader2 } from 'lucide-react';

export default function SaleForm({ products }) {
  const [state, formAction, isPending] = useActionState(createSale, null);
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (state?.error) addToast(state.error, 'error');
    if (state?.success) {
      addToast(state.success, 'success');
      setShowForm(false);
    }
  }, [state, addToast]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-5 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" /> {showForm ? 'Cancel' : 'New Sale'}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-semibold text-white mb-4">Create New Sale</h2>
          
          {products.length === 0 ? (
            <div className="p-4 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20">
              No products in stock. Please <a href="/dashboard/products" className="underline font-bold">add a product</a> first.
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Customer Name</label>
                  <input type="text" name="customerName" placeholder="Walk-in Customer"
                    className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone (Optional)</label>
                  <input type="text" name="customerPhone" placeholder="017XXXXXXXX"
                    className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Select Product *</label>
                  <select name="productId" required className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none">
                    <option value="">-- Choose a product --</option>
                    {products.map((p) => (
                      <option key={p._id.toString()} value={p._id.toString()}>
                        {p.name} - ৳{p.sellingPrice} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Quantity *</label>
                  <input type="number" name="quantity" required min="1" defaultValue="1"
                    className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Payment Method</label>
                <select name="paymentMethod" className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none">
                  <option value="Cash">Cash</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>

              <div className="pt-4 border-t border-surface-700 flex justify-end">
                <button type="submit" disabled={isPending}
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg transition-all disabled:opacity-50">
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isPending ? 'Processing...' : 'Complete Sale'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
