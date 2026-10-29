export const instant = false;

import { LifeBuoy, Phone, Mail, MapPin } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <LifeBuoy className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Support & Contact</h1>
          <p className="text-sm text-slate-400">We are here to help you</p>
        </div>
      </div>

      <div className="bg-surface-800 border border-surface-700 rounded-2xl p-4 md:p-6 shadow-sm space-y-6">
        <p className="text-sm md:text-base text-slate-300">If you have any questions or need assistance, please contact us using the information below:</p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-surface-900 rounded-xl border border-surface-700">
            <div className="p-2 bg-brand-500/10 rounded-lg shrink-0">
              <Phone className="w-5 h-5 text-brand-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-slate-400">Phone Support</p>
              <p className="text-white font-medium text-sm md:text-base break-words">+880 1700-000000</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-surface-900 rounded-xl border border-surface-700">
            <div className="p-2 bg-brand-500/10 rounded-lg shrink-0">
              <Mail className="w-5 h-5 text-brand-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-slate-400">Email Us</p>
              <p className="text-white font-medium text-sm md:text-base break-all">support@gasbizpro.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-surface-900 rounded-xl border border-surface-700">
            <div className="p-2 bg-brand-500/10 rounded-lg shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-brand-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-slate-400">Office Address</p>
              <p className="text-white font-medium text-sm md:text-base">123 Gas Street, Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
