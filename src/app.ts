import { document } from './document.js';
import { env } from './env.js';
import { setPayload } from './middlewares/auth.middleware.js';
import { exceptionMiddleware } from './middlewares/exception.middleware.js';
import { logMiddleware } from './middlewares/log.middleware.js';
import { requestIdMiddleware } from './middlewares/request-id.middleware.js';
import AIRouter from './routes/ai.route.js';
import AuthRouter from './routes/auth.route.js';
import ExamsRouter from './routes/exams.route.js';
import TrainingsRouter from './routes/trainings.route.js';
import UploadsRouter from './routes/uploads.route.js';
import type { HealthResponseSchema } from './utils/schema.util.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import type z from 'zod';

const app = express();
app.use(
  cors({
    credentials: true,
    origin: env.ORIGINS,
  })
);
app.use(express.json({ limit: '300kb' }));
app.use(express.urlencoded({ extended: true, limit: '300kb' }));
app.use(cookieParser());

app.use(requestIdMiddleware());
app.use(setPayload());
app.use(logMiddleware());

// @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
app.use('/docs', swaggerUi.serve, swaggerUi.setup(document));
app.get('/docs-json', (_req, res) => res.json(document));

app.get(
  '/health',
  (_req, res: Response<z.infer<typeof HealthResponseSchema>>) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date(),
    });
  }
);

app.use('/v1/auth', AuthRouter);
app.use('/v1/trainings', TrainingsRouter);
app.use('/v1/ai', AIRouter);
app.use('/v1/exams', ExamsRouter);
app.use('/v1/uploads', UploadsRouter);

app.use(exceptionMiddleware());

export default app;
