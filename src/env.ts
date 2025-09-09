import 'dotenv/config';
import z from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['LOCAL', 'PROD']).default('LOCAL'),

  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string().default('localhost'),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().positive().default(3306),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),

  SALT_ROUND: z.coerce.number().min(8).max(20).default(10),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_COOKIE_NAME: z.string(),

  S3_REGION: z.string(),
  S3_BUCKET: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),

  OPENAI_API_KEY: z.string(),
});

let env: z.infer<typeof EnvSchema>;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(JSON.stringify(z.treeifyError(error).errors, null, 2));

    error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      console.error(`  ${path}: ${issue.message}`);
    });

    process.exit(1);
  }
  throw error;
}

export { env };
