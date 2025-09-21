import { db } from '../database/connection.js';
import {
  choices,
  examQuestions,
  exams,
  questions,
  SOURCE,
  STATUS,
  temporaryUploads,
  trainings,
} from '../database/schema.js';
import { NotFoundException } from '../utils/exception.util.js';
import {
  PaginationResponse,
  type PaginationQuerySchema,
} from '../utils/pagination.util.js';
import { moveObject, objectExists } from '../utils/s3.util.js';
import type {
  CreateTrainingRequestSchema,
  AddQuestionSchema,
} from '../utils/schema.util.js';
import { count, eq, sql } from 'drizzle-orm';
import type z from 'zod';

export class TrainingsService {
  static async create(values: z.infer<typeof CreateTrainingRequestSchema>) {
    const exists = await objectExists(values.imageKey);
    if (!exists) {
      throw new NotFoundException('Please upload image first.');
    }
    const result = await db.transaction(async (tx) => {
      const [training] = await tx
        .insert(trainings)
        .values({
          title: values.title,
          description: values.description,
          imageKey: values.imageKey,
          isPublished: false,
        })
        .$returningId();
      const filename = values.imageKey.split('/').at(-1);
      const destinationKey = `trainings/${training!.id}/${filename}`;
      await moveObject(values.imageKey, destinationKey);
      await tx
        .update(trainings)
        .set({ imageKey: destinationKey })
        .where(eq(trainings.id, training!.id));
      await tx
        .delete(temporaryUploads)
        .where(eq(temporaryUploads.id, values.imageKey));
      return training;
    });

    return { id: result!.id };
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
    const questionId = await db.transaction(async (tx) => {
      const training = await tx.query.trainings.findFirst({
        where: ({ id }) => eq(id, trainingId),
      });
      if (!training) {
        throw new NotFoundException('Training not found!');
      }
      const [returning] = await tx
        .insert(questions)
        .values({
          text: values.text,
          trainingId: trainingId,
          source: SOURCE.MANUAL,
        })
        .$returningId();
      const questionId = returning!.id;
      await tx.insert(choices).values(
        values.choices.map((choice) => ({
          text: choice.text,
          isCorrect: choice.isCorrect,
          questionId,
        }))
      );
      return questionId;
    });
    const question = await db.query.questions.findFirst({
      columns: {
        id: true,
        text: true,
      },
      where: ({ id }) => eq(id, questionId),
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
    return question!;
  }

  static async getQuestions(trainingId: number) {
    const list = await db.query.questions.findMany({
      columns: {
        id: true,
        text: true,
        source: true,
      },
      where: eq(questions.trainingId, trainingId),
      with: {
        choices: {
          columns: {
            id: true,
            text: true,
            isCorrect: true,
          },
        },
      },
    });
    return list;
  }

  static async startExam(userId: number, trainingId: number) {
    const training = await db.query.trainings.findFirst({
      where: ({ id }) => eq(id, trainingId),
      columns: {
        id: true,
      },
    });
    if (!training) {
      throw new NotFoundException('Training not found!');
    }
    const result = await db.transaction(async (tx) => {
      const [returning] = await tx
        .insert(exams)
        .values({
          status: STATUS.STARTED,
          trainingId: training.id,
          userId,
        })
        .$returningId();
      const questions = await tx.query.questions.findMany({
        where: ({ trainingId }) => eq(trainingId, training.id),
        limit: 10,
        orderBy: () => sql`RAND()`,
        columns: {
          id: true,
        },
      });
      const newExamQuestions = questions.map(
        (q) =>
          ({
            examId: returning!.id,
            questionId: q.id,
          }) satisfies typeof examQuestions.$inferInsert
      );
      await tx.insert(examQuestions).values(newExamQuestions);
      return {
        examId: returning!.id,
      };
    });

    return result;
  }
}
