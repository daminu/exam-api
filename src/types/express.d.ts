import type { Payload } from '../utils/jwt.util.ts';

declare global {
  namespace Express {
    interface Request {
      id: string;
      user: Payload;
    }
  }
}
