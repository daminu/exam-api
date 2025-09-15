import { env } from '../env.js';
import type { HttpException } from './exception.util.js';
import type { Request, Response } from 'express';
import pino from 'pino';

export const logger = pino({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  transport:
    env.NODE_ENV === 'LOCAL'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (undefined as any),
});

export function logRequest(req: Request, res: Response) {
  logger.info(
    `requestId: ${req.id}, timestamp: ${new Date().toISOString()}, userId: ${req.user?.id || null} url: ${req.url}, method: ${req.method}, query: ${JSON.stringify(req.query)}, statusCode: ${res.statusCode}`
  );
}

export function logHttpException(
  req: Request,
  res: Response,
  error: HttpException
) {
  logger.warn(
    `requestId: ${req.id}, timestamp: ${new Date().toISOString()}, userId: ${req.user?.id || null} url: ${req.url}, method: ${req.method}, query: ${JSON.stringify(req.query)}, statusCode: ${res.statusCode}, error: ${error.message}`
  );
}

export function logUnexpectedError(req: Request, res: Response, error: Error) {
  logger.error(
    `requestId: ${req.id}, timestamp: ${new Date().toISOString()}, userId: ${req.user?.id || null} url: ${req.url}, method: ${req.method}, query: ${JSON.stringify(req.query)}, statusCode: ${res.statusCode}, error: ${error.message}`
  );
}
