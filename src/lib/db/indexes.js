/**
 * Index definitions for GasBiz Pro.
 * Each entry: { collection, keys, options }.
 * Applied idempotently by scripts/init-db.js.
 */

import { COLLECTIONS } from './collections.js';

export const INDEX_SPECS = [
  // Users
  { collection: COLLECTIONS.USERS, keys: { email: 1 }, options: { unique: true, name: 'uniq_users_email' } },
  { collection: COLLECTIONS.USERS, keys: { role: 1 }, options: { name: 'idx_users_role' } },

  // Sessions (TTL cleanup)
  {
    collection: COLLECTIONS.SESSIONS,
    keys: { expiresAt: 1 },
    options: { name: 'ttl_sessions_expires', expireAfterSeconds: 0 },
  },
  { collection: COLLECTIONS.SESSIONS, keys: { token: 1 }, options: { unique: true, name: 'uniq_sessions_token' } },
  { collection: COLLECTIONS.SESSIONS, keys: { userId: 1 }, options: { name: 'idx_sessions_userId' } },

  // Customers / Suppliers
  { collection: COLLECTIONS.CUSTOMERS, keys: { name: 1 }, options: { name: 'idx_customers_name' } },
  { collection: COLLECTIONS.CUSTOMERS, keys: { phone: 1 }, options: { name: 'idx_customers_phone' } },
  { collection: COLLECTIONS.SUPPLIERS, keys: { name: 1 }, options: { name: 'idx_suppliers_name' } },
  { collection: COLLECTIONS.SUPPLIERS, keys: { phone: 1 }, options: { name: 'idx_suppliers_phone' } },

  // Products
  { collection: COLLECTIONS.PRODUCTS, keys: { sku: 1 }, options: { unique: true, sparse: true, name: 'uniq_products_sku' } },
  { collection: COLLECTIONS.PRODUCTS, keys: { name: 1 }, options: { name: 'idx_products_name' } },
  { collection: COLLECTIONS.PRODUCTS, keys: { category: 1 }, options: { name: 'idx_products_category' } },
  { collection: COLLECTIONS.PRODUCTS, keys: { active: 1, name: 1 }, options: { name: 'idx_products_active_name' } },

  // Inventory movements
  {
    collection: COLLECTIONS.INVENTORY_MOVEMENTS,
    keys: { productId: 1, createdAt: -1 },
    options: { name: 'idx_inv_product_created' },
  },
  {
    collection: COLLECTIONS.INVENTORY_MOVEMENTS,
    keys: { referenceType: 1, referenceId: 1 },
    options: { name: 'idx_inv_reference' },
  },

  // Sales
  { collection: COLLECTIONS.SALES, keys: { invoiceNo: 1 }, options: { unique: true, name: 'uniq_sales_invoiceNo' } },
  { collection: COLLECTIONS.SALES, keys: { customerId: 1, createdAt: -1 }, options: { name: 'idx_sales_customer_created' } },
  { collection: COLLECTIONS.SALES, keys: { createdAt: -1 }, options: { name: 'idx_sales_created' } },
  { collection: COLLECTIONS.SALES, keys: { status: 1, createdAt: -1 }, options: { name: 'idx_sales_status_created' } },

  // Sale returns
  { collection: COLLECTIONS.SALE_RETURNS, keys: { saleId: 1 }, options: { name: 'idx_saleReturns_saleId' } },
  { collection: COLLECTIONS.SALE_RETURNS, keys: { createdAt: -1 }, options: { name: 'idx_saleReturns_created' } },

  // Purchases
  { collection: COLLECTIONS.PURCHASES, keys: { invoiceNo: 1 }, options: { unique: true, name: 'uniq_purchases_invoiceNo' } },
  { collection: COLLECTIONS.PURCHASES, keys: { supplierId: 1, createdAt: -1 }, options: { name: 'idx_purchases_supplier_created' } },
  { collection: COLLECTIONS.PURCHASES, keys: { createdAt: -1 }, options: { name: 'idx_purchases_created' } },

  // Purchase returns
  { collection: COLLECTIONS.PURCHASE_RETURNS, keys: { purchaseId: 1 }, options: { name: 'idx_purchaseReturns_purchaseId' } },
  { collection: COLLECTIONS.PURCHASE_RETURNS, keys: { createdAt: -1 }, options: { name: 'idx_purchaseReturns_created' } },

  // Payments
  { collection: COLLECTIONS.PAYMENTS, keys: { partyType: 1, partyId: 1, createdAt: -1 }, options: { name: 'idx_payments_party_created' } },
  { collection: COLLECTIONS.PAYMENTS, keys: { createdAt: -1 }, options: { name: 'idx_payments_created' } },

  // Expenses
  { collection: COLLECTIONS.EXPENSES, keys: { category: 1, expenseDate: -1 }, options: { name: 'idx_expenses_category_date' } },
  { collection: COLLECTIONS.EXPENSES, keys: { expenseDate: -1 }, options: { name: 'idx_expenses_date' } },

  // Cash / bank
  { collection: COLLECTIONS.CASH_ACCOUNTS, keys: { name: 1 }, options: { unique: true, name: 'uniq_cashAccounts_name' } },
  { collection: COLLECTIONS.BANK_ACCOUNTS, keys: { name: 1 }, options: { unique: true, name: 'uniq_bankAccounts_name' } },

  // Accounting
  { collection: COLLECTIONS.CHART_OF_ACCOUNTS, keys: { code: 1 }, options: { unique: true, name: 'uniq_coa_code' } },
  { collection: COLLECTIONS.JOURNAL_ENTRIES, keys: { entryDate: -1 }, options: { name: 'idx_journal_date' } },
  { collection: COLLECTIONS.JOURNAL_ENTRIES, keys: { referenceType: 1, referenceId: 1 }, options: { name: 'idx_journal_reference' } },
  {
    collection: COLLECTIONS.LEDGER_ENTRIES,
    keys: { accountId: 1, entryDate: -1 },
    options: { name: 'idx_ledger_account_date' },
  },

  // Audit
  { collection: COLLECTIONS.AUDIT_LOGS, keys: { userId: 1, createdAt: -1 }, options: { name: 'idx_audit_user_created' } },
  { collection: COLLECTIONS.AUDIT_LOGS, keys: { entityType: 1, entityId: 1, createdAt: -1 }, options: { name: 'idx_audit_entity' } },
];
