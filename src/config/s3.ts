import { S3Client } from '@aws-sdk/client-s3';
import * as env from "./env.js";

export const s3Client = new S3Client({
  endpoint: `http://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

export const S3_BUCKET = env.MINIO_BUCKET;