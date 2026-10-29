export const instant = false;

import { Suspense } from 'react';
import { getMyOrders } from '@/actions/customer';
import { Package, Clock, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

async function MyOrdersList() {
  const orders = await getMyOrders();

  if (orders.length === 0) {
    return (
      <div className="text-center p-8 md:p-12 bg-surface-800 rounded-2xl border border-surface-700">
        <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 mx-auto text-slate-600 mb-4" />
        <h3 className="text-lg md:text-xl font-bold text-white mb-2">No orders yet</h3>
        <p className="text-sm md:text-base text-slate-400 mb-6">You haven't placed any orders. Start shopping now!</p>
        <Link href="/dashboard/shop" className="bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors inline-block text-sm md:text-base">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="bg-surface-800 border border-surface-700 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-surface-600 transition-colors">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-surface-900 rounded-xl hidden sm:block">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-brand-500" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white">{order.productName}</h3>
              <p className="text-xs md:text-sm text-slate-400 mt-1">Quantity: {order.quantity} | Total: <span className="text-white font-medium">৳{order.totalAmount}</span></p>
              <p className="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-2">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium text-xs md:text-sm self-start md:self-center ${
            order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
            order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
            'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {order.status === 'pending' && <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            {order.status === 'processing' && <Package className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            {order.status === 'delivered' && <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            {order.status === 'cancelled' && <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            <span className="capitalize">{order.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <div className="w-full space-y-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">My Orders</h1>
        <p className="text-sm md:text-base text-slate-400 mt-1 md:mt-2">Track your gas cylinder orders and delivery status.</p>
      </div>

      <Suspense fallback={
        <div className="space-y-4">
          {[1,2].map(i => <div key={i} className="h-28 md:h-32 bg-surface-800 rounded-2xl animate-pulse border border-surface-700"></div>)}
        </div>
      }>
        <MyOrdersList />
      </Suspense>
    </div>
  );
}
