import { env } from '../env.js';
import { logger } from '../utils/logger.util.js';
import * as schema from './schema.js';
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
  logger:
    env.NODE_ENV === 'LOCAL'
      ? {
          logQuery(query, params) {
            logger.debug({ query, params });
          },
        }
      : false,
});
