'use server';

import { revalidatePath } from 'next/cache';
import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentUser } from '@/lib/auth/session';
import { ObjectId } from 'mongodb';

export async function getAllUsers() {
  await connection();
  const user = await getCurrentUser();
  if (!user || user.role !== 'owner') return [];

  const db = await getDb();
  const users = await db.collection(COLLECTIONS.USERS).find({}).sort({ createdAt: -1 }).toArray();
  
  return users.map(u => ({
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    active: u.active,
    createdAt: u.createdAt ? u.createdAt.toISOString() : null,
  }));
}

export async function deleteUser(userId) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'owner') {
    return { error: 'Unauthorized. Only Owner can delete users.' };
  }

  const db = await getDb();
  const targetUser = await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(userId) });
  
  if (!targetUser) return { error: 'User not found.' };
  if (targetUser.role === 'owner') return { error: 'Cannot delete an Owner account.' };
  if (targetUser._id.toString() === currentUser._id.toString()) return { error: 'You cannot delete your own account.' };

  await db.collection(COLLECTIONS.USERS).deleteOne({ _id: new ObjectId(userId) });
  await db.collection(COLLECTIONS.ORDERS).deleteMany({ customerId: new ObjectId(userId) });

  revalidatePath('/dashboard/users');
  return { success: `User "${targetUser.name}" deleted successfully!` };
}
