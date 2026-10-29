'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentUser } from '@/lib/auth/session';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { destroySession } from '@/lib/auth/session';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';

export async function updateProfile(prevState, formData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const name = formData.get('name')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();
  const address = formData.get('address')?.toString().trim();

  if (!name) return { error: 'Name is required.' };

  const db = await getDb();
  await db.collection(COLLECTIONS.USERS).updateOne(
    { _id: user._id },
    { $set: { name, phone, address, updatedAt: new Date() } }
  );

  revalidatePath('/dashboard/profile');
  return { success: 'Profile updated successfully!' };
}

export async function changePassword(prevState, formData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const oldPassword = formData.get('oldPassword')?.toString();
  const newPassword = formData.get('newPassword')?.toString();

  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return { error: 'New password must be at least 6 characters.' };
  }

  const db = await getDb();
  const dbUser = await db.collection(COLLECTIONS.USERS).findOne({ _id: user._id });
  
  const isValid = await verifyPassword(oldPassword, dbUser.passwordHash);
  if (!isValid) return { error: 'Incorrect old password.' };

  const newHash = await hashPassword(newPassword);
  await db.collection(COLLECTIONS.USERS).updateOne(
    { _id: user._id },
    { $set: { passwordHash: newHash, updatedAt: new Date() } }
  );

  return { success: 'Password changed successfully!' };
}

export async function deleteAccount(prevState, formData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const password = formData.get('password')?.toString();
  const confirmText = formData.get('confirmText')?.toString().trim();

  if (confirmText !== 'DELETE') {
    return { error: 'Please type "DELETE" to confirm.' };
  }

  const db = await getDb();
  const dbUser = await db.collection(COLLECTIONS.USERS).findOne({ _id: user._id });
  
  const isValid = await verifyPassword(password, dbUser.passwordHash);
  if (!isValid) return { error: 'Incorrect password.' };

  // 🔥 ডেটা মুছে ফেলা
  await db.collection(COLLECTIONS.USERS).deleteOne({ _id: user._id });
  await db.collection(COLLECTIONS.ORDERS).deleteMany({ customerId: user._id });
  await db.collection('notifications').deleteMany({ targetRole: 'customer' }); // কাস্টমারের নোটিফিকেশন

  // সেশন ডিলিট করে লগআউট করে দেওয়া
  await destroySession();
  redirect('/login');
}
