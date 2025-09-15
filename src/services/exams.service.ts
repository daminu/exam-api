import { db } from '../database/connection.js';
import { examQuestions, exams, STATUS } from '../database/schema.js';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/exception.util.js';
import { and, eq, sql } from 'drizzle-orm';

export class ExamsService {
  static async getExam(examId: number) {
    const exam = await db.query.exams.findFirst({
      where: ({ id }) => eq(id, examId),
      columns: {
        id: true,
        status: true,
        createdAt: true,
      },
      with: {
        examQuestions: {
          columns: {
            id: true,
            choiceId: true,
          },
          with: {
            question: {
              columns: {
                id: true,
                text: true,
              },
              with: {
                choices: {
                  columns: {
                    id: true,
                    text: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!exam) {
      throw new NotFoundException('Exam not found.');
    }
    return exam;
  }

  static async submitQuestion({
    examId,
    userId,
    examQuestionId,
    choiceId,
  }: {
    examId: number;
    examQuestionId: number;
    choiceId: number;
    userId: number;
  }) {
    const exam = await db.query.exams.findFirst({
      where: (examsTable) =>
        and(eq(examsTable.userId, userId), eq(examsTable.id, examId)),
      columns: {
        id: true,
        status: true,
        lastSubmittedAt: true,
      },
    });
    if (!exam) {
      throw new NotFoundException('Exam not found!');
    }
    if (exam.status === STATUS.ENDED) {
      throw new BadRequestException('Exam already ended.');
    }
    const examQuestion = await db.query.examQuestions.findFirst({
      where: (examQuestionsTable) =>
        and(
          eq(examQuestionsTable.examId, exam.id),
          eq(examQuestionsTable.id, examQuestionId)
        ),
      columns: {
        id: true,
        questionId: true,
        choiceId: true,
      },
    });
    if (!examQuestion) {
      throw new NotFoundException('Exam question not found.');
    }
    const selectedChoice = await db.query.choices.findFirst({
      where: (choicesTable) =>
        and(
          eq(choicesTable.id, choiceId),
          eq(choicesTable.questionId, examQuestion.questionId)
        ),
      columns: {
        id: true,
      },
    });
    if (!selectedChoice) {
      throw new BadRequestException('Selected choice is not valid.');
    }
    await db.transaction(async (tx) => {
      await tx
        .update(examQuestions)
        .set({ choiceId: selectedChoice.id })
        .where(eq(examQuestions.id, examQuestion.id));
      await tx
        .update(exams)
        .set({ lastSubmittedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(exams.id, exam.id));
    });
    const result = await db.query.examQuestions.findFirst({
      where: ({ id }) => eq(id, examQuestion.id),
      columns: {
        id: true,
        choiceId: true,
        questionId: true,
      },
    });
    return result;
  }

  static async endExam(userId: number, examId: number) {
    const exam = await db.query.exams.findFirst({
      where: (examsTable) =>
        and(eq(examsTable.userId, userId), eq(examsTable.id, examId)),
      columns: {
        id: true,
        status: true,
      },
    });
    if (!exam) {
      throw new NotFoundException('Exam not found.');
    }
    if (exam.status === STATUS.ENDED) {
      throw new BadRequestException('Exam already ended.');
    }
    await db.update(exams).set({
      status: STATUS.ENDED,
      endedAt: sql`CURRENT_TIMESTAMP`,
    });
    const updatedExam = await db.query.exams.findFirst({
      where: (examsTable) =>
        and(eq(examsTable.userId, userId), eq(examsTable.id, examId)),
      columns: {
        id: true,
        status: true,
        endedAt: true,
      },
    });
    return updatedExam;
  }
}
