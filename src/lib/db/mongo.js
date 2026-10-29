/**
 * MongoDB connection utility for GasBiz Pro.
 * - Caches the MongoClient across server invocations (Next.js dev hot-reload safe)
 * - Validates environment variables
 * - Never logs the connection string
 */

import { MongoClient } from 'mongodb';
import { connection } from 'next/server';

const REQUIRED_ENV = ['MONGODB_URI', 'MONGODB_DB_NAME'];

function readEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key] || !String(process.env[key]).trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
        'Copy .env.example to .env.local and fill in the values.'
    );
  }
  return {
    uri: process.env.MONGODB_URI.trim(),
    dbName: process.env.MONGODB_DB_NAME.trim(),
  };
}

// Reuse client across hot reloads in development (and across requests in production)
let cached = globalThis.__gasbizMongoCache;
if (!cached) {
  cached = globalThis.__gasbizMongoCache = {
    client: null,
    db: null,
    connecting: null,
    connectedAt: null,
  };
}

/**
 * Connects to MongoDB (or reuses the cached connection) and returns the Db instance.
 * Safe to call from any server-side code (Server Components, Route Handlers, Server Actions).
 */
export async function getDb() {
  if (cached.db) {
    return cached.db;
  }

  if (cached.connecting) {
    return cached.connecting;
  }

  const { uri, dbName } = readEnv();

  cached.connecting = (async () => {
    try {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
      });
      await client.connect();
      // Ping for a real successful connection before caching
      await client.db(dbName).command({ ping: 1 });

      cached.client = client;
      cached.db = client.db(dbName);
      cached.connectedAt = new Date();
      return cached.db;
    } catch (err) {
      // Reset on failure so the next call can retry
      cached.client = null;
      cached.db = null;
      cached.connectedAt = null;
      // Do NOT leak the URI or credentials in the error message
      throw new Error(
        `MongoDB connection failed: ${err && err.message ? err.message : 'unknown error'}`
      );
    } finally {
      cached.connecting = null;
    }
  })();

  return cached.connecting;
}

/** Returns a collection handle from the primary database. */
export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

/**
 * Lightweight ping used by the health endpoint.
 * Uses `await connection()` so this runs per-request (not at build time).
 * Returns { ok, latencyMs, dbName }.
 */
export async function pingDatabase() {
  // Opt this call into request-time rendering — avoids prerender timestamp error
  await connection();

  const started = Date.now();
  const db = await getDb();
  const result = await db.command({ ping: 1 });
  return {
    ok: result?.ok === 1,
    latencyMs: Date.now() - started,
    dbName: db.databaseName,
    connectedAt: cached.connectedAt ? cached.connectedAt.toISOString() : null,
  };
}

/** Returns diagnostics (never includes URI or credentials). */
export function getConnectionDiagnostics() {
  return {
    hasClient: Boolean(cached.client),
    hasDb: Boolean(cached.db),
    connectedAt: cached.connectedAt ? cached.connectedAt.toISOString() : null,
  };
}
