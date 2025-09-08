import type { MysqlErrorCodes } from 'mysql-error-codes';

declare module 'drizzle-orm' {
  class DrizzleQueryError {
    cause: {
      code: keyof typeof MysqlErrorCodes;
      errno: MysqlErrorCodes;
      sql: string;
      sqlState: string;
      sqlMessage: string;
    };
  }
}
