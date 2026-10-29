'use client';

import { useActionState, useEffect, useState } from 'react';
import { addProduct, deleteProduct } from '@/actions/products';
import { useToast } from '@/components/ui/ToastProvider';
import { Package, Plus, Loader2, X, Trash2, Search } from 'lucide-react';

export default function ProductList({ initialProducts }) {
  const [state, formAction, isPending] = useActionState(addProduct, null);
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (state?.error) addToast(state.error, 'error');
    if (state?.success) {
      addToast(state.success, 'success');
      setShowForm(false);
      setTimeout(() => window.location.reload(), 1000); 
    }
  }, [state, addToast]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setDeletingId(id);
    const res = await deleteProduct(id);
    setDeletingId(null);

    if (res.error) {
      addToast(res.error, 'error');
    } else {
      addToast(res.success, 'success');
      setProducts(products.filter(p => p._id !== id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 rounded-xl">
            <Package className="w-6 h-6 text-brand-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-sm text-slate-400">Manage your inventory items</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none"
            />
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-5 rounded-lg transition-all whitespace-nowrap"
          >
            {showForm ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> Add Product</>}
          </button>
        </div>
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
                <input type="text" name="category" placeholder="e.g. Cylinder"
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

      {/* Product List Table */}
      <div className="bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-900/50 text-slate-400 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Product Name</th>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Selling Price</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-surface-700/50 transition-colors">
                    <td className="px-6 py-4 text-slate-200 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{product.sku}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{product.category}</td>
                    <td className="px-6 py-4 text-slate-200 font-medium">৳ {product.sellingPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock === 0 ? 'bg-red-500/10 text-red-400' : 
                        product.stock <= 10 ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Product"
                      >
                        {deletingId === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
