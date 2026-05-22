import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET } from '../config/s3.js';
import { Prisma, prisma } from '../config/prisma.js';
import crypto from 'crypto';

export class UploadService {
  private generateKey(userId: string, originalName: string): string {
    const ext = originalName.split('.').pop();
    const random = crypto.randomBytes(16).toString('hex');
    return `users/${userId}/${random}.${ext}`;
  }

  async uploadSingleFile(
    file: Express.Multer.File,
    userId: string,
    tx?: Prisma.TransactionClient
  ) {
    const key = this.generateKey(userId, file.originalname);

    await s3Client.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const url = `http://localhost:9000/${S3_BUCKET}/${key}`;

    const media = await (tx || prisma).media.create({
      data: {
        storage_path: key,
        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
      },
    });

    return {
      media_id: media.media_id,
      url,
      key,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    userId: string,
    tx?: Prisma.TransactionClient
  ) {
    return await Promise.all(
      files.map(file => this.uploadSingleFile(file, userId, tx))
    );
  }

  async deleteFile(key: string, tx?: Prisma.TransactionClient) {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    }));

    if (tx) {
      await tx.media.deleteMany({ where: { storage_path: key } });
    } else {
      await prisma.media.deleteMany({ where: { storage_path: key } });
    }

    return { success: true };
  }
}

export const uploadService = new UploadService();