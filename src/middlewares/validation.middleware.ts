import type { Request, Response, NextFunction } from 'express';
import { type ZodType, ZodError } from 'zod';

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid body',
          fields: error.issues.map((issue) => ({
            name: issue.path.join(','),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
}

export function validateQuery(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid query',
          fields: error.issues.map((issue) => ({
            name: issue.path.join(','),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
}

export function validateParams(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid params',
          fields: error.issues.map((issue) => ({
            name: issue.path.join(','),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
}
