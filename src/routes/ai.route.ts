import { AIController } from '../controllers/ai.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { Router } from 'express';
import z from 'zod';

const AIRouter = Router();

export const GenerateQuestionSchema = z.object({
  description: z.string(),
  numQuestions: z.number().min(1).max(10),
  trainingId: z.number().int().positive(),
});

AIRouter.post(
  '/questions/generate',
  authorize(ROLE.ADMIN),
  validateBody(GenerateQuestionSchema),
  AIController.generateQuestion
);

export default AIRouter;
