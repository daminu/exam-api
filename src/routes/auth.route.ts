import { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { RegisterSchema, LoginSchema } from '../utils/schema.util.js';
import { Router } from 'express';

const AuthRouter = Router();

AuthRouter.post(
  '/register',
  validateBody(RegisterSchema),
  AuthController.register
);

AuthRouter.post('/login', validateBody(LoginSchema), AuthController.login);

export default AuthRouter;
