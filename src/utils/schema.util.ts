import z from 'zod';

export const ExamIdParamSchema = z.object({
  examId: z.coerce.number(),
});

export const ExamQuestionIdParamSchema = ExamIdParamSchema.extend({
  examQuestionId: z.coerce.number(),
});

export const SubmitQuestionSchema = z.object({
  choiceId: z.number().positive(),
});

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const CreateTrainingSchema = z.object({
  title: z.string().min(4).max(64),
  description: z.string().min(8).max(65535),
  imageKey: z.string(),
});

export const TrainingIdParamSchema = z.object({
  trainingId: z.coerce.number(),
});

export const AddQuestionSchema = z.object({
  text: z.string().min(1).max(1024),
  choices: z
    .array(
      z.object({
        text: z.string().max(1024).min(1),
        isCorrect: z.boolean(),
      })
    )
    .min(2, { message: 'There must be at least two choices' })
    .refine((choices) => choices.filter((c) => c.isCorrect).length === 1, {
      message: 'There must be exactly one correct choice',
    })
    .refine((choices) => choices.filter((c) => !c.isCorrect).length >= 1, {
      message: 'There must be at least one incorrect choice',
    })
    .refine((choices) => choices.filter((c) => !c.isCorrect).length <= 5, {
      message: 'There can be at most five incorrect choices',
    })
    .refine(
      (choices) =>
        new Set(choices.map((c) => c.text.trim().toLowerCase())).size ===
        choices.length,
      {
        message: 'Each choice must have a unique text',
      }
    ),
});

export const GenerateQuestionSchema = z.object({
  description: z.string(),
  numQuestions: z.number().min(1).max(10),
  trainingId: z.number().int().positive(),
});
