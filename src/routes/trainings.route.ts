import { TrainingsController } from '../controllers/trainings.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware.js';
import { Router } from 'express';
import z from 'zod';

const TrainingsRouter = Router();

export const CreateTrainingSchema = z.object({
  title: z.string().min(4).max(64),
  description: z.string().min(8).max(65535),
  imageKey: z.string(),
});

export const TrainingIdParamSchema = z.object({
  trainingId: z.coerce.number(),
});

export const AddQuestionSchema = z.object({
  text: z.string().min(1).max(1024),
  choices: z
    .array(
      z.object({
        text: z.string().max(1024).min(1),
        isCorrect: z.boolean(),
      })
    )
    .min(2, { message: 'There must be at least two choices' })
    .refine((choices) => choices.filter((c) => c.isCorrect).length === 1, {
      message: 'There must be exactly one correct choice',
    })
    .refine((choices) => choices.filter((c) => !c.isCorrect).length >= 1, {
      message: 'There must be at least one incorrect choice',
    })
    .refine((choices) => choices.filter((c) => !c.isCorrect).length <= 5, {
      message: 'There can be at most five incorrect choices',
    })
    .refine(
      (choices) =>
        new Set(choices.map((c) => c.text.trim().toLowerCase())).size ===
        choices.length,
      {
        message: 'Each choice must have a unique text',
      }
    ),
});

TrainingsRouter.post(
  '/',
  authorize(ROLE.ADMIN),
  validateBody(CreateTrainingSchema),
  TrainingsController.create
);

TrainingsRouter.get('/', authorize(ROLE.ADMIN), TrainingsController.list);

TrainingsRouter.post(
  '/:trainingId/questions',
  authorize(ROLE.ADMIN),
  validateParams(TrainingIdParamSchema),
  validateBody(AddQuestionSchema),
  TrainingsController.addQuestion
);

TrainingsRouter.get(
  '/:trainingId/questions',
  authorize(ROLE.USER, ROLE.ADMIN),
  validateParams(TrainingIdParamSchema),
  TrainingsController.getQuestions
);

export default TrainingsRouter;
