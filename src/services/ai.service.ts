import { db } from '../database/connection.js';
import { choices, questions, SOURCE } from '../database/schema.js';
import { suggestDescription, suggestQuestions } from '../utils/ai.util.js';
import { NotFoundException } from '../utils/exception.util.js';
import type {
  GenerateQuestionsRequestSchema,
  GenerateDescriptionRequestSchema,
} from '../utils/schema.util.js';
import { eq, inArray } from 'drizzle-orm';
import type z from 'zod';

class AIService {
  async generateQuestions(
    values: z.infer<typeof GenerateQuestionsRequestSchema>
  ) {
    const suggestedQuestions = await suggestQuestions(values);
    const questionIds: number[] = [];

    const training = await db.query.trainings.findFirst({
      where: (trainingsTable) => eq(trainingsTable.id, values.trainingId),
      columns: {
        id: true,
      },
    });

    if (!training) {
      throw new NotFoundException('Training not found.');
    }

    await db.transaction(async (tx) => {
      for (const suggestedQuestion of suggestedQuestions) {
        const [returningQuestion] = await tx
          .insert(questions)
          .values({
            source: SOURCE.AI,
            text: suggestedQuestion.text,
            trainingId: training.id,
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
      orderBy: (fields, operators) => [operators.desc(fields.id)],
      with: {
        choices: {
          columns: {
            id: true,
            isCorrect: true,
            text: true,
          },
          orderBy: (fields, operators) => [operators.asc(fields.id)],
        },
      },
    });

    return insertedQuestions;
  }

  async generateDescription({
    title,
    model,
  }: z.infer<typeof GenerateDescriptionRequestSchema>) {
    return await suggestDescription({ title, model });
  }
}

export const aiService = new AIService();
