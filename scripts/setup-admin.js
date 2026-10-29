import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function loadEnvLocal() {
  const envPath = path.join(projectRoot, '.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local not found.');
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  
  const ADMIN_EMAIL = 'zihadbinsamsu2400@gmail.com';
  const ADMIN_PASSWORD = 'admin123';
  const ADMIN_NAME = 'Zihad Bin Samsu';

  console.log('=== GasBiz Pro — Admin Account Setup ===');
  console.log(`Target Email: ${ADMIN_EMAIL}`);

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);
    const users = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: ADMIN_EMAIL });
    
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existingAdmin) {
      // Update existing admin password to ensure it matches
      await users.updateOne(
        { _id: existingAdmin._id },
        { 
          $set: { 
            passwordHash: hash,
            role: 'owner',
            active: true,
            updatedAt: new Date()
          } 
        }
      );
      console.log('✅ Admin account updated with new password!');
    } else {
      // Create new admin account
      await users.insertOne({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        passwordHash: hash,
        role: 'owner',
        active: true,
        createdAt: new Date(),
      });
      console.log('✅ Admin account created successfully!');
    }

    console.log('=========================================');
    console.log('You can now log in with:');
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log('=========================================');
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('❌ Script failed:', err.message);
  process.exit(1);
});
