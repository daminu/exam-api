import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createTemplate(promptPath: string) {
  const txt = readFileSync(
    path.join(__dirname, '../prompts/' + promptPath),
    'utf-8'
  );
  return Handlebars.compile(txt);
}

const templates = {
  'suggest-questions': {
    template: createTemplate('suggest-question-prompt.txt'),
    args: { numQuestions: 1 as number },
  },
} as const;

type Arguments = {
  [K in keyof typeof templates]: (typeof templates)[K]['args'];
};

export function createPrompt<T extends keyof Arguments>(options: {
  prompt: T;
  args: Arguments[T];
}) {
  return templates[options.prompt].template(options.args);
}
