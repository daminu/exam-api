import { TrainingsController } from '../controllers/trainings.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware.js';
import {
  CreateTrainingRequestSchema,
  TrainingIdParamSchema,
  AddQuestionSchema,
} from '../utils/schema.util.js';
import { Router } from 'express';

const TrainingsRouter = Router();

TrainingsRouter.post(
  '/',
  authorize(ROLE.ADMIN),
  validateBody(CreateTrainingRequestSchema),
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

TrainingsRouter.post(
  '/:trainingId/exams',
  authorize(ROLE.USER),
  validateParams(TrainingIdParamSchema),
  TrainingsController.startExam
);

export default TrainingsRouter;
