import { TrainingsController } from '../controllers/trainings.controller.ts';
import { authorize } from '../middlewares/auth.middleware.ts';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware.ts';
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
});

TrainingsRouter.post(
  '/',
  authorize('ADMIN'),
  validateBody(CreateTrainingSchema),
  TrainingsController.create
);

TrainingsRouter.get('/', authorize('USER', 'ADMIN'), TrainingsController.list);

TrainingsRouter.post(
  '/:trainingId/questions',
  authorize('ADMIN'),
  validateParams(TrainingIdParamSchema),
  validateBody(AddQuestionSchema),
  TrainingsController.addQuestion
);

TrainingsRouter.get(
  '/:trainingId/questions',
  authorize('USER', 'ADMIN'),
  validateParams(TrainingIdParamSchema),
  TrainingsController.getQuestions
);

export default TrainingsRouter;
