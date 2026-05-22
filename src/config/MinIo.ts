import { s3Client, S3_BUCKET } from './s3.js';
import { CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

export async function initBucket() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
    console.log(`✅ Bucket '${S3_BUCKET}' already exists`);
  } catch (error: any) {
    if (error.name === 'NotFound') {
      await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
      console.log(`✅ Bucket '${S3_BUCKET}' created`);
    } else {
      console.error('Failed to check/create bucket:', error);
    }
  }
}