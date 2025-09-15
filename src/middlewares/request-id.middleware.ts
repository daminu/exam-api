import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function requestIdMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const incomingId = req.headers['x-request-id'];
    const id = Array.isArray(incomingId)
      ? (incomingId[0] as string)
      : incomingId || uuidv4();
    req.id = id;
    res.setHeader('X-Request-Id', req.id);
    next();
  };
}
