import { s3Client, S3_BUCKET } from './s3.js';
import { CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';

export async function initBucket() {
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
    console.log(`✅ Bucket '${S3_BUCKET}' created`);
    await setBucketPublic();
  } catch (error: any) {
    if (error.name === 'BucketAlreadyOwnedByYou' || error.$metadata?.httpStatusCode === 409) {
      console.log(`✅ Bucket '${S3_BUCKET}' already exists`);
      await setBucketPublic(); // Ensure existing bucket is also public
    } else {
      console.warn(`⚠️ Could not ensure bucket exists: ${error.message}`);
    }
  }
}

async function setBucketPublic() {
  const publicPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${S3_BUCKET}/*`]
      }
    ]
  };

  try {
    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: S3_BUCKET,
      Policy: JSON.stringify(publicPolicy)
    }));
    console.log(`✅ Bucket '${S3_BUCKET}' is now public`);
  } catch (error: any) {
    console.warn(`⚠️ Could not set bucket policy: ${error.message}`);
  }
}