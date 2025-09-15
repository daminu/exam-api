import { logRequest } from '../utils/logger.util.js';
import type { Request, Response, NextFunction } from 'express';

export function logMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    logRequest(req, res);
    next();
  };
}
