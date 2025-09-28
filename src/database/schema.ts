import { relations } from 'drizzle-orm';
import {
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
  boolean,
  bigint,
} from 'drizzle-orm/mysql-core';

export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum SOURCE {
  MANUAL = 'MANUAL',
  AI = 'AI',
}

export enum STATUS {
  STARTED = 'STARTED',
  ENDED = 'ENDED',
}

const createdAt = timestamp('created_at').notNull().defaultNow();
const updatedAt = timestamp('updated_at').notNull().defaultNow().onUpdateNow();
const deletedAt = timestamp('deleted_at');

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 8 }).unique(),
  createdAt,
  updatedAt,
  role: mysqlEnum('role', ROLE).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  exams: many(exams),
  vonageVerifcations: many(vonageVerifications),
}));

export const trainings = mysqlTable('trainings', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 2048 }).notNull(),
  imageKey: varchar('image_key', { length: 255 }).notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt,
  updatedAt,
  deletedAt,
});

export const trainingsRelations = relations(trainings, ({ many }) => ({
  questions: many(questions),
  exams: many(exams),
}));

export const questions = mysqlTable('questions', {
  id: serial('id').primaryKey(),
  trainingId: bigint('training_id', {
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => trainings.id),
  text: varchar('text', { length: 1024 }).notNull(),
  source: mysqlEnum('source', SOURCE).notNull(),
  createdAt,
  updatedAt,
  deletedAt,
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  training: one(trainings, {
    fields: [questions.trainingId],
    references: [trainings.id],
  }),
  choices: many(choices),
  examQuestions: many(examQuestions),
}));

export const choices = mysqlTable('choices', {
  id: serial('id').primaryKey(),
  questionId: bigint('question_id', {
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => questions.id),
  text: varchar('text', { length: 1024 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  createdAt,
  updatedAt,
  deletedAt,
});

export const choicesRelations = relations(choices, ({ one, many }) => ({
  question: one(questions, {
    fields: [choices.questionId],
    references: [questions.id],
  }),
  examQuestions: many(examQuestions),
}));

export const exams = mysqlTable('exams', {
  id: serial('id').primaryKey(),
  trainingId: bigint('training_id', {
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => trainings.id),
  userId: bigint('user_id', {
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => users.id),
  status: mysqlEnum(STATUS).notNull(),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  lastSubmittedAt: timestamp('last_submitted_at'),
  createdAt,
  updatedAt,
});

export const examsRelations = relations(exams, ({ many, one }) => ({
  examQuestions: many(examQuestions),
  training: one(trainings, {
    fields: [exams.trainingId],
    references: [trainings.id],
  }),
  user: one(users, {
    fields: [exams.userId],
    references: [users.id],
  }),
}));

export const examQuestions = mysqlTable('exam_questions', {
  id: serial('id').primaryKey(),
  examId: bigint('exam_id', {
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => exams.id),
  questionId: bigint('question_id', {
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => questions.id),
  choiceId: bigint('choice_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => choices.id),
  createdAt,
  updatedAt,
});

export const examQuestionsRelations = relations(examQuestions, ({ one }) => ({
  exam: one(exams, {
    fields: [examQuestions.examId],
    references: [exams.id],
  }),
  question: one(questions, {
    fields: [examQuestions.questionId],
    references: [questions.id],
  }),
  choice: one(choices, {
    fields: [examQuestions.choiceId],
    references: [choices.id],
  }),
}));

export const temporaryUploads = mysqlTable('temporary_uploads', {
  id: varchar('id', { length: 255 }).primaryKey(),
  createdAt,
  updatedAt,
});

export const vonageVerifications = mysqlTable('vonage_verifications', {
  requestId: varchar('request_id', { length: 255 }).primaryKey(),
  userId: bigint('user_id', {
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => users.id),
  createdAt,
  updatedAt,
});

export const vonageVerificatoinsRelations = relations(
  vonageVerifications,
  ({ one }) => ({
    user: one(users, {
      fields: [vonageVerifications.userId],
      references: [users.id],
    }),
  })
);
