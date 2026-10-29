export const instant = false;

import { Suspense } from 'react';
import { getAllOrders } from '@/actions/orders';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import OrderTable from './OrderTable';

async function OrdersLoader() {
  const user = await getCurrentUser();
  if (!user || !['owner', 'manager'].includes(user.role)) {
    redirect('/dashboard/shop');
  }

  const orders = await getAllOrders();
  return <OrderTable initialOrders={orders} />;
}

export default function OrdersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
          <p className="text-sm text-slate-400">View and update customer orders</p>
        </div>
      </div>

      <Suspense fallback={<div className="text-slate-400">Loading orders...</div>}>
        <OrdersLoader />
      </Suspense>
    </div>
  );
}
