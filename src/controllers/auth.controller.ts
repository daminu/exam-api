import { env } from '../env.js';
import { authService } from '../services/auth.service.js';
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
import ms, { type StringValue } from 'ms';
import type { z } from 'zod';

class AuthController {
  async register(
    req: Request<object, object, z.infer<typeof RegisterRequestSchema>>,
    res: Response
  ) {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }

  async login(
    req: Request<object, object, z.infer<typeof LoginSchema>>,
    res: Response<z.infer<typeof MessageResponseSchema>>
  ) {
    const result = await authService.login(req.body);
    res.cookie(env.JWT_COOKIE_NAME, result, {
      httpOnly: true,
      domain: env.JWT_COOKIE_DOMAIN,
      secure: env.NODE_ENV === 'PROD',
      maxAge: ms(env.JWT_EXPIRES_IN as StringValue),
    });
    res.status(200).json({
      message: 'Logged in successfully.',
    });
  }

  async me(req: Request, res: Response<z.infer<typeof MeResponseSchema>>) {
    const result = await authService.me(req.user.id);
    res.status(200).json(result);
  }

  async sendCode(
    req: Request<object, object, z.infer<typeof SendCodeRequestSchema>>,
    res: Response<z.infer<typeof SendCodeResponseSchema>>
  ) {
    const result = await authService.sendCode(req.body);
    res.status(200).json(result);
  }

  async verifyCode(
    req: Request<object, object, z.infer<typeof VerifyCodeRequestSchema>>,
    res: Response
  ) {
    const result = await authService.verifyCode(req.body);
    res.cookie(env.JWT_COOKIE_NAME, result, {
      httpOnly: true,
      domain: env.JWT_COOKIE_DOMAIN,
      secure: env.NODE_ENV === 'PROD',
      maxAge: ms(env.JWT_EXPIRES_IN as StringValue),
    });
    res.status(200).json(result);
  }
}

export const authController = new AuthController();
