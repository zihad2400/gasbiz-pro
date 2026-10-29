import { Suspense } from 'react';
import { getDashboardStats } from '@/actions/dashboard';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const instant = false;

// ডেটা লোড করার কম্পোনেন্ট
async function DashboardStats() {
  const stats = await getDashboardStats();

  return (
    <>
      {/* Stats Grid: মোবাইলে ১ কলাম, ছোট ডিভাইসে ২ কলাম, বড়তে ৪ কলাম */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Today's Sales */}
        <div className="bg-surface-800 p-4 md:p-6 rounded-2xl border border-surface-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-slate-400 mb-1 truncate">Today's Sales</p>
              <h3 className="text-lg md:text-2xl font-bold text-white truncate" title={`৳ ${stats.todaySalesTotal.toLocaleString()}`}>
                ৳ {stats.todaySalesTotal.toLocaleString()}
              </h3>
            </div>
            <div className="p-1.5 md:p-2 bg-green-500/10 rounded-lg hidden sm:block shrink-0 ml-2">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-2 md:mt-4 flex items-center text-xs text-slate-500">
            <span>{stats.todaySalesCount} invoices today</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-surface-800 p-4 md:p-6 rounded-2xl border border-surface-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-slate-400 mb-1 truncate">Total Customers</p>
              <h3 className="text-lg md:text-2xl font-bold text-white truncate">{stats.totalCustomers}</h3>
            </div>
            <div className="p-1.5 md:p-2 bg-blue-500/10 rounded-lg hidden sm:block shrink-0 ml-2">
              <Users className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 md:mt-4 flex items-center text-xs text-slate-500">
            <span>Registered</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-surface-800 p-4 md:p-6 rounded-2xl border border-surface-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-slate-400 mb-1 truncate">Total Products</p>
              <h3 className="text-lg md:text-2xl font-bold text-white truncate">{stats.totalProducts}</h3>
            </div>
            <div className="p-1.5 md:p-2 bg-purple-500/10 rounded-lg hidden sm:block shrink-0 ml-2">
              <Package className="w-4 h-4 md:w-6 md:h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-2 md:mt-4 flex items-center text-xs text-slate-500">
            <span>In inventory</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-surface-800 p-4 md:p-6 rounded-2xl border border-surface-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-slate-400 mb-1 truncate">Low Stock Alerts</p>
              <h3 className="text-lg md:text-2xl font-bold text-white truncate">{stats.lowStockProducts.length}</h3>
            </div>
            <div className="p-1.5 md:p-2 bg-amber-500/10 rounded-lg hidden sm:block shrink-0 ml-2">
              <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-amber-500" />
            </div>
          </div>
          <div className="mt-2 md:mt-4 flex items-center text-xs text-slate-500">
            <span>Items need refill</span>
          </div>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="mt-6 md:mt-8 bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 md:px-6 py-4 border-b border-surface-700 flex justify-between items-center">
          <h2 className="text-base md:text-lg font-semibold text-white">Low Stock Products</h2>
          <Link href="/dashboard/products" className="text-xs md:text-sm text-brand-500 hover:text-brand-400 font-medium">
            View All
          </Link>
        </div>
        
        {stats.lowStockProducts.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            No low stock products. Your inventory is healthy! 🎉
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[300px]">
              <thead className="bg-surface-900/50 text-slate-400 text-xs md:text-sm">
                <tr>
                  <th className="px-4 md:px-6 py-3 font-medium">Product Name</th>
                  <th className="px-4 md:px-6 py-3 font-medium hidden sm:table-cell">SKU</th>
                  <th className="px-4 md:px-6 py-3 font-medium text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700">
                {stats.lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-700/50 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-slate-200 font-medium text-sm md:text-base">
                      {product.name}
                      <span className="block sm:hidden text-[10px] text-slate-500">{product.sku}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm hidden sm:table-cell">{product.sku}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                        product.stock === 0 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {product.stock} left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// মূল পেজ (Server Component)
export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user || !['owner', 'manager'].includes(user.role)) {
    redirect('/dashboard/shop');
  }

  return (
    <div className="w-full space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-surface-800 rounded-2xl p-5 md:p-6 border border-surface-700 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Welcome back! 👋</h2>
          <p className="text-sm md:text-base text-slate-300">Here is what's happening with your business today.</p>
        </div>
      </div>

      {/* Suspense Boundary for Data Fetching */}
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 md:h-32 bg-surface-800 rounded-2xl border border-surface-700 animate-pulse"></div>
          ))}
        </div>
      }>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
