export const instant = false;
import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';

export default async function ReportsPage() {
  await connection();
  const db = await getDb();
  
  // Total Sales
  const salesAgg = await db.collection(COLLECTIONS.SALES).aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]).toArray();
  const totalSales = salesAgg[0]?.total || 0;

  // Total Expenses
  const expAgg = await db.collection(COLLECTIONS.EXPENSES).aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]).toArray();
  const totalExpenses = expAgg[0]?.total || 0;

  const netProfit = totalSales - totalExpenses;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl"><BarChart3 className="w-6 h-6 text-brand-500" /></div>
        <div><h1 className="text-2xl font-bold text-white">Business Reports</h1><p className="text-sm text-slate-400">Overall financial summary</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface-800 p-6 rounded-2xl border border-surface-700">
          <div className="flex items-center gap-3 mb-2"><TrendingUp className="w-5 h-5 text-green-500" /><p className="text-sm text-slate-400">Total Sales</p></div>
          <p className="text-3xl font-bold text-white">৳ {totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-surface-800 p-6 rounded-2xl border border-surface-700">
          <div className="flex items-center gap-3 mb-2"><DollarSign className="w-5 h-5 text-red-500" /><p className="text-sm text-slate-400">Total Expenses</p></div>
          <p className="text-3xl font-bold text-white">৳ {totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-surface-800 p-6 rounded-2xl border border-surface-700">
          <div className="flex items-center gap-3 mb-2"><BarChart3 className="w-5 h-5 text-brand-500" /><p className="text-sm text-slate-400">Net Profit</p></div>
          <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>৳ {netProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-surface-800 border border-surface-700 rounded-2xl p-12 text-center text-slate-400">
        <Package className="w-12 h-12 mx-auto mb-4 text-slate-600" />
        <p>Advanced reports (Monthly, Annual) will be added in the next phase.</p>
      </div>
    </div>
  );
}
