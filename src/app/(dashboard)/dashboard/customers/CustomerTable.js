'use client';

import { Users } from 'lucide-react';

export default function CustomerTable({ initialCustomers }) {
  return (
    <div className="bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden shadow-sm">
      {initialCustomers.length === 0 ? (
        <div className="p-8 md:p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <Users className="w-10 h-10 md:w-12 md:h-12 text-slate-600" />
          <p className="text-sm md:text-base">No customers registered yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px] md:min-w-full">
            <thead className="bg-surface-900/50 text-slate-400 text-xs md:text-sm">
              <tr>
                <th className="px-4 md:px-6 py-3 font-medium">Customer Name</th>
                <th className="px-4 md:px-6 py-3 font-medium">Email</th>
                <th className="px-4 md:px-6 py-3 font-medium">Total Orders</th>
                <th className="px-4 md:px-6 py-3 font-medium text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              {initialCustomers.map((c) => (
                <tr key={c._id} className="hover:bg-surface-700/50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4 text-slate-200 font-medium text-sm md:text-base">{c.name}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-xs md:text-sm">{c.email}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm md:text-base">{c.totalOrders}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-right text-green-400 font-medium text-sm md:text-base">
                    ৳{c.totalSpent}
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
