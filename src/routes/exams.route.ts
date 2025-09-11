import { ExamsController } from '../controllers/exams.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware.js';
import {
  ExamIdParamSchema,
  ExamQuestionIdParamSchema,
  SubmitQuestionSchema,
} from '../utils/schema.util.js';
import { Router } from 'express';

const ExamsRouter = Router();

ExamsRouter.get(
  '/:examId',
  authorize(ROLE.USER),
  validateParams(ExamIdParamSchema),
  ExamsController.getExam
);

ExamsRouter.put(
  '/:examId/questions/:examQuestionId/submit',
  authorize(ROLE.USER),
  validateParams(ExamQuestionIdParamSchema),
  validateBody(SubmitQuestionSchema),
  ExamsController.submitQuestion
);

ExamsRouter.post(
  '/:examId/end',
  authorize(ROLE.USER),
  validateParams(ExamIdParamSchema),
  ExamsController.endExam
);

export default ExamsRouter;
