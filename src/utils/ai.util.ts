import { createPrompt } from './prompt.util.js';
import type { ModelSchema } from './schema.util.js';
import {
  AddQuestionRequestSchema,
  GenerateDescriptionResponseSchema,
} from './schema.util.js';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import type z from 'zod';

type Model = z.infer<typeof ModelSchema>;

function getModel(model: Model) {
  switch (model) {
    case 'gpt-4o-mini':
      return openai(model);
    case 'gemini-2.0-flash':
      return google('gemini-2.0-flash');
    default:
      throw new Error('Invalid model');
  }
}

export async function suggestQuestions({
  description,
  numQuestions,
  model,
}: {
  description: string;
  numQuestions: number;
  model: Model;
}) {
  const { object } = await generateObject({
    model: getModel(model),
    prompt: description,
    schema: AddQuestionRequestSchema,
    system: createPrompt({
      prompt: 'suggest-questions',
      args: { numQuestions },
    }),
    output: 'array',
  });
  return object;
}

export async function suggestDescription({
  title,
  model,
}: {
  title: string;
  model: Model;
}) {
  const { object } = await generateObject({
    model: getModel(model),
    prompt: title,
    schema: GenerateDescriptionResponseSchema,
    system: createPrompt({
      prompt: 'suggest-description',
    }),
  });
  return object;
}
