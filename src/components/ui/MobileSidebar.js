'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard, Users, ShoppingCart, Package, Settings, ClipboardList, Store, User, LifeBuoy, Home, MapPin, Tag, HelpCircle, Truck, DollarSign, BarChart3, UserCog } from 'lucide-react';

const iconMap = {
  'Dashboard': LayoutDashboard,
  'Sales': ShoppingCart,
  'Purchases': Truck,
  'Orders': ClipboardList,
  'Products': Package,
  'Customers': Users,
  'Suppliers': Store,
  'Expenses': DollarSign,
  'Reports': BarChart3,
  'Users': UserCog,
  'Settings': Settings,
  'Home': Home,
  'Shop': Store,
  'My Orders': ClipboardList,
  'Track Order': MapPin,
  'Offers': Tag,
  'My Profile': User,
  'FAQ': HelpCircle,
  'Support': LifeBuoy,
  'Settings': Settings,
};

export default function MobileSidebar({ user, navItems, logoutAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-2 text-slate-300 hover:text-white transition"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          ></div>

          <aside className="relative w-72 bg-surface-800 border-r border-surface-700 h-full flex flex-col animate-in slide-in-from-left duration-300">
            <div className="h-16 flex items-center justify-between px-6 border-b border-surface-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white text-sm">G</span>
                GasBiz Pro
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = iconMap[item.name] || LayoutDashboard;
                const isActive = item.href === '/dashboard' 
                  ? pathname === '/dashboard' 
                  : pathname.startsWith(item.href);

                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${
                      isActive 
                        ? 'bg-brand-500/10 text-brand-500' 
                        : 'text-slate-400 hover:bg-surface-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" /> {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-surface-700">
              <form action={logoutAction}>
                <button className="flex items-center gap-3 px-3 py-2.5 w-full text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
