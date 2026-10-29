export const instant = false;

import { Suspense } from 'react';
import { getAllSales } from '@/actions/sales';
import SalesTable from './SalesTable';
import { ShoppingCart } from 'lucide-react';

async function SalesLoader() {
  const sales = await getAllSales();
  return <SalesTable initialSales={sales} />;
}

export default function SalesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <ShoppingCart className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Sales History</h1>
          <p className="text-sm text-slate-400">All completed sales and deliveries</p>
        </div>
      </div>

      <Suspense fallback={
        <div className="bg-surface-800 border border-surface-700 rounded-2xl p-12 text-center text-slate-400 animate-pulse">
          Loading sales data...
        </div>
      }>
        <SalesLoader />
      </Suspense>
    </div>
  );
}
