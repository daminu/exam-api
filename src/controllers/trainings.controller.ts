import { TrainingsService } from '../services/trainings.service.js';
import type { PaginationQuerySchema } from '../utils/pagination.util.ts';
import type {
  CreateTrainingSchema,
  AddQuestionSchema,
  TrainingIdParamSchema,
} from '../utils/schema.util.js';
import type { Request, Response } from 'express';
import type z from 'zod';

export class TrainingsController {
  static async create(
    req: Request<object, object, z.infer<typeof CreateTrainingSchema>>,
    res: Response
  ) {
    const result = await TrainingsService.create(req.body);
    res.status(201).json(result);
  }

  static async list(
    req: Request<object, object, object, object>,
    res: Response
  ) {
    const result = await TrainingsService.list(
      req.query as z.infer<typeof PaginationQuerySchema>
    );
    res.status(200).json(result);
  }

  static async addQuestion(
    req: Request<object, object, z.infer<typeof AddQuestionSchema>>,
    res: Response
  ) {
    const result = await TrainingsService.addQuestion(
      (req.params as z.infer<typeof TrainingIdParamSchema>).trainingId,
      req.body
    );
    res.status(201).json(result);
  }

  static async getQuestions(req: Request<object>, res: Response) {
    const result = await TrainingsService.getQuestions(
      (req.params as z.infer<typeof TrainingIdParamSchema>).trainingId
    );
    res.status(200).json(result);
  }

  static async startExam(req: Request<object>, res: Response) {
    const result = await TrainingsService.startExam(
      req.user.id,
      (req.params as z.infer<typeof TrainingIdParamSchema>).trainingId
    );
    res.status(201).json(result);
  }
}
