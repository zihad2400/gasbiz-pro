export const instant = false;
import { Suspense } from 'react';
import { getSuppliers } from '@/actions/suppliers';
import SupplierList from './SupplierList';

async function SuppliersLoader() {
  const suppliers = await getSuppliers();
  return <SupplierList initialSuppliers={suppliers} />;
}

export default function SuppliersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Suspense fallback={<div className="text-slate-400">Loading suppliers...</div>}>
        <SuppliersLoader />
      </Suspense>
    </div>
  );
}
