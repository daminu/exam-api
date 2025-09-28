import { examsController } from '../controllers/exams.controller.js';
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

export const examsRouter = Router();

examsRouter.get(
  '/:examId',
  authorize(ROLE.USER),
  validateParams(ExamIdParamSchema),
  examsController.getExam
);

examsRouter.put(
  '/:examId/questions/:examQuestionId/submit',
  authorize(ROLE.USER),
  validateParams(ExamQuestionIdParamSchema),
  validateBody(SubmitQuestionSchema),
  examsController.submitQuestion
);

examsRouter.post(
  '/:examId/end',
  authorize(ROLE.USER),
  validateParams(ExamIdParamSchema),
  examsController.endExam
);
