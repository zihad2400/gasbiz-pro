export const instant = false;

import { Suspense } from 'react';
import { getCustomers } from '@/actions/customers';
import CustomerTable from './CustomerTable';
import { Users } from 'lucide-react';

async function CustomersLoader() {
  const customers = await getCustomers();
  return <CustomerTable initialCustomers={customers} />;
}

export default function CustomersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <Users className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm text-slate-400">View all registered customers</p>
        </div>
      </div>

      <Suspense fallback={
        <div className="bg-surface-800 border border-surface-700 rounded-2xl p-12 text-center text-slate-400 animate-pulse">
          Loading customers...
        </div>
      }>
        <CustomersLoader />
      </Suspense>
    </div>
  );
}
