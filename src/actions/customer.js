'use server';

import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentUser } from '@/lib/auth/session';

export async function getShopProducts() {
  await connection();
  const db = await getDb();
  const products = await db.collection(COLLECTIONS.PRODUCTS)
    .find({ stock: { $gt: 0 } })
    .toArray();

  return products.map(p => ({ 
    ...p, 
    _id: p._id.toString(),
    createdAt: p.createdAt ? p.createdAt.toISOString() : null
  }));
}

export async function getMyOrders() {
  await connection();
  const user = await getCurrentUser();
  if (!user) return [];

  const db = await getDb();
  const orders = await db.collection(COLLECTIONS.ORDERS)
    .find({ customerId: user._id })
    .sort({ createdAt: -1 })
    .toArray();

  // 🔥 সব ObjectId স্ট্রিং-এ কনভার্ট
  return orders.map(o => ({
    ...o,
    _id: o._id.toString(),
    productId: o.productId.toString(),
    customerId: o.customerId.toString(),
    createdAt: o.createdAt.toISOString(),
  }));
}
