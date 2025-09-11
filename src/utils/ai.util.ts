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
  const { object, response, request } = await generateObject({
    model,
    prompt: description,
    schema: AddQuestionSchema,
    system: createPrompt({
      prompt: 'suggest-questions',
      args: { numQuestions },
    }),
    output: 'array',
  });
  console.dir(request.body, { depth: null });
  console.log(response.body, { depth: null });
  return object;
}
