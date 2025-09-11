import { env } from './env.js';
import AIRouter from './routes/ai.route.js';
import AuthRouter from './routes/auth.route.js';
import ExamsRouter from './routes/exams.route.js';
import TrainingsRouter from './routes/trainings.route.js';
import { HttpException } from './utils/exception.util.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.use('/v1/auth', AuthRouter);
app.use('/v1/trainings', TrainingsRouter);
app.use('/v1/ai', AIRouter);
app.use('/v1/exams', ExamsRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  if (error instanceof HttpException) {
    res.status(error.status).json({
      error: error.name,
      message: error.message,
    });
    return;
  }
  res.status(500).json({
    error: 'Something went wrong!',
    message: error.message,
  });
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
