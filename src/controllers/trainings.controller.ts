import { trainingsService } from '../services/trainings.service.js';
import type { PaginationQuerySchema } from '../utils/pagination.util.ts';
import type {
  CreateTrainingRequestSchema,
  AddQuestionRequestSchema,
  TrainingIdParamSchema,
  CreateTrainingResponseSchema,
  GetTrainingResponseSchema,
  GetTrainingsResponseSchema,
  AddQuestionResponseSchema,
  GetQuestionsResponseSchema,
  EditQuestionRequestSchema,
  EditQuestionResponseSchema,
  TrainingIdQuestionIdParamsSchema,
} from '../utils/schema.util.js';
import type { Request, Response } from 'express';
import type z from 'zod';

class TrainingsController {
  async create(
    req: Request<object, object, z.infer<typeof CreateTrainingRequestSchema>>,
    res: Response<z.infer<typeof CreateTrainingResponseSchema>>
  ) {
    const result = await trainingsService.create(req.body);
    res.status(201).json(result);
  }

  async list(
    req: Request<object, object, object, object>,
    res: Response<z.infer<typeof GetTrainingsResponseSchema>>
  ) {
    const result = await trainingsService.list(
      req.query as z.infer<typeof PaginationQuerySchema>
    );
    res.status(200).json(result);
  }

  async getById(
    req: Request<object>,
    res: Response<z.infer<typeof GetTrainingResponseSchema>>
  ) {
    const { trainingId } = req.params as z.infer<typeof TrainingIdParamSchema>;
    const result = await trainingsService.getById(trainingId);
    res.status(200).json(result);
  }

  async addQuestion(
    req: Request<object, object, z.infer<typeof AddQuestionRequestSchema>>,
    res: Response<z.infer<typeof AddQuestionResponseSchema>>
  ) {
    const { trainingId } = req.params as z.infer<typeof TrainingIdParamSchema>;
    const result = await trainingsService.addQuestion(trainingId, req.body);
    res.status(201).json(result);
  }

  async editQuestion(
    req: Request<object, object, z.infer<typeof EditQuestionRequestSchema>>,
    res: Response<z.infer<typeof EditQuestionResponseSchema>>
  ) {
    const { trainingId, questionId } = req.params as z.infer<
      typeof TrainingIdQuestionIdParamsSchema
    >;
    const result = await trainingsService.editQuestion(
      { trainingId, questionId },
      req.body
    );
    res.status(200).json(result);
  }

  async getQuestions(
    req: Request<object>,
    res: Response<z.infer<typeof GetQuestionsResponseSchema>>
  ) {
    const { trainingId } = req.params as z.infer<typeof TrainingIdParamSchema>;
    const result = await trainingsService.getQuestions(trainingId);
    res.status(200).json(result);
  }

  async startExam(req: Request<object>, res: Response) {
    const { trainingId } = req.params as z.infer<typeof TrainingIdParamSchema>;
    const result = await trainingsService.startExam(req.user.id, trainingId);
    res.status(201).json(result);
  }
}

export const trainingsController = new TrainingsController();
