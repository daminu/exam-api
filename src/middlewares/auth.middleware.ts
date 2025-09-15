import type { ROLE } from '../database/schema.js';
import { env } from '../env.js';
import {
  ForbiddenException,
  UnauthorizedException,
} from '../utils/exception.util.js';
import { verify, type Payload } from '../utils/jwt.util.js';
import type { Request, Response } from 'express';
import type { NextFunction } from 'express';

export function setPayload() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cookie: string | undefined = req.cookies[env.JWT_COOKIE_NAME];

    if (!cookie) {
      next();
      return;
    }
    let payload: Payload;
    try {
      payload = await verify(cookie);
    } catch {
      next();
      return;
    }
    req.user = payload;
    next();
  };
}

export function authorize(...role: ROLE[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedException('Please login first.');
    }
    if (!role.includes(req.user.role)) {
      throw new ForbiddenException(
        "You don't have the permission to perform the action."
      );
    }
    next();
  };
}
