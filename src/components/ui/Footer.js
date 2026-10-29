'use client';

import Link from 'next/link';
import { Flame, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 bg-surface-800 border-t border-surface-700 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="p-2 bg-brand-500/10 rounded-lg">
                <Flame className="w-6 h-6 text-brand-500" />
              </div>
              GasBiz Pro
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner for LPG cylinders and gas delivery. Safe, fast, and reliable service at your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/shop" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Shop Products</Link></li>
              <li><Link href="/dashboard/my-orders" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">My Orders</Link></li>
              <li><Link href="/dashboard/support" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>123 Gas Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>support@gasbizpro.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} GasBiz Pro. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
