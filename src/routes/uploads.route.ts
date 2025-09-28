import { uploadsController } from '../controllers/uploads.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { TrainingsPresignedUrlRequestSchema } from '../utils/schema.util.js';
import { Router } from 'express';

export const uploadsRouter = Router();

uploadsRouter.post(
  '/trainings',
  authorize(ROLE.ADMIN),
  validateBody(TrainingsPresignedUrlRequestSchema),
  uploadsController.trainingsPresignedUrl
);
