export const instant = false;
import { Suspense } from 'react';
import { getExpenses } from '@/actions/expenses';
import ExpenseList from './ExpenseList';

async function ExpensesLoader() {
  const expenses = await getExpenses();
  return <ExpenseList initialExpenses={expenses} />;
}

export default function ExpensesPage() {
  return <div className="max-w-6xl mx-auto space-y-6"><Suspense fallback={<div className="text-slate-400">Loading...</div>}><ExpensesLoader /></Suspense></div>;
}
