export const instant = false;

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { logoutAction } from '@/actions/auth';
import { LogOut, Store } from 'lucide-react';
import MobileSidebar from '@/components/ui/MobileSidebar';
import SidebarNav from '@/components/ui/SidebarNav';
import NotificationBell from '@/components/ui/NotificationBell';
import { getNotifications } from '@/actions/notifications';
import Footer from '@/components/ui/Footer';

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const notifications = await getNotifications();

  const adminMenus = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Sales', href: '/dashboard/sales' },
    { name: 'Orders', href: '/dashboard/orders' },
    { name: 'Products', href: '/dashboard/products' },
    { name: 'Customers', href: '/dashboard/customers' },
    { name: 'Users', href: '/dashboard/users' },
    { name: 'Settings', href: '/dashboard/settings' },
  ];

  const customerMenus = [
    { name: 'Home', href: '/dashboard/customer-home' },
    { name: 'Shop', href: '/dashboard/shop' },
    { name: 'My Orders', href: '/dashboard/my-orders' },
    { name: 'Track Order', href: '/dashboard/track-order' },
    { name: 'Offers', href: '/dashboard/offers' },
    { name: 'My Profile', href: '/dashboard/profile' },
    { name: 'Settings', href: '/dashboard/customer-settings' },
    { name: 'FAQ', href: '/dashboard/faq' },
    { name: 'Support', href: '/dashboard/support' },
  ];

  let navItems = customerMenus;
  if (['owner', 'manager'].includes(user.role)) {
    navItems = adminMenus;
  }

  const safeUser = { name: user.name, role: user.role };

  return (
    <div className="h-screen bg-surface-900 flex overflow-hidden">
      <aside className="w-64 bg-surface-800 border-r border-surface-700 hidden md:flex flex-col h-full flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-surface-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white text-sm">
              {['owner', 'manager'].includes(user.role) ? 'G' : <Store className="w-5 h-5"/>}
            </span>
            {['owner', 'manager'].includes(user.role) ? 'GasBiz Admin' : 'Gas Shop'}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <SidebarNav navItems={navItems} />
        </div>

        <div className="p-4 border-t border-surface-700 flex-shrink-0">
          <form action={logoutAction}>
            <button className="flex items-center gap-3 px-3 py-2.5 w-full text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-16 bg-surface-800 border-b border-surface-700 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-40">
          <div className="flex items-center gap-3">
            <MobileSidebar user={safeUser} navItems={navItems} logoutAction={logoutAction} />
            <h1 className="text-lg font-semibold text-white truncate">
              {['owner', 'manager'].includes(user.role) ? 'Admin Panel' : 'Customer Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell initialNotifications={notifications} />
            <div className="text-right hidden sm:block ml-2 border-l border-surface-700 pl-3">
              <p className="text-sm font-medium text-slate-200">{user.name}</p>
              <p className="text-xs text-brand-500 capitalize">{user.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-surface-700 border border-surface-700 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 sm:p-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
