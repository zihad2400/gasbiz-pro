'use server';

import { revalidatePath } from 'next/cache';
import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentUser } from '@/lib/auth/session';
import { ObjectId } from 'mongodb';

export async function getProducts() {
  await connection();
  const db = await getDb();
  const products = await db.collection(COLLECTIONS.PRODUCTS).find({}).sort({ createdAt: -1 }).toArray();
  
  return products.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
  }));
}

export async function addProduct(prevState, formData) {
  const user = await getCurrentUser();
  if (!user || !['owner', 'manager'].includes(user.role)) {
    return { error: 'Unauthorized to add products.' };
  }

  const name = formData.get('name')?.toString().trim();
  const sku = formData.get('sku')?.toString().trim();
  const category = formData.get('category')?.toString().trim();
  const purchasePrice = Number(formData.get('purchasePrice'));
  const sellingPrice = Number(formData.get('sellingPrice'));
  const stock = Number(formData.get('stock'));

  if (!name || !sku || isNaN(purchasePrice) || isNaN(sellingPrice)) {
    return { error: 'Please fill all required fields correctly.' };
  }

  const db = await getDb();
  
  const existing = await db.collection(COLLECTIONS.PRODUCTS).findOne({ sku });
  if (existing) {
    return { error: 'A product with this SKU already exists.' };
  }

  await db.collection(COLLECTIONS.PRODUCTS).insertOne({
    name, sku, category: category || 'General', purchasePrice, sellingPrice, stock: stock || 0, active: true, createdAt: new Date(),
  });

  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/shop');
  revalidatePath('/dashboard');
  
  return { success: 'Product added successfully!' };
}

export async function deleteProduct(productId) {
  const user = await getCurrentUser();
  if (!user || !['owner', 'manager'].includes(user.role)) {
    return { error: 'Unauthorized to delete products.' };
  }

  const db = await getDb();
  await db.collection(COLLECTIONS.PRODUCTS).deleteOne({ _id: new ObjectId(productId) });

  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/shop');
  revalidatePath('/dashboard');
  
  return { success: 'Product deleted successfully!' };
}
