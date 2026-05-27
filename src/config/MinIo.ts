import { s3Client, S3_BUCKET } from './s3.js';
import { CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

export async function initBucket() {
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
    console.log(`✅ Bucket '${S3_BUCKET}' created`);
  } catch (error: any) {
    // Bucket already exists or other error
    if (error.name === 'BucketAlreadyOwnedByYou' || error.$metadata?.httpStatusCode === 409) {
      console.log(`✅ Bucket '${S3_BUCKET}' already exists`);
    } else {
      console.warn(`⚠️ Could not ensure bucket exists: ${error.message}`);
    }
  }
}