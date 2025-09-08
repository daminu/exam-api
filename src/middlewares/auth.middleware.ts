import type { ROLE } from '../database/schema.ts';
import { env } from '../env.ts';
import { verify, type Payload } from '../utils/jwt.util.ts';
import {
  ForbiddenException,
  UnauthorizedException,
} from '@/utils/exception.util.ts';
import type { Request, Response } from 'express';
import type { NextFunction } from 'express';

export function authorize(...role: ROLE[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cookie: string | undefined = req.cookies[env.JWT_COOKIE_NAME];

    if (!cookie) {
      throw new UnauthorizedException('Please login first.');
    }
    let payload: Payload;
    try {
      payload = await verify(cookie);
    } catch {
      throw new UnauthorizedException('Please login first.');
    }
    if (!role.includes(payload.role)) {
      throw new ForbiddenException(
        "You don't have the permission to perform the action."
      );
    }
    req.user = payload;
    next();
  };
}
