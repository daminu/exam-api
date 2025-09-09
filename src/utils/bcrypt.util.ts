import { env } from '../env.js';
import { genSalt, hash } from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = await genSalt(env.SALT_ROUND);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}
