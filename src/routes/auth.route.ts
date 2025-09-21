import { AuthController } from '../controllers/auth.controller.js';
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

const AuthRouter = Router();

AuthRouter.post(
  '/register',
  validateBody(RegisterRequestSchema),
  AuthController.register
);

AuthRouter.post('/login', validateBody(LoginSchema), AuthController.login);

AuthRouter.post(
  '/send',
  validateBody(SendCodeRequestSchema),
  AuthController.sendCode
);

AuthRouter.post(
  '/verify',
  validateBody(VerifyCodeRequestSchema),
  AuthController.verifyCode
);

AuthRouter.get('/me', authorize(ROLE.ADMIN, ROLE.USER), AuthController.me);

export default AuthRouter;
