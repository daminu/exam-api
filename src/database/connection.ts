import { env } from '../env.ts';
import * as schema from './schema.ts';
import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
});

export const db = drizzle({
  client: pool,
  schema,
  mode: 'default',
  logger: env.NODE_ENV === 'LOCAL',
});
