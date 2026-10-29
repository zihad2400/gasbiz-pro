'use server';
import { revalidatePath } from 'next/cache';
import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentUser } from '@/lib/auth/session';

export async function getExpenses() {
  await connection();
  const db = await getDb();
  const expenses = await db.collection(COLLECTIONS.EXPENSES).find({}).sort({ date: -1 }).toArray();
  return expenses.map(e => ({ ...e, _id: e._id.toString(), date: e.date.toISOString() }));
}

export async function addExpense(prevState, formData) {
  const user = await getCurrentUser();
  if (!user || !['owner', 'manager'].includes(user.role)) return { error: 'Unauthorized' };

  const title = formData.get('title')?.toString().trim();
  const amount = Number(formData.get('amount'));
  const category = formData.get('category')?.toString().trim();

  if (!title || !amount || amount <= 0) return { error: 'Invalid data.' };

  const db = await getDb();
  await db.collection(COLLECTIONS.EXPENSES).insertOne({
    title, amount, category, date: new Date(), createdAt: new Date(),
  });

  revalidatePath('/dashboard/expenses');
  revalidatePath('/dashboard');
  return { success: 'Expense added successfully!' };
}
