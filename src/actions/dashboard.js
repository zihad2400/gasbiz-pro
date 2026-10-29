'use server';

import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';

export async function getDashboardStats() {
  await connection();
  const db = await getDb();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todaySalesAgg = await db.collection(COLLECTIONS.SALES).aggregate([
    { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
  ]).toArray();
  
  const todaySalesTotal = todaySalesAgg[0]?.total || 0;
  const todaySalesCount = todaySalesAgg[0]?.count || 0;

  const totalCustomers = await db.collection(COLLECTIONS.USERS).countDocuments({ 
    role: { $ne: 'owner' } 
  });

  const totalProducts = await db.collection(COLLECTIONS.PRODUCTS).countDocuments();
  
  // লো-স্টক থ্রেশহোল্ড ২০ বা তার কম করা হলো
  const lowStockProducts = await db.collection(COLLECTIONS.PRODUCTS)
    .find({ stock: { $lte: 20 } }) 
    .sort({ stock: 1 })
    .limit(5)
    .toArray();

  return {
    todaySalesTotal,
    todaySalesCount,
    totalCustomers,
    totalProducts,
    lowStockProducts: lowStockProducts.map(p => ({
      id: p._id.toString(),
      name: p.name,
      stock: p.stock,
      sku: p.sku
    }))
  };
}
