import { UploadsController } from '../controllers/uploads.controller.js';
import { ROLE } from '../database/schema.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { TrainingsPresignedUrlRequestSchema } from '../utils/schema.util.js';
import { Router } from 'express';

const UploadsRouter = Router();

UploadsRouter.post(
  '/trainings',
  authorize(ROLE.ADMIN),
  validateBody(TrainingsPresignedUrlRequestSchema),
  UploadsController.trainingsPresignedUrl
);

export default UploadsRouter;
