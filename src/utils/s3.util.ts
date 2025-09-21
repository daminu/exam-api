import { env } from '../env.js';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  NotFound,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

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
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    ChecksumSHA256: checksum,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 10 * 60 });
  return url;
}

export async function moveObject(sourceKey: string, destinationKey: string) {
  const copyCommand = new CopyObjectCommand({
    Bucket: env.S3_BUCKET,
    CopySource: `${env.S3_BUCKET}/${sourceKey}`,
    Key: destinationKey,
  });
  await s3.send(copyCommand);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: sourceKey,
  });

  await s3.send(deleteCommand);
}

export async function objectExists(key: string) {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: env.S3_BUCKET,
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
