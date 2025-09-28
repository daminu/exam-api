import { MAX_TRAINING_IMAGE_FILE_SIZE } from '../constants.js';
import { ROLE, SOURCE } from '../database/schema.js';
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

export const RegisterRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const SendCodeRequestSchema = z.object({
  phoneNumber: z.string().regex(/^[0-9]{8}$/, 'Phone number must be 8 digits.'),
});

export const SendCodeResponseSchema = z.object({
  requestId: z.string(),
});

export const VerifyCodeRequestSchema = z.object({
  requestId: z.string(),
  phoneNumber: z.string().regex(/^[0-9]{8}$/, 'Phone number must be 8 digits.'),
  code: z
    .string()
    .regex(/^[0-9]{6}$/, 'The confirmation code must be 6 digits.'),
});

export const MeResponseSchema = z.object({
  id: z.number().meta({ examples: [123] }),
  email: z.email().meta({ examples: ['user@email.com'] }),
  role: z.enum(ROLE),
});

export const CreateTrainingRequestSchema = z.object({
  title: z.string().min(4).max(64),
  description: z.string().min(8).max(2048),
  imageKey: z.string(),
});

export const CreateTrainingResponseSchema = z.object({ id: z.number() });

export const GetTrainingResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  imageUrl: z.string(),
  isPublished: z.boolean(),
});

export const GetTrainingsResponseSchema = z.object({
  items: z.array(GetTrainingResponseSchema.omit({ description: true })),
  total: z.number(),
  size: z.number(),
});

export const TrainingIdParamSchema = z.object({
  trainingId: z.coerce.number(),
});

export const TrainingIdQuestionIdParamsSchema = TrainingIdParamSchema.extend({
  questionId: z.coerce.number(),
});

export const AddQuestionRequestSchema = z.object({
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

export const AddQuestionResponseSchema = z.object({
  id: z.number(),
  text: z.string(),
  source: z.enum(SOURCE),
  choices: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
      isCorrect: z.boolean(),
    })
  ),
});

export const EditQuestionRequestSchema = AddQuestionRequestSchema;
export const EditQuestionResponseSchema = AddQuestionResponseSchema;

export const GetQuestionsResponseSchema = z.array(AddQuestionResponseSchema);

export const ModelSchema = z.enum(['gpt-4o-mini', 'gemini-2.0-flash']);

export const GenerateQuestionsRequestSchema = z.object({
  model: ModelSchema,
  description: z.string(),
  numQuestions: z.number().min(1).max(10),
  trainingId: z.number().int().positive(),
});

export const GenerateQuestionsResponseSchema = z.array(
  AddQuestionResponseSchema
);

export const GenerateDescriptionRequestSchema = z.object({
  model: ModelSchema,
  title: z.string().max(255),
});

export const GenerateDescriptionResponseSchema = z.object({
  description: z.string().max(2048),
});

export const TrainingsPresignedUrlRequestSchema = z.object({
  contentType: z.enum(['image/png', 'image/jpeg', 'image/webp']),
  checksum: z.string().length(64),
  fileSizeInBytes: z.number().max(MAX_TRAINING_IMAGE_FILE_SIZE),
});

export const TrainingsPresignedUrlResponseSchema = z.object({
  uploadUrl: z.url(),
  imageKey: z.string(),
});

export const HealthResponseSchema = z.object({
  status: z.literal('OK'),
  timestamp: z.date(),
});

export const MessageResponseSchema = z.object({
  message: z.string(),
});
