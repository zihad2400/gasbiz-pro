/**
 * Centralized MongoDB collection names for GasBiz Pro.
 * Always import from here — never write raw collection name strings in business logic.
 */

export const COLLECTIONS = Object.freeze({
  // Auth & identity
  USERS: 'users',
  SESSIONS: 'sessions',
  BUSINESSES: 'businesses',

  // Master data
  CUSTOMERS: 'customers',
  SUPPLIERS: 'suppliers',
  PRODUCTS: 'products',
  ACCOUNT_CATEGORIES: 'accountCategories',
  CHART_OF_ACCOUNTS: 'chartOfAccounts',

  // Inventory
  INVENTORY_MOVEMENTS: 'inventoryMovements',

  // Transactions
  ORDERS: 'orders',
  SALES: 'sales',
  SALE_RETURNS: 'saleReturns',
  PURCHASES: 'purchases',
  PURCHASE_RETURNS: 'purchaseReturns',
  PAYMENTS: 'payments',
  EXPENSES: 'expenses',

  // Cash & bank
  CASH_ACCOUNTS: 'cashAccounts',
  BANK_ACCOUNTS: 'bankAccounts',

  // Accounting
  JOURNAL_ENTRIES: 'journalEntries',
  LEDGER_ENTRIES: 'ledgerEntries',

  // Config & audit
  BUSINESS_SETTINGS: 'businessSettings',
  AUDIT_LOGS: 'auditLogs',
});

/** Optional guard: throws if an unknown collection name is requested. */
export function assertCollection(name) {
  const values = Object.values(COLLECTIONS);
  if (!values.includes(name)) {
    throw new Error(`Unknown collection: ${name}`);
  }
  return name;
}
