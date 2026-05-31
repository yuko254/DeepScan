import { Prisma, prisma } from '../../config/prisma.js';
import { contentRepo } from '../../Repository/instances.js';
import { deepClean } from "../../dtos/dto.js";
import * as content from "../../validations/content.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import { postService } from './post.service.js';
import { storyService } from './story.service.js';
import { scanService } from './scan.service.js';

class ContentService {

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
  }

  async createContent(userId: string, input: content.ContentCreate, tx?: Prisma.TransactionClient) {
    const run = async (tx: Prisma.TransactionClient) => {
      const contentType = input.post ? 'post' : input.story ? 'story' : 'scan';

      const content = await contentRepo.withTx(tx).createContent({
        user_id: userId,
        content_map: input.content_map,
        type: contentType,
        is_private: contentType === 'scan' ? true : input.is_private,
      });

      if (input.post) {
        const textContent = this.extractAllPostText(input.content_map);
        const post = await postService.createPost(userId, content.content_id, input.post, textContent, tx);
        content.post = post;
      }
      if (input.story) {
        const story = await storyService.createStory(userId, content.content_id, input.story, tx);
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