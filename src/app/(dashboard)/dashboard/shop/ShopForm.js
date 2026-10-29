'use client';

import { useActionState, useEffect } from 'react';
import { placeOrder } from '@/actions/orders';
import { useToast } from '@/components/ui/ToastProvider';
import { Loader2, ShoppingCart } from 'lucide-react';

export default function ShopForm({ products }) {
  const [state, formAction, isPending] = useActionState(placeOrder, null);
  const { addToast } = useToast();

  useEffect(() => {
    if (state?.error) addToast(state.error, 'error');
    if (state?.success) addToast(state.success, 'success');
  }, [state, addToast]);

  return (
    <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 shadow-sm">
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number *</label>
            <input type="text" name="phone" required placeholder="017XXXXXXXX"
              className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Delivery Address *</label>
            <input type="text" name="address" required placeholder="House, Road, Area"
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

        <div className="pt-4 border-t border-surface-700 flex justify-end">
          <button type="submit" disabled={isPending}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg transition-all disabled:opacity-50">
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
            {isPending ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
