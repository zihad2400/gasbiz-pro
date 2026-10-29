'use server';

import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';

export async function getAllSales() {
  await connection();
  const db = await getDb();
  const sales = await db.collection(COLLECTIONS.SALES).find({}).sort({ createdAt: -1 }).toArray();
  
  // 🔥 সব ObjectId এবং Date স্ট্রিং-এ কনভার্ট করা হলো
  return sales.map(s => ({
    _id: s._id.toString(),
    invoiceNo: s.invoiceNo,
    customerId: s.customerId ? s.customerId.toString() : null,
    customerName: s.customerName,
    customerPhone: s.customerPhone || null,
    address: s.address || null,
    items: (s.items || []).map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      productId: item.productId ? item.productId.toString() : null,
    })),
    totalAmount: s.totalAmount,
    paymentMethod: s.paymentMethod || 'Cash',
    status: s.status,
    orderId: s.orderId ? s.orderId.toString() : null,
    createdBy: s.createdBy ? s.createdBy.toString() : null,
    createdAt: s.createdAt ? s.createdAt.toISOString() : new Date().toISOString(),
  }));
}
