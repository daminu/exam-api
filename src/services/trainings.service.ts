import { db } from '../database/connection.ts';
import { questions, trainings } from '../database/schema.ts';
import type {
  AddQuestionSchema,
  CreateTrainingSchema,
} from '../routes/trainings.route.ts';
import { NotFoundException } from '@/utils/exception.util.ts';
import {
  PaginationResponse,
  type PaginationQuerySchema,
} from '@/utils/pagination.util.ts';
import { count, eq } from 'drizzle-orm';
import type z from 'zod';

export class TrainingsService {
  static async create(values: z.infer<typeof CreateTrainingSchema>) {
    const result = await db
      .insert(trainings)
      .values({
        title: values.title,
        description: values.description,
        imageKey: values.imageKey,
        isPublished: false,
      })
      .$returningId();
    if (!result) {
      throw new Error("Trainings id wasn't returned.");
    }
    return result[0]!;
  }

  static async list(query: z.infer<typeof PaginationQuerySchema>) {
    const items = await db.query.trainings.findMany({
      limit: query.limit,
      offset: query.offset,
      columns: {
        id: true,
        title: true,
        description: true,
        imageKey: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const [result] = await db.select({ total: count() }).from(trainings);

    return new PaginationResponse({
      items,
      total: result!.total,
      size: items.length,
    });
  }

  static async addQuestion(
    trainingId: number,
    values: z.infer<typeof AddQuestionSchema>
  ) {
    const training = await db.query.trainings.findFirst({
      where: eq(trainings.id, trainingId),
    });
    if (!training) {
      throw new NotFoundException('Training not found!');
    }
    const [result] = await db
      .insert(questions)
      .values({
        trainingId,
        text: values.text,
      })
      .$returningId();
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, result!.id),
    });
    return question!;
  }

  static async getQuestions(trainingId: number) {
    const list = await db.query.questions.findMany({
      where: eq(questions.trainingId, trainingId),
      with: {
        choices: true,
      },
    });
    return list;
  }
}
