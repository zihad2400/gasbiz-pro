'use server';

import { revalidatePath } from 'next/cache';
import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentUser } from '@/lib/auth/session';

export async function getSuppliers() {
  await connection();
  const db = await getDb();
  const suppliers = await db.collection(COLLECTIONS.SUPPLIERS).find({}).sort({ createdAt: -1 }).toArray();
  return suppliers.map(s => ({ ...s, _id: s._id.toString(), createdAt: s.createdAt ? s.createdAt.toISOString() : null }));
}

export async function addSupplier(prevState, formData) {
  const user = await getCurrentUser();
  if (!user || !['owner', 'manager'].includes(user.role)) return { error: 'Unauthorized' };

  const name = formData.get('name')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();
  const address = formData.get('address')?.toString().trim();

  if (!name || !phone) return { error: 'Name and Phone are required.' };

  const db = await getDb();
  await db.collection(COLLECTIONS.SUPPLIERS).insertOne({
    name, phone, address, balance: 0, createdAt: new Date(),
  });

  revalidatePath('/dashboard/suppliers');
  return { success: 'Supplier added successfully!' };
}
