import { ExamsService } from '../services/exams.service.js';
import type {
  ExamIdParamSchema,
  SubmitQuestionSchema,
  ExamQuestionIdParamSchema,
} from '../utils/schema.util.js';
import type { Request, Response } from 'express';
import type z from 'zod';

export class ExamsController {
  static async getExam(req: Request<object>, res: Response) {
    const result = await ExamsService.getExam(
      (req.params as z.infer<typeof ExamIdParamSchema>).examId
    );
    res.status(200).json(result);
  }

  static async submitQuestion(
    req: Request<object, object, z.infer<typeof SubmitQuestionSchema>>,
    res: Response
  ) {
    const { examId, examQuestionId } = req.params as z.infer<
      typeof ExamQuestionIdParamSchema
    >;
    const result = await ExamsService.submitQuestion({
      choiceId: req.body.choiceId,
      userId: req.user.id,
      examId,
      examQuestionId,
    });
    res.status(200).json(result);
  }

  static async endExam(req: Request<object>, res: Response) {
    const { examId } = req.params as z.infer<typeof ExamIdParamSchema>;

    const result = await ExamsService.endExam(req.user.id, examId);
    res.status(200).json(result);
  }
}
