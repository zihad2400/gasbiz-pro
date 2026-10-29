'use server';

import { revalidatePath } from 'next/cache';
import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentUser } from '@/lib/auth/session';

export async function getBusinessSettings() {
  await connection();
  const db = await getDb();
  const settings = await db.collection(COLLECTIONS.BUSINESS_SETTINGS).findOne({});
  
  if (!settings) {
    return {
      businessName: 'GasBiz Pro',
      phone: '',
      email: '',
      address: '',
      currency: 'BDT',
      invoicePrefix: 'INV-',
      taxRate: 0,
      logoUrl: '',
      lowStockThreshold: 10,
      thermalPrinter: false,
      thankYouNote: 'Thank you for your business!'
    };
  }
  
  return {
    ...settings,
    _id: settings._id.toString(),
  };
}

export async function updateBusinessSettings(prevState, formData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'owner') {
    return { error: 'Unauthorized. Only Owner can update settings.' };
  }

  const businessName = formData.get('businessName')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const address = formData.get('address')?.toString().trim();
  const currency = formData.get('currency')?.toString() || 'BDT';
  const invoicePrefix = formData.get('invoicePrefix')?.toString().trim() || 'INV-';
  const taxRate = Number(formData.get('taxRate')) || 0;
  const logoUrl = formData.get('logoUrl')?.toString().trim();
  const lowStockThreshold = Number(formData.get('lowStockThreshold')) || 10;
  const thermalPrinter = formData.get('thermalPrinter') === 'true';
  const thankYouNote = formData.get('thankYouNote')?.toString().trim();

  if (!businessName) return { error: 'Business Name is required.' };

  const db = await getDb();
  const collection = db.collection(COLLECTIONS.BUSINESS_SETTINGS);
  
  const existing = await collection.findOne({});
  
  const updateData = {
    businessName, phone, email, address, currency, invoicePrefix, 
    taxRate, logoUrl, lowStockThreshold, thermalPrinter, thankYouNote, 
    updatedAt: new Date()
  };

  if (existing) {
    await collection.updateOne({ _id: existing._id }, { $set: updateData });
  } else {
    await collection.insertOne({ ...updateData, createdAt: new Date() });
  }

  revalidatePath('/dashboard/settings');
  return { success: 'Business settings saved successfully!' };
}
