import { relations } from 'drizzle-orm';
import {
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
  text,
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

const createdAt = timestamp('created_at', { mode: 'string' })
  .notNull()
  .defaultNow();
const updatedAt = timestamp('updated_at', { mode: 'string' })
  .notNull()
  .defaultNow()
  .onUpdateNow();

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt,
  updatedAt,
  role: mysqlEnum('role', ROLE).notNull(),
});

export const trainings = mysqlTable('trainings', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  imageKey: varchar('image_key', { length: 255 }).notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt,
  updatedAt,
});

export const trainingsRelations = relations(trainings, ({ many }) => ({
  questions: many(questions),
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
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  training: one(trainings, {
    fields: [questions.trainingId],
    references: [trainings.id],
  }),
  choices: many(choices),
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
});

export const choicesRelations = relations(choices, ({ one }) => ({
  question: one(questions, {
    fields: [choices.questionId],
    references: [questions.id],
  }),
}));
