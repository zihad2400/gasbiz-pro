'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/actions/orders';
import { useToast } from '@/components/ui/ToastProvider';
import { Phone, MessageCircle } from 'lucide-react';

export default function OrderTable({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const { addToast } = useToast();

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.error) {
      addToast(result.error, 'error');
    } else {
      addToast(result.success, 'success');
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const getStatusColor = (status) => {
    return status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
           status === 'processing' ? 'bg-blue-500/10 text-blue-400' :
           status === 'delivered' ? 'bg-green-500/10 text-green-400' :
           'bg-red-500/10 text-red-400';
  };

  if (orders.length === 0) {
    return <div className="bg-surface-800 border border-surface-700 rounded-2xl p-8 md:p-12 text-center text-slate-400 text-sm md:text-base">No orders yet.</div>;
  }

  return (
    <div className="bg-surface-800 md:bg-transparent border border-surface-700 md:border-none rounded-2xl md:rounded-none overflow-hidden shadow-sm md:shadow-none">
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-surface-800 border border-surface-700 rounded-2xl shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-surface-900/50 text-slate-400 text-sm">
            <tr>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Qty</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-surface-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-slate-200 font-medium">{order.customerName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-400">{order.customerPhone}</span>
                    {order.customerPhone && (
                      <>
                        <a href={`tel:${order.customerPhone}`} className="p-1 text-blue-400 hover:bg-blue-500/20 rounded-md transition"><Phone className="w-3.5 h-3.5" /></a>
                        <a href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-1 text-green-400 hover:bg-green-500/20 rounded-md transition"><MessageCircle className="w-3.5 h-3.5" /></a>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-200">{order.productName}</td>
                <td className="px-6 py-4 text-slate-400">{order.quantity}</td>
                <td className="px-6 py-4 text-slate-200 font-medium">৳{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="bg-surface-900 border border-surface-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none">
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-surface-700">
        {orders.map((order) => (
          <div key={order._id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white font-medium">{order.customerName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400">{order.customerPhone}</span>
                  {order.customerPhone && (
                    <>
                      <a href={`tel:${order.customerPhone}`} className="p-1 text-blue-400 bg-blue-500/10 rounded"><Phone className="w-3 h-3" /></a>
                      <a href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-1 text-green-400 bg-green-500/10 rounded"><MessageCircle className="w-3 h-3" /></a>
                    </>
                  )}
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
            </div>
            
            <div className="bg-surface-900 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-300 font-medium">{order.productName}</p>
                <p className="text-xs text-slate-500">Qty: {order.quantity}</p>
              </div>
              <p className="text-brand-400 font-bold">৳{order.totalAmount}</p>
            </div>

            <select 
              value={order.status} 
              onChange={(e) => handleStatusChange(order._id, e.target.value)} 
              className="w-full bg-surface-900 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
