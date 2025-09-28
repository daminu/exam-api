import type { ROLE } from '../database/schema.ts';
import { env } from '../env.js';
import { createSecretKey } from 'crypto';
import { jwtVerify, SignJWT } from 'jose';

export type Payload = {
  id: number;
  role: ROLE;
};

const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8');

export async function sign(payload: Payload) {
  const signedJwt = await new SignJWT(payload)
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secretKey);
  return signedJwt;
}

export async function verify(token: string) {
  const { payload } = await jwtVerify(token, secretKey);
  return payload as Payload;
}
