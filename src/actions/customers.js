'use server';

import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';

export async function getCustomers() {
  await connection();
  const db = await getDb();
  
  // Owner বাদে সবাইকে কাস্টমার হিসেবে দেখাও (Nahid যেহেতু staff, সে-ও এখানে আসবে)
  const customers = await db.collection(COLLECTIONS.USERS)
    .find({ role: { $ne: 'owner' } }) 
    .sort({ createdAt: -1 })
    .toArray();
  
  // প্রত্যেক কাস্টমারের অর্ডার হিস্ট্রি এবং মোট খরচ বের করি
  const customerStats = await Promise.all(customers.map(async (c) => {
    const orders = await db.collection(COLLECTIONS.ORDERS).find({ customerId: c._id }).toArray();
    const totalSpent = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0);
    
    return {
      _id: c._id.toString(),
      name: c.name || 'Unknown',
      email: c.email || 'No Email',
      role: c.role,
      createdAt: c.createdAt ? c.createdAt.toISOString() : null,
      totalOrders: orders.length,
      totalSpent,
    };
  }));

  return customerStats;
}
