import type { Payload } from '../utils/jwt.util.ts';

declare global {
  namespace Express {
    interface Request {
      user: Payload;
    }
  }
}
