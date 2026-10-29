'use client';

import Link from 'next/link';
import { FileText, Printer } from 'lucide-react';

export default function SalesTable({ initialSales }) {
  return (
    <div className="bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden shadow-sm">
      {initialSales.length === 0 ? (
        <div className="p-8 md:p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <FileText className="w-10 h-10 md:w-12 md:h-12 text-slate-600" />
          <p className="text-sm md:text-base">No sales yet. Sales will appear automatically when orders are delivered.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] md:min-w-full">
            <thead className="bg-surface-900/50 text-slate-400 text-xs md:text-sm">
              <tr>
                <th className="px-4 md:px-6 py-3 font-medium">Invoice / Date</th>
                <th className="px-4 md:px-6 py-3 font-medium">Customer</th>
                <th className="px-4 md:px-6 py-3 font-medium">Product</th>
                <th className="px-4 md:px-6 py-3 font-medium">Qty</th>
                <th className="px-4 md:px-6 py-3 font-medium text-right">Total (৳)</th>
                <th className="px-4 md:px-6 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              {initialSales.map((sale) => (
                <tr key={sale._id} className="hover:bg-surface-700/50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="text-slate-200 font-medium text-sm md:text-base">{sale.invoiceNo}</div>
                    <div className="text-[10px] md:text-xs text-slate-500">{new Date(sale.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="text-slate-200 text-sm md:text-base">{sale.customerName}</div>
                    <div className="text-[10px] md:text-xs text-slate-500">{sale.customerPhone || 'Walk-in'}</div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm md:text-base">
                    {sale.items.map(i => i.name).join(', ')}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm md:text-base">
                    {sale.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-right text-green-400 font-bold text-sm md:text-base">
                    ৳{sale.totalAmount}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                    <Link 
                      href={`/invoice/${sale._id}`} 
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 bg-surface-700 hover:bg-surface-600 text-brand-400 text-xs md:text-sm font-medium rounded-lg transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" /> Print
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
