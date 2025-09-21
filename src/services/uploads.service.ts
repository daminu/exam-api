import { db } from '../database/connection.js';
import { temporaryUploads } from '../database/schema.js';
import { getPresignedUrl } from '../utils/s3.util.js';
import type { TrainingsPresignedUrlRequestSchema } from '../utils/schema.util.js';
import { v4 as uuidv4 } from 'uuid';
import type z from 'zod';

export class UploadsService {
  static async presignedUrl(
    userId: number,
    {
      contentType,
      checksum,
    }: z.infer<typeof TrainingsPresignedUrlRequestSchema>
  ) {
    const extension = contentType.split('/')[1] as string;
    const key = `uploads/${userId}/${uuidv4()}.${extension}`;
    await db.insert(temporaryUploads).values({ id: key });
    const url = await getPresignedUrl({ key, contentType, checksum });

    return {
      uploadUrl: url,
      imageKey: key,
    };
  }
}
