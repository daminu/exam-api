import { trainingsController } from '../controllers/trainings.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware.js';
import {
  CreateTrainingRequestSchema,
  TrainingIdParamSchema,
  AddQuestionRequestSchema,
  TrainingIdQuestionIdParamsSchema,
} from '../utils/schema.util.js';
import { Router } from 'express';

export const trainingsRouter = Router();

trainingsRouter.post(
  '/',
  authorize(ROLE.ADMIN),
  validateBody(CreateTrainingRequestSchema),
  trainingsController.create
);

trainingsRouter.get('/', authorize(ROLE.ADMIN), trainingsController.list);

trainingsRouter.get(
  '/:trainingId',
  authorize(ROLE.ADMIN),
  validateParams(TrainingIdParamSchema),
  trainingsController.getById
);

trainingsRouter.post(
  '/:trainingId/questions',
  authorize(ROLE.ADMIN),
  validateParams(TrainingIdParamSchema),
  validateBody(AddQuestionRequestSchema),
  trainingsController.addQuestion
);

trainingsRouter.get(
  '/:trainingId/questions',
  authorize(ROLE.ADMIN),
  trainingsController.getQuestions
);

trainingsRouter.put(
  '/:trainingId/questions/:questionId',
  authorize(ROLE.ADMIN),
  validateParams(TrainingIdQuestionIdParamsSchema),
  trainingsController.editQuestion
);

trainingsRouter.post(
  '/:trainingId/exams',
  authorize(ROLE.USER),
  validateParams(TrainingIdParamSchema),
  trainingsController.startExam
);
