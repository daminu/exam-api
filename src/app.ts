import { setPayload } from './middlewares/auth.middleware.js';
import { exceptionMiddleware } from './middlewares/exception.middleware.js';
import { logMiddleware } from './middlewares/log.middleware.js';
import { requestIdMiddleware } from './middlewares/request-id.middleware.js';
import AIRouter from './routes/ai.route.js';
import AuthRouter from './routes/auth.route.js';
import ExamsRouter from './routes/exams.route.js';
import TrainingsRouter from './routes/trainings.route.js';
import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestIdMiddleware());
app.use(setPayload());
app.use(logMiddleware());

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

app.use(exceptionMiddleware());

export default app;
