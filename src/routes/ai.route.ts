import { AIController } from '../controllers/ai.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { GenerateQuestionSchema } from '../utils/schema.util.js';
import { Router } from 'express';

const AIRouter = Router();

AIRouter.post(
  '/questions/generate',
  authorize(ROLE.ADMIN),
  validateBody(GenerateQuestionSchema),
  AIController.generateQuestion
);

export default AIRouter;
