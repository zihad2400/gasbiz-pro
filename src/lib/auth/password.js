import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(plainText) {
  if (!plainText || plainText.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export async function verifyPassword(plainText, hash) {
  if (!plainText || !hash) return false;
  return bcrypt.compare(plainText, hash);
}
