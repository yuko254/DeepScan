import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin123',
  },
  forcePathStyle: true,
});

export const S3_BUCKET = 'deepscan';