import { env } from '../env.js';
import { AuthService } from '../services/auth.service.js';
import type { RegisterSchema, LoginSchema } from '../utils/schema.util.js';
import type { Request, Response } from 'express';
import type { z } from 'zod';

export class AuthController {
  static async register(
    req: Request<object, object, z.infer<typeof RegisterSchema>>,
    res: Response
  ) {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  }

  static async login(
    req: Request<object, object, z.infer<typeof LoginSchema>>,
    res: Response
  ) {
    const result = await AuthService.login(req.body);
    res.cookie(env.JWT_COOKIE_NAME, result, { httpOnly: true });
    res.status(200).json({
      message: 'Logged in successfully.',
    });
  }
}
