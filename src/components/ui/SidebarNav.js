'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShoppingCart, Package, Settings, ClipboardList, Store, User, LifeBuoy, Home, MapPin, Tag, HelpCircle, Truck, DollarSign, BarChart3, UserCog } from 'lucide-react';

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
};

export default function SidebarNav({ navItems }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const Icon = iconMap[item.name] || LayoutDashboard;
        const isActive = item.href === '/dashboard' 
          ? pathname === '/dashboard' 
          : pathname.startsWith(item.href);

        return (
          <Link 
            key={item.name} 
            href={item.href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
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
  );
}
