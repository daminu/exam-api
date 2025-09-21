import { env } from '../env.js';
import { AuthService } from '../services/auth.service.js';
import type {
  RegisterRequestSchema,
  LoginSchema,
  MessageResponseSchema,
  MeResponseSchema,
  SendCodeResponseSchema,
  SendCodeRequestSchema,
  VerifyCodeRequestSchema,
} from '../utils/schema.util.js';
import type { Request, Response } from 'express';
import type { z } from 'zod';

export class AuthController {
  static async register(
    req: Request<object, object, z.infer<typeof RegisterRequestSchema>>,
    res: Response
  ) {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  }

  static async login(
    req: Request<object, object, z.infer<typeof LoginSchema>>,
    res: Response<z.infer<typeof MessageResponseSchema>>
  ) {
    const result = await AuthService.login(req.body);
    res.cookie(env.JWT_COOKIE_NAME, result, {
      httpOnly: true,
      domain: env.JWT_COOKIE_DOMAIN,
    });
    res.status(200).json({
      message: 'Logged in successfully.',
    });
  }

  static async me(
    req: Request,
    res: Response<z.infer<typeof MeResponseSchema>>
  ) {
    const result = await AuthService.me(req.user.id);
    res.status(200).json(result);
  }

  static async sendCode(
    req: Request<object, object, z.infer<typeof SendCodeRequestSchema>>,
    res: Response<z.infer<typeof SendCodeResponseSchema>>
  ) {
    const result = await AuthService.sendCode(req.body);
    res.status(200).json(result);
  }

  static async verifyCode(
    req: Request<object, object, z.infer<typeof VerifyCodeRequestSchema>>,
    res: Response
  ) {
    const result = await AuthService.verifyCode(req.body);
    res.status(200).json(result);
  }
}
