import { examsService } from '../services/exams.service.js';
import type {
  ExamIdParamSchema,
  SubmitQuestionSchema,
  ExamQuestionIdParamSchema,
} from '../utils/schema.util.js';
import type { Request, Response } from 'express';
import type z from 'zod';

class ExamsController {
  async getExam(req: Request<object>, res: Response) {
    const result = await examsService.getExam(
      (req.params as z.infer<typeof ExamIdParamSchema>).examId
    );
    res.status(200).json(result);
  }

  async submitQuestion(
    req: Request<object, object, z.infer<typeof SubmitQuestionSchema>>,
    res: Response
  ) {
    const { examId, examQuestionId } = req.params as z.infer<
      typeof ExamQuestionIdParamSchema
    >;
    const result = await examsService.submitQuestion({
      choiceId: req.body.choiceId,
      userId: req.user.id,
      examId,
      examQuestionId,
    });
    res.status(200).json(result);
  }

  async endExam(req: Request<object>, res: Response) {
    const { examId } = req.params as z.infer<typeof ExamIdParamSchema>;

    const result = await examsService.endExam(req.user.id, examId);
    res.status(200).json(result);
  }
}

export const examsController = new ExamsController();
