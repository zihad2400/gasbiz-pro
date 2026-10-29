'use server';

import { revalidatePath } from 'next/cache';
import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentUser } from '@/lib/auth/session';
import { ObjectId } from 'mongodb';

export async function createNotification(targetRole, title, message, link = '') {
  const db = await getDb();
  await db.collection('notifications').insertOne({
    targetRole,
    title,
    message,
    link,
    read: false,
    createdAt: new Date(),
  });
}

export async function getNotifications() {
  await connection();
  const user = await getCurrentUser();
  if (!user) return [];

  const db = await getDb();
  const role = ['owner', 'manager'].includes(user.role) ? 'admin' : 'customer';
  
  const notifs = await db.collection('notifications')
    .find({ targetRole: role })
    .sort({ createdAt: -1 })
    .limit(20) // সর্বোচ্চ ২০টি নোটিফিকেশন
    .toArray();

  return notifs.map(n => ({
    _id: n._id.toString(),
    title: n.title,
    message: n.message,
    link: n.link || '',
    read: n.read,
    createdAt: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString(),
  }));
}

export async function markAllAsRead() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const db = await getDb();
  const role = ['owner', 'manager'].includes(user.role) ? 'admin' : 'customer';
  
  await db.collection('notifications').updateMany(
    { targetRole: role, read: false },
    { $set: { read: true } }
  );

  revalidatePath('/dashboard');
  return { success: 'All marked as read' };
}

export async function markSingleAsRead(notificationId) {
  const db = await getDb();
  await db.collection('notifications').updateOne(
    { _id: new ObjectId(notificationId) },
    { $set: { read: true } }
  );
  revalidatePath('/dashboard');
  return { success: 'Marked as read' };
}

export async function markSingleAsUnread(notificationId) {
  const db = await getDb();
  await db.collection('notifications').updateOne(
    { _id: new ObjectId(notificationId) },
    { $set: { read: false } }
  );
  revalidatePath('/dashboard');
  return { success: 'Marked as unread' };
}
