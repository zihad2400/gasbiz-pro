'use client';

import { useActionState, useEffect } from 'react';
import { updateBusinessSettings } from '@/actions/settings';
import { useToast } from '@/components/ui/ToastProvider';
import { Building2, Save, Loader2, Printer, Percent, Image as ImageIcon, MapPin, Phone, Mail } from 'lucide-react';

export default function SettingsForm({ initialSettings }) {
  const [state, formAction, isPending] = useActionState(updateBusinessSettings, null);
  const { addToast } = useToast();

  useEffect(() => {
    if (state?.error) addToast(state.error, 'error');
    if (state?.success) addToast(state.success, 'success');
  }, [state, addToast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <Building2 className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Business Settings</h1>
          <p className="text-sm text-slate-400">Manage your business information, tax, and invoice preferences</p>
        </div>
      </div>

      <div className="bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden shadow-sm">
        <form action={formAction} className="divide-y divide-surface-700">
          
          {/* Section 1: Business Information */}
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-500" /> Business Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Business Name *</label>
                <input type="text" name="businessName" defaultValue={initialSettings.businessName} required
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</label>
                <input type="text" name="phone" defaultValue={initialSettings.phone} placeholder="+880 1XXX-XXXXXX"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</label>
                <input type="email" name="email" defaultValue={initialSettings.email} placeholder="owner@gasbiz.com"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Logo URL (Optional)</label>
                <input type="url" name="logoUrl" defaultValue={initialSettings.logoUrl} placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><MapPin className="w-4 h-4" /> Full Address</label>
              <textarea name="address" rows="2" defaultValue={initialSettings.address} placeholder="House, Road, Area, City"
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none resize-none"></textarea>
            </div>
          </div>

          {/* Section 2: Financial Settings */}
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Percent className="w-5 h-5 text-brand-500" /> Financial Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Currency</label>
                <select name="currency" defaultValue={initialSettings.currency} className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none">
                  <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                  <option value="USD">USD ($) - US Dollar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Invoice Prefix</label>
                <input type="text" name="invoicePrefix" defaultValue={initialSettings.invoicePrefix} placeholder="INV-"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Default Tax Rate (%)</label>
                <input type="number" name="taxRate" defaultValue={initialSettings.taxRate} min="0" max="100" step="0.01"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
            </div>
          </div>

          {/* Section 3: Inventory & Printer Settings */}
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-brand-500" /> Inventory & Printer
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Low Stock Threshold (Alert when stock is below)</label>
                <input type="number" name="lowStockThreshold" defaultValue={initialSettings.lowStockThreshold} min="0"
                  className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Enable Thermal Printer (Small Receipt)</label>
                <select name="thermalPrinter" defaultValue={initialSettings.thermalPrinter ? 'true' : 'false'} className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none">
                  <option value="false">No (A4 Standard)</option>
                  <option value="true">Yes (Thermal Receipt)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Invoice Footer */}
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Invoice Footer Note</h2>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Thank You Message (Shows at the bottom of invoice)</label>
              <input type="text" name="thankYouNote" defaultValue={initialSettings.thankYouNote} placeholder="Thank you for your business!"
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 outline-none" />
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6 bg-surface-900/50 flex justify-end">
            <button type="submit" disabled={isPending}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-lg transition-all disabled:opacity-50">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isPending ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
