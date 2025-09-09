import { db } from '../database/connection.js';
import { choices, questions, SOURCE } from '../database/schema.js';
import type { GenerateQuestionSchema } from '../routes/ai.route.ts';
import { suggestQuestions } from '../utils/ai.util.js';
import { inArray } from 'drizzle-orm';
import type z from 'zod';

export class AIService {
  static async generateQuestions(
    values: z.infer<typeof GenerateQuestionSchema>
  ) {
    const suggestedQuestions = await suggestQuestions(values);
    const questionIds: number[] = [];

    await db.transaction(async (tx) => {
      for (const suggestedQuestion of suggestedQuestions) {
        const [returningQuestion] = await tx
          .insert(questions)
          .values({
            source: SOURCE.AI,
            text: suggestedQuestion.text,
            trainingId: values.trainingId,
          })
          .$returningId();
        const questionId = returningQuestion!.id;
        const newChoices = suggestedQuestion.choices.map((c) => ({
          questionId,
          text: c.text,
          isCorrect: c.isCorrect,
        }));
        await tx.insert(choices).values(newChoices);
        questionIds.push(questionId);
      }
    });

    const insertedQuestions = db.query.questions.findMany({
      where: ({ id }) => inArray(id, questionIds),
      columns: {
        id: true,
        source: true,
        text: true,
      },
      with: {
        choices: {
          columns: {
            id: true,
            isCorrect: true,
            text: true,
          },
        },
      },
    });

    return insertedQuestions;
  }
}
