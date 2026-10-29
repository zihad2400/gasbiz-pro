export const instant = false;

import { Suspense } from 'react';
import { getShopProducts } from '@/actions/customer';
import ProductGrid from './ProductGrid';
import { Flame, ShieldCheck, Truck, Sparkles } from 'lucide-react';

async function ShopContent() {
  const products = await getShopProducts();
  return <ProductGrid products={products} />;
}

export default function ShopPage() {
  return (
    <div className="w-full space-y-6 md:space-y-8">
      
      {/* Premium Hero Banner */}
      <div className="bg-gradient-to-br from-brand-900 via-surface-800 to-surface-900 rounded-2xl md:rounded-3xl p-5 md:p-12 border border-surface-700 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs md:text-sm font-medium mb-4 md:mb-6 border border-brand-500/30">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> Premium Gas Delivery
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4 leading-tight">
            Order LPG Cylinders <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Online</span>
          </h1>
          <p className="text-sm md:text-lg text-slate-300 mb-6 md:mb-8 leading-relaxed max-w-md">Fast, safe, and reliable gas supply for your home and business. Delivered straight to your doorstep.</p>
          
          <div className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 md:gap-2 bg-surface-800/50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-surface-700"><Truck className="w-4 h-4 md:w-5 md:h-5 text-brand-500"/> Fast Delivery</span>
            <span className="flex items-center gap-1.5 md:gap-2 bg-surface-800/50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-surface-700"><ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-green-500"/> 100% Safe</span>
          </div>
        </div>
        
        {/* Background Flame */}
        <div className="absolute right-[-5%] top-[-10%] h-[120%] w-1/2 opacity-20 pointer-events-none flex items-center justify-center transform rotate-12 hidden sm:flex">
          <Flame className="w-96 h-96 text-brand-500 blur-[2px]" />
        </div>
      </div>

      {/* Product Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">Available Products</h2>
          <span className="text-xs md:text-sm text-slate-400 hidden sm:block">Showing all active products</span>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-64 md:h-80 bg-surface-800 rounded-2xl animate-pulse border border-surface-700"></div>)}
          </div>
        }>
          <ShopContent />
        </Suspense>
      </div>
    </div>
  );
}
