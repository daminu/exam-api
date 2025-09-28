import { uploadsService } from '../services/uploads.service.js';
import type {
  TrainingsPresignedUrlRequestSchema,
  TrainingsPresignedUrlResponseSchema,
} from '../utils/schema.util.js';
import type { Request, Response } from 'express';
import type z from 'zod';

class UploadsController {
  async trainingsPresignedUrl(
    req: Request<
      object,
      object,
      z.infer<typeof TrainingsPresignedUrlRequestSchema>
    >,
    res: Response<z.infer<typeof TrainingsPresignedUrlResponseSchema>>
  ) {
    const result = await uploadsService.presignedUrl(req.user.id, req.body);
    res.status(200).json(result);
  }
}

export const uploadsController = new UploadsController();
