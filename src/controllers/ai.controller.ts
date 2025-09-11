import { AIService } from '../services/ai.service.js';
import type { GenerateQuestionSchema } from '../utils/schema.util.js';
import type { Request, Response } from 'express';
import type z from 'zod';

export class AIController {
  static async generateQuestion(
    req: Request<object, object, z.infer<typeof GenerateQuestionSchema>>,
    res: Response
  ) {
    const result = await AIService.generateQuestions(req.body);
    res.status(201).json(result);
  }
}
