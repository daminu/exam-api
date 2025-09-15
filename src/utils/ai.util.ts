import { createPrompt } from './prompt.util.js';
import { AddQuestionSchema } from './schema.util.js';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';

const model = openai('gpt-4o-mini');

export async function suggestQuestions({
  description,
  numQuestions,
}: {
  description: string;
  numQuestions: number;
}) {
  const { object } = await generateObject({
    model,
    prompt: description,
    schema: AddQuestionSchema,
    system: createPrompt({
      prompt: 'suggest-questions',
      args: { numQuestions },
    }),
    output: 'array',
  });
  return object;
}
