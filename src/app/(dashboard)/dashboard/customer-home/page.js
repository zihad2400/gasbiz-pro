export const instant = false;

import { getCurrentUser } from '@/lib/auth/session';
import { getMyOrders } from '@/actions/customer';
import { ShoppingBag, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function CustomerHomePage() {
  const user = await getCurrentUser();
  const orders = await getMyOrders();
  
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-brand-900 to-surface-800 rounded-2xl p-6 border border-surface-700">
        <h2 className="text-2xl font-bold text-white mb-2">Hello, {user.name}! 👋</h2>
        <p className="text-slate-300">Welcome to your customer dashboard. Ready to order some gas?</p>
        <Link href="/dashboard/shop" className="inline-flex items-center gap-2 mt-4 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2 px-5 rounded-lg transition-colors">
          Go to Shop <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-800 p-5 rounded-2xl border border-surface-700">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-5 h-5 text-brand-500" />
            <p className="text-sm font-medium text-slate-400">Total Orders</p>
          </div>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
        </div>
        <div className="bg-surface-800 p-5 rounded-2xl border border-surface-700">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <p className="text-sm font-medium text-slate-400">Pending</p>
          </div>
          <p className="text-2xl font-bold text-white">{pendingOrders}</p>
        </div>
        <div className="bg-surface-800 p-5 rounded-2xl border border-surface-700">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm font-medium text-slate-400">Delivered</p>
          </div>
          <p className="text-2xl font-bold text-white">{deliveredOrders}</p>
        </div>
      </div>
    </div>
  );
}
