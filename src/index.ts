import { env } from './env.ts';
import AuthRouter from './routes/auth.route.ts';
import TrainingsRouter from './routes/trainings.route.ts';
import { HttpException } from './utils/exception.util.ts';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { Request, Response } from 'express';

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

app.use((error: Error, _req: Request, res: Response) => {
  if (error instanceof HttpException) {
    res.status(error.status).json({
      error: error.name,
      message: error.message,
    });
    return;
  }
  console.error(error);
  res.status(500).json({
    error: 'Something went wrong!',
    message: error.message,
  });
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
