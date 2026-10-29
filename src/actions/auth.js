'use server';

import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { createSession, destroySession } from '@/lib/auth/session';

export async function loginAction(prevState, formData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const db = await getDb();
  const user = await db.collection(COLLECTIONS.USERS).findOne({ email });

  const genericError = { error: 'Invalid email or password.' };
  if (!user || !user.active) return genericError;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return genericError;

  await createSession(user._id);
  redirect('/dashboard');
}

export async function signupAction(prevState, formData) {
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();
  const adminCode = formData.get('adminCode')?.toString().trim();

  if (!name || !email || !password || password.length < 6) {
    return { error: 'All fields are required. Password must be at least 6 characters.' };
  }

  const db = await getDb();
  const existingUser = await db.collection(COLLECTIONS.USERS).findOne({ email });
  if (existingUser) {
    return { error: 'This email is already registered. Please log in.' };
  }

  // ডিফল্ট রোল হবে 'customer'
  let role = 'customer'; 
  
  if (adminCode) {
    if (adminCode === process.env.ADMIN_INVITE_CODE) {
      role = 'owner'; 
    } else {
      return { error: '❌ Invalid Admin Invite Code.' };
    }
  }

  const passwordHash = await hashPassword(password);

  const result = await db.collection(COLLECTIONS.USERS).insertOne({
    name,
    email,
    passwordHash,
    role,
    active: true,
    createdAt: new Date(),
  });

  await createSession(result.insertedId);
  redirect('/dashboard');
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
