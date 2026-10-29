import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { connection } from 'next/server'; // Import connection
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';

const SESSION_COOKIE_NAME = 'gasbiz_session';
const SESSION_DURATION_DAYS = 7;

/**
 * Creates a new session in the database and sets an HTTP-only cookie.
 */
export async function createSession(userId) {
  const db = await getDb();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  // Save session to DB
  await db.collection(COLLECTIONS.SESSIONS).insertOne({
    token,
    userId: userId,
    expiresAt,
    createdAt: new Date(),
  });

  // Set secure cookie (Next.js 16 requires await cookies())
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

/**
 * Retrieves the current logged-in user based on the session cookie.
 * Returns null if not logged in or session expired.
 */
export async function getCurrentUser() {
  // Tell Next.js to render this at request time, not prerender time
  await connection();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const db = await getDb();
  
  // Find session
  const session = await db.collection(COLLECTIONS.SESSIONS).findOne({ token });
  if (!session) return null;

  // Check expiry
  if (new Date() > new Date(session.expiresAt)) {
    await db.collection(COLLECTIONS.SESSIONS).deleteOne({ token });
    return null;
  }

  // Find user
  const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: session.userId });
  if (!user) return null;

  // Never return the password hash to the client
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * Destroys the current session and clears the cookie.
 */
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const db = await getDb();
    await db.collection(COLLECTIONS.SESSIONS).deleteOne({ token });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
