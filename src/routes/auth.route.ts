import { authController } from '../controllers/auth.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import {
  RegisterRequestSchema,
  LoginSchema,
  SendCodeRequestSchema,
  VerifyCodeRequestSchema,
} from '../utils/schema.util.js';
import { Router } from 'express';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(RegisterRequestSchema),
  authController.register
);

authRouter.post('/login', validateBody(LoginSchema), authController.login);

authRouter.post(
  '/send',
  validateBody(SendCodeRequestSchema),
  authController.sendCode
);

authRouter.post(
  '/verify',
  validateBody(VerifyCodeRequestSchema),
  authController.verifyCode
);

authRouter.get('/me', authorize(ROLE.ADMIN, ROLE.USER), authController.me);
