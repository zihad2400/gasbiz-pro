export const instant = false;

import { Tag, Sparkles } from 'lucide-react';

export default function OffersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <Tag className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Offers & Deals</h1>
          <p className="text-sm text-slate-400">Check out our latest promotions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-brand-900 to-surface-800 p-6 rounded-2xl border border-surface-700">
          <Sparkles className="w-8 h-8 text-brand-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Free Delivery</h3>
          <p className="text-sm text-slate-300">Get free delivery on orders over ৳ 2000.</p>
        </div>
        <div className="bg-gradient-to-br from-surface-800 to-surface-900 p-6 rounded-2xl border border-surface-700">
          <Sparkles className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Bulk Discount</h3>
          <p className="text-sm text-slate-300">Order 5+ cylinders and get 5% off.</p>
        </div>
      </div>
    </div>
  );
}
