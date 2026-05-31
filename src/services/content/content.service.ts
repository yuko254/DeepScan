import { Prisma, prisma } from '../../config/prisma.js';
import { contentRepo } from '../../Repository/instances.js';
<<<<<<< HEAD
=======
import { deepClean } from "../../dtos/dto.js";
>>>>>>> dev
import * as content from "../../validations/content.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import { postService } from './post.service.js';
import { storyService } from './story.service.js';
import { scanService } from './scan.service.js';

class ContentService {

<<<<<<< HEAD
  private extractAllPostText(obj: any) {
    return Object.entries(obj.content_map)
      .filter(([key]) => key.startsWith('text'))
      .map(([, value]) => value)
      .join(' ');
=======
  private extractAllPostText(content_map: any): string | undefined | null {
    if (content_map === undefined) return undefined;

    const textValues = Object.entries(content_map)
      .filter(([key]) => key.startsWith('text'))
      .map(([, value]) => value?.toString() || '')
      .filter(Boolean)
      .join('- ');

    // If no text found or result is empty, return null
    if (textValues.length === 0) return null;

    return textValues;
>>>>>>> dev
  }

  async createContent(userId: string, input: content.ContentCreate, tx?: Prisma.TransactionClient) {
    const run = async (tx: Prisma.TransactionClient) => {
<<<<<<< HEAD
      // 1. Determine content type and create the base row
      const providedTypes = [
        input.post !== undefined,
        input.story !== undefined,
        input.scan !== undefined
      ].filter(Boolean).length;

      if (providedTypes === 0) throw new AppError.BadRequestError('At least one content type (post, story, or scan) must be provided');
      if (providedTypes > 1) throw new AppError.BadRequestError('Cannot create multiple content types at once. Provide only one of: post, story, or scan');

      const contentType = input.post ? 'post' : input.story ? 'story' : input.scan ? 'scan' : 'post';
=======
      const contentType = input.post ? 'post' : input.story ? 'story' : 'scan';

>>>>>>> dev
      const content = await contentRepo.withTx(tx).createContent({
        user_id: userId,
        content_map: input.content_map,
        type: contentType,
<<<<<<< HEAD
        visibility: input.visibility,
      });

      // 2. Delegate to child services, passing the transaction client and the generated content_id
=======
        is_private: contentType === 'scan' ? true : input.is_private,
      });

>>>>>>> dev
      if (input.post) {
        const textContent = this.extractAllPostText(input.content_map);
        const post = await postService.createPost(userId, content.content_id, input.post, textContent, tx);
        content.post = post;
      }
      if (input.story) {
<<<<<<< HEAD
        const story = await storyService.createStory(content.content_id, userId, input.story, tx);
=======
        const story = await storyService.createStory(userId, content.content_id, input.story, tx);
>>>>>>> dev
        content.story = story;
      }
      if (input.scan) {
        const scan = await scanService.createScan(content.content_id, input.scan, tx);
        content.scan = scan;
      }

      return content;
    };

    return tx ? run(tx) : prisma.$transaction(run);
  }

  async updateContent(userId: string, input: content.ContentUpdate, tx?: Prisma.TransactionClient) {
<<<<<<< HEAD
    const run = async (tx: Prisma.TransactionClient) => {
      const existing = await contentRepo.withTx(tx).findById(input.content_id);
      if (!existing) throw new AppError.NotFoundError('Content not found');
      if (existing.user_id !== userId) throw new AppError.ForbiddenError('You can only update your own content');

      // 1. Update base content fields
      const providedTypes = [
        input.post !== undefined,
        input.scan !== undefined
      ].filter(Boolean).length;

      if (providedTypes === 0) throw new AppError.BadRequestError('At least one content type (post, story, or scan) must be provided');
      if (providedTypes > 1) throw new AppError.BadRequestError('Cannot update multiple content types at once. Provide only one of: post, story, or scan');

      const content = await contentRepo.withTx(tx).updateContent({
        content_id: input.content_id,
        visibility: input.visibility,
        content_map: input.content_map
      });

      // 2. Update nested children
=======
    const data = deepClean(input);
    if (Object.keys(data).length === 0) throw new AppError.BadRequestError('No fields to update');

    const run = async (tx: Prisma.TransactionClient) => {
      const contentType = input.post ? 'post' : input.scan ? 'scan' : undefined;

      const content = await contentRepo.withTx(tx).updateContent({
        content_id: input.content_id,
        is_private: contentType === 'scan' ? true : input.is_private,
        content_map: input.content_map
      });
      if (content.type === 'scan' && !content.is_private) throw new AppError.BadRequestError('Scans must be private');

>>>>>>> dev
      if (input.post) {
        const textContent = this.extractAllPostText(input.content_map);
        const post = await postService.updatePost(userId, input.post, textContent, tx);
        content.post = post;
      }
      if (input.scan) {
        const scan = await scanService.updateScan(userId, input.scan, tx);
        content.scan = scan;
      }

      return content;
    };

    return tx ? run(tx) : prisma.$transaction(run);
  }

  async deleteContent(userId: string, contentId: string,) {
    const existing = await contentRepo.findById(contentId);

    if (!existing) throw new AppError.NotFoundError('Content not found');
    if (existing.user_id !== userId) throw new AppError.ForbiddenError('You can only delete your own content');

    await contentRepo.deleteById(contentId);
  }
}

export const contentService = new ContentService()