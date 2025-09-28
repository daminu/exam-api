import { aiService } from '../services/ai.service.js';
import type {
  GenerateDescriptionRequestSchema,
  GenerateDescriptionResponseSchema,
  GenerateQuestionsRequestSchema,
  GenerateQuestionsResponseSchema,
} from '../utils/schema.util.js';
import type { Request, Response } from 'express';
import type z from 'zod';

class AIController {
  async generateQuestions(
    req: Request<
      object,
      object,
      z.infer<typeof GenerateQuestionsRequestSchema>
    >,
    res: Response<z.infer<typeof GenerateQuestionsResponseSchema>>
  ) {
    const result = await aiService.generateQuestions(req.body);
    res.status(201).json(result);
  }

  async generateDescription(
    req: Request<
      object,
      object,
      z.infer<typeof GenerateDescriptionRequestSchema>
    >,
    res: Response<z.infer<typeof GenerateDescriptionResponseSchema>>
  ) {
    const result = await aiService.generateDescription(req.body);
    res.status(200).json(result);
  }
}

export const aiController = new AIController();
