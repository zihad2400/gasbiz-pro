'use client';

import { useState, useActionState, useEffect } from 'react';
import { placeOrder } from '@/actions/orders';
import { useToast } from '@/components/ui/ToastProvider';
import { ShoppingCart, Loader2, PackageCheck, X, ShieldCheck } from 'lucide-react';

export default function ProductGrid({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [state, formAction, isPending] = useActionState(placeOrder, null);
  const { addToast } = useToast();

  useEffect(() => {
    if (state?.error) addToast(state.error, 'error');
    if (state?.success) {
      addToast(state.success, 'success');
      setSelectedProduct(null);
      setQuantity(1);
    }
  }, [state, addToast]);

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.sellingPrice * quantity;
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-surface-800 rounded-2xl border border-surface-700 text-slate-400">
            <PackageCheck className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-lg">No products available right now.</p>
            <p className="text-sm mt-1">Please check back later.</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="bg-surface-800 border border-surface-700 rounded-xl overflow-hidden hover:border-brand-500/50 hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all duration-300 group flex flex-col relative">
              
              {/* Compact Product Image Placeholder */}
              <div className="h-32 bg-gradient-to-br from-surface-700 to-surface-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors"></div>
                <ShoppingCart className="w-10 h-10 text-slate-600 group-hover:text-brand-500 transition-colors duration-300" />
                
                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
                    product.stock > 20 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                    product.stock > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {product.stock > 0 ? `${product.stock} left` : 'Out'}
                  </span>
                </div>
              </div>
              
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-brand-500 font-bold tracking-wider uppercase mb-0.5">{product.category || 'General'}</p>
                  <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">{product.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">SKU: {product.sku}</p>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-white">৳ {product.sellingPrice}</span>
                  </div>
                  <button 
                    onClick={() => {
                      if(product.stock <= 0) {
                        addToast('Out of stock.', 'error');
                        return;
                      }
                      setSelectedProduct(product);
                    }}
                    disabled={product.stock <= 0}
                    className={`w-full font-semibold text-xs py-2 rounded-lg transition-all ${
                      product.stock > 0 
                        ? 'bg-brand-600 hover:bg-brand-500 text-white' 
                        : 'bg-surface-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Premium Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-800 border border-surface-700 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="bg-surface-900 p-5 flex justify-between items-start border-b border-surface-700">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
                <p className="text-brand-500 font-bold text-base mt-1">৳ {selectedProduct.sellingPrice} <span className="text-xs text-slate-400 font-normal">/ unit</span></p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-1.5 bg-surface-800 hover:bg-surface-700 rounded-full text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form action={formAction} className="p-5 space-y-4">
              <input type="hidden" name="productId" value={selectedProduct._id} />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone Number *</label>
                  <input type="text" name="phone" required placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 text-sm bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Quantity *</label>
                  <input 
                    type="number" 
                    name="quantity" 
                    required 
                    min="1" 
                    max={selectedProduct.stock} 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Delivery Address *</label>
                <textarea name="address" required rows="2" placeholder="House, Road, Area"
                  className="w-full px-3 py-2 text-sm bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none transition resize-none"></textarea>
              </div>

              <div className="bg-surface-900 p-3 rounded-lg border border-surface-700 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="text-[10px] text-brand-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Cash on Delivery</p>
                </div>
                <p className="text-lg font-bold text-white">৳ {calculateTotal()}</p>
              </div>

              <div className="pt-1 flex gap-2">
                <button type="button" onClick={() => setSelectedProduct(null)} className="flex-1 bg-surface-700 hover:bg-surface-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-1 flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
