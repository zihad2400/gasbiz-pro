/**
 * Idempotent MongoDB initialization for GasBiz Pro.
 *
 * Usage (from project root):
 *   node scripts/init-db.js
 *
 * - Reads MONGODB_URI & MONGODB_DB_NAME from .env.local (loaded manually — no extra deps)
 * - Creates the database (implicitly, by writing one empty index)
 * - Applies all indexes from src/lib/db/indexes.js
 * - Prints a summary; NEVER prints the connection string or credentials
 * - Does NOT insert any demo data
 *
 * Node ESM note: This file uses dynamic import of ES modules from src/lib because
 * src/ files use ESM `export` syntax.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// --- Minimal .env.local loader (safe, no external dependency) ---
function loadEnvLocal() {
  const envPath = path.join(projectRoot, '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env.local not found at ${envPath}. Create it first.`);
  }
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function redactUri(uri) {
  if (!uri) return '(missing)';
  // Show scheme + host only — never user/password
  try {
    const u = new URL(uri.replace('mongodb+srv://', 'https://').replace('mongodb://', 'http://'));
    return `${uri.split('://')[0]}://${u.hostname}${u.port ? ':' + u.port : ''}`;
  } catch {
    return '(unparsable URI)';
  }
}

async function main() {
  loadEnvLocal();

  if (!process.env.MONGODB_URI || !process.env.MONGODB_DB_NAME) {
    throw new Error('MONGODB_URI and MONGODB_DB_NAME must be set in .env.local');
  }

  const { MongoClient } = await import('mongodb');
  const indexesModule = await import(
    pathToFileURL(path.join(projectRoot, 'src/lib/db/indexes.js')).href
  );
  const { INDEX_SPECS } = indexesModule;

  console.log('========================================');
  console.log(' GasBiz Pro — MongoDB Initialization');
  console.log('========================================');
  console.log('Target host  :', redactUri(process.env.MONGODB_URI));
  console.log('Target dbName:', process.env.MONGODB_DB_NAME);
  console.log('Index specs  :', INDEX_SPECS.length);
  console.log('----------------------------------------');

  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);
    await db.command({ ping: 1 });
    console.log('✅ Connected to MongoDB');

    // Group by collection to create collections explicitly (which implies DB creation)
    const perCollection = new Map();
    for (const spec of INDEX_SPECS) {
      if (!perCollection.has(spec.collection)) perCollection.set(spec.collection, []);
      perCollection.get(spec.collection).push(spec);
    }

    const existingCollections = new Set(
      (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name)
    );

    let createdCollections = 0;
    let createdIndexes = 0;
    let skippedIndexes = 0;
    const failures = [];

    for (const [collName, specs] of perCollection) {
      if (!existingCollections.has(collName)) {
        await db.createCollection(collName);
        createdCollections += 1;
        existingCollections.add(collName);
        console.log(`  + collection: ${collName}`);
      }
    }

    // Apply indexes
    for (const spec of INDEX_SPECS) {
      try {
        await db.collection(spec.collection).createIndex(spec.keys, spec.options || {});
        createdIndexes += 1;
      } catch (err) {
        // If index already exists with same name/keys → skip silently
        if (err && (err.code === 85 || err.code === 86)) {
          skippedIndexes += 1;
          continue;
        }
        failures.push({ collection: spec.collection, name: spec.options?.name, error: err.message });
      }
    }

    console.log('----------------------------------------');
    console.log(`Collections created : ${createdCollections}`);
    console.log(`Indexes ensured     : ${createdIndexes}`);
    console.log(`Indexes skipped     : ${skippedIndexes}`);
    if (failures.length > 0) {
      console.log('❌ Some indexes failed:');
      for (const f of failures) console.log(`   - ${f.collection}/${f.name}: ${f.error}`);
      process.exitCode = 1;
    } else {
      console.log('✅ All indexes applied successfully');
    }

    console.log('========================================');
    console.log(' Done. No demo data was inserted.');
    console.log('========================================');
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('❌ init-db failed:', err.message);
  process.exit(1);
});
