import { env } from '../env.js';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  NotFound,
  PutObjectCommand,
  S3Client as R2Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const endpoint = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const r2 = new R2Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY,
    secretAccessKey: env.R2_SECRET_KEY,
  },
});

export function getFileUrl(key: string): string {
  return `https://${env.R2_DOMAIN}/${key}`;
}

export async function getPresignedUrl({
  key,
  contentType,
  checksum,
}: {
  key: string;
  contentType: string;
  checksum: string;
}) {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
    ChecksumSHA256: checksum,
  });
  const url = await getSignedUrl(r2, command, { expiresIn: 10 * 60 });
  return url;
}

export async function moveObject(sourceKey: string, destinationKey: string) {
  const copyCommand = new CopyObjectCommand({
    Bucket: env.R2_BUCKET,
    CopySource: `${env.R2_BUCKET}/${sourceKey}`,
    Key: destinationKey,
  });
  await r2.send(copyCommand);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: sourceKey,
  });

  await r2.send(deleteCommand);
}

export async function objectExists(key: string) {
  try {
    await r2.send(
      new HeadObjectCommand({
        Bucket: env.R2_BUCKET,
        Key: key,
      })
    );
    return true;
  } catch (err) {
    if (err instanceof NotFound) {
      return false;
    }
    throw err;
  }
}
