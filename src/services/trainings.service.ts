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
import { getFileUrl, moveObject, objectExists } from '../utils/r2.util.js';
import type {
  CreateTrainingRequestSchema,
  AddQuestionRequestSchema,
  EditQuestionRequestSchema,
} from '../utils/schema.util.js';
import { count, eq, inArray, sql } from 'drizzle-orm';
import type z from 'zod';

class TrainingsService {
  async create(values: z.infer<typeof CreateTrainingRequestSchema>) {
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

  async list(query: z.infer<typeof PaginationQuerySchema>) {
    const items = await db.query.trainings.findMany({
      limit: query.limit,
      offset: query.offset,
      columns: {
        id: true,
        title: true,
        imageKey: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const [result] = await db.select({ total: count() }).from(trainings);

    const list = items.map(
      ({ id, title, imageKey, isPublished, createdAt, updatedAt }) => ({
        id,
        title,
        imageUrl: getFileUrl(imageKey),
        isPublished,
        createdAt,
        updatedAt,
      })
    );

    return new PaginationResponse({
      items: list,
      total: result!.total,
      size: items.length,
    });
  }

  async getById(id: number) {
    const training = await db.query.trainings.findFirst({
      columns: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        imageKey: true,
        isPublished: true,
      },
      where: (trainingsTable) => eq(trainingsTable.id, id),
    });

    if (!training) {
      throw new NotFoundException('Training not found');
    }

    const result = {
      id: training.id,
      title: training.title,
      description: training.description,
      createdAt: training.createdAt,
      updatedAt: training.updatedAt,
      imageUrl: getFileUrl(training.imageKey),
      isPublished: training.isPublished,
    };

    return result;
  }

  async addQuestion(
    trainingId: number,
    values: z.infer<typeof AddQuestionRequestSchema>
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
        source: true,
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

  async editQuestion(
    params: { trainingId: number; questionId: number },
    values: z.infer<typeof EditQuestionRequestSchema>
  ) {
    const question = await db.query.questions.findFirst({
      columns: {
        id: true,
      },
      where: (fields, operators) =>
        operators.and(
          operators.eq(fields.id, params.questionId),
          operators.eq(fields.trainingId, params.trainingId)
        ),
      with: {
        choices: {
          columns: {
            id: true,
          },
        },
      },
    });
    if (!question) {
      throw new NotFoundException('Question not found.');
    }
    await db.transaction(async (tx) => {
      const choiceIds = question.choices.map((c) => c.id);
      await tx
        .update(choices)
        .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
        .where(inArray(choices.id, choiceIds));
      const v = values.choices.map((c) => ({
        questionId: question.id,
        text: c.text,
        isCorrect: c.isCorrect,
      }));
      await tx.insert(choices).values(v);
      await tx
        .update(questions)
        .set({ text: values.text })
        .where(eq(questions.id, question.id));
    });

    const editedQuestion = await db.query.questions.findFirst({
      columns: {
        id: true,
        text: true,
        source: true,
      },
      where: (fields, operators) => operators.eq(fields.id, question.id),
      with: {
        choices: {
          columns: {
            id: true,
            text: true,
            isCorrect: true,
          },
          orderBy: (fields, operators) => [operators.asc(fields.id)],
        },
      },
    });

    return editedQuestion!;
  }

  async getQuestions(trainingId: number) {
    const list = await db.query.questions.findMany({
      columns: {
        id: true,
        text: true,
        source: true,
      },
      where: (fields, operators) =>
        operators.and(
          operators.eq(fields.trainingId, trainingId),
          operators.isNull(fields.deletedAt)
        ),
      orderBy: (fields, operators) => [operators.desc(fields.id)],
      with: {
        choices: {
          columns: {
            id: true,
            text: true,
            isCorrect: true,
          },
          orderBy: (fields, operators) => [operators.asc(fields.id)],
        },
      },
    });
    return list;
  }

  async startExam(userId: number, trainingId: number) {
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

export const trainingsService = new TrainingsService();
