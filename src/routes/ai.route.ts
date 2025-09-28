import { aiController } from '../controllers/ai.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import {
  GenerateQuestionsRequestSchema,
  GenerateDescriptionRequestSchema,
} from '../utils/schema.util.js';
import { Router } from 'express';

export const aiRouter = Router();

aiRouter.post(
  '/questions/generate',
  authorize(ROLE.ADMIN),
  validateBody(GenerateQuestionsRequestSchema),
  aiController.generateQuestions
);

aiRouter.post(
  '/description/generate',
  authorize(ROLE.ADMIN),
  validateBody(GenerateDescriptionRequestSchema),
  aiController.generateDescription
);
