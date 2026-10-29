export const instant = false;

import { getMyOrders } from '@/actions/customer';
import { MapPin, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

export default async function TrackOrderPage() {
  const orders = await getMyOrders();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <MapPin className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Track Order</h1>
          <p className="text-sm text-slate-400">See the live status of your orders</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center p-12 bg-surface-800 rounded-2xl border border-surface-700 text-slate-400">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-surface-800 border border-surface-700 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{order.productName}</h3>
                <p className="text-sm text-slate-400">Qty: {order.quantity} | Total: ৳{order.totalAmount}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm self-start md:self-center ${
                order.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                order.status === 'processing' ? 'bg-blue-500/10 text-blue-400' :
                order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {order.status === 'pending' && <Clock className="w-4 h-4" />}
                {order.status === 'processing' && <Package className="w-4 h-4" />}
                {order.status === 'delivered' && <CheckCircle className="w-4 h-4" />}
                {order.status === 'cancelled' && <XCircle className="w-4 h-4" />}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
