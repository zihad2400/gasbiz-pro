'use client';

import { useActionState, useEffect, useState } from 'react';
import { addProduct } from '@/actions/products';
import { useToast } from '@/components/ui/ToastProvider';
import { Package, Plus, Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const [state, formAction, isPending] = useActionState(addProduct, null);
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (state?.error) addToast(state.error, 'error');
    if (state?.success) {
      addToast(state.success, 'success');
      setShowForm(false); // Hide form on success
    }
  }, [state, addToast]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 rounded-xl">
            <Package className="w-6 h-6 text-brand-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-sm text-slate-400">Manage your inventory items</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-5 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" /> {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Product</h2>
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Product Name *</label>
                <input type="text" name="name" required placeholder="e.g. 12kg LPG Cylinder"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">SKU / Code *</label>
                <input type="text" name="sku" required placeholder="e.g. CYL-12KG"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                <input type="text" name="category" placeholder="e.g. Cylinder, Refill"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Purchase Price (৳)</label>
                <input type="number" name="purchasePrice" required min="0" step="0.01"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Selling Price (৳)</label>
                <input type="number" name="sellingPrice" required min="0" step="0.01"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Initial Stock</label>
              <input type="number" name="stock" min="0" defaultValue="0"
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
            </div>

            <div className="pt-4 border-t border-surface-700 flex justify-end">
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg transition-all disabled:opacity-50">
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isPending ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List (Placeholder for now) */}
      <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 shadow-sm text-center text-slate-400">
        Product list will appear here. Add a product to see it in the database!
      </div>
    </div>
  );
}
