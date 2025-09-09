import { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { Router } from 'express';
import z from 'zod';

const AuthRouter = Router();

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

AuthRouter.post(
  '/register',
  validateBody(RegisterSchema),
  AuthController.register
);

AuthRouter.post('/login', validateBody(LoginSchema), AuthController.login);

export default AuthRouter;
