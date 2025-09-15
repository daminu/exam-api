import { HttpException } from '../utils/exception.util.js';
import { logHttpException, logUnexpectedError } from '../utils/logger.util.js';
import type { NextFunction, Request, Response } from 'express';

export function exceptionMiddleware() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (error: Error, req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof HttpException) {
      logHttpException(req, res, error);
      res.status(error.status).json({
        error: error.name,
        message: error.message,
      });
      return;
    }
    logUnexpectedError(req, res, error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  };
}
