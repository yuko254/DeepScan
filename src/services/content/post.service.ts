import { Prisma, prisma } from '../../config/prisma.js';
import { postRepo, savedPostRepo, postLikeRepo, commentRepo } from '../../Repository/instances.js';
import { deepClean } from "../../dtos/dto.js";
import * as content from "../../validations/content.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import { hashtagService } from '../references/hashtag.service.js';
import { mentionService } from '../references/mention.service.js';
import { tagService } from '../references/tag.service.js';
import { locationService } from '../references/location.service.js';

class PostService {

  async getPost(postId: string, tx?: Prisma.TransactionClient) {
    const post = await postRepo.withTx(tx).findPost(postId);
    if (!post) throw new AppError.NotFoundError('Post not found');
    return post;
  }

  async getUserPosts(userId: string, limit: number, cursor?: Date) {
    return postRepo.findUserPosts(userId, limit, cursor);
  }

  async getUserSavedPosts(userId: string, limit: number, cursor?: Date) {
    return savedPostRepo.findUserSavedPosts(userId, limit, cursor);
  }

  async createPost(userId: string, contentId: string, input: content.PostCreate, textContent: string | null, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const locationId = await locationService.resolveLocation(input.location, undefined, tx);

      await postRepo.withTx(tx).createPost({
        content_id: contentId,
        category_id: input.category_id,
        text_content: textContent,
        location_id: locationId
      }).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2003') throw new AppError.NotFoundError('Category not found');
        }
        throw e;
      });

      await Promise.all([
        hashtagService.scanAndLinkForPost(contentId, textContent, tx),
        mentionService.scanAndNotifyForPost(userId, contentId, textContent, tx),
        tagService.scanAndLinkForPost(contentId, input.tagsIds, tx)
      ]);

      return this.getPost(contentId);
    });
  }

  async updatePost(userId: string, input: content.PostUpdate, textContent: string | null, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getPost(input.content_id);

    return (tx || prisma).$transaction(async (tx) => {
      const existing = await this.getPost(input.content_id, tx);
      if (!existing) throw new AppError.NotFoundError('Post not found');
      if (existing.content.user_id !== userId) throw new AppError.ForbiddenError('You can only update your own posts');

      const { location, ...post } = data

      const locationId = await locationService.resolveLocation(location, existing.location_id, tx);

      await postRepo.withTx(tx).updatePost({
        text_content: textContent,
        category_id: post.category_id,
        location_id: locationId,
      }).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2003') throw new AppError.NotFoundError('Category not found');
          if (e.code === 'P2025') throw new AppError.NotFoundError("Post not found");
        }
        throw e;
      });

      if (input.tagsIds !== undefined)
        await tx.post_tags.deleteMany({ where: { post_id: input.content_id } });

      if (textContent && textContent !== existing.text_content)
        await tx.content_hashtags.deleteMany({ where: { content_id: input.content_id } });

      await Promise.all([
        hashtagService.scanAndLinkForPost(input.content_id, textContent, tx),
        mentionService.scanAndNotifyForPost(userId, input.content_id, textContent, tx),
        tagService.scanAndLinkForPost(input.content_id, input.tagsIds, tx)
      ]);

      return this.getPost(input.content_id);
    });
  }

  async isLiked(userId: string, postId: string) {
    return postLikeRepo.isLiked(userId, postId);
  }

  async getIsLikedBatch(postIds: string[], userId: string) {
    const likedSet = await postLikeRepo.getIsLikedBatch(postIds, userId);
    return postIds.map(id => likedSet.has(id));
  }

  async toggleLike(userId: string, postId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      try {
        await postLikeRepo.withTx(tx).like(userId, postId);
        return { liked: true };
      } catch (e: any) {
        if (e.code === 'P2002') {
          await postLikeRepo.withTx(tx).unlike(userId, postId);
          return { liked: false };
        }
        throw e;
      }
    }).catch((e: any) => {
      if (e.code === 'P2003') throw new AppError.NotFoundError('Post not found');
      throw e;
    });
  }

  async getLikesCount(postId: string) {
    return postLikeRepo.getLikeCount(postId);
  }

  async getLikesCountBatch(postIds: string[]) {
    const map = await postLikeRepo.getLikeCountsBatch(postIds);
    return postIds.map(id => map.get(id) || 0);
  }

  async isSaved(userId: string, postId: string) {
    return savedPostRepo.isSaved(userId, postId);
  }

  async getIsSavedBatch(postIds: string[], userId: string) {
    const savedSet = await savedPostRepo.getIsSavedBatch(postIds, userId);
    return postIds.map(id => savedSet.has(id));
  }

  async toggleSave(userId: string, postId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      try {
        await savedPostRepo.withTx(tx).save(userId, postId);
        return { saved: true };
      } catch (e: any) {
        if (e.code === 'P2002') {
          await savedPostRepo.withTx(tx).unsave(userId, postId);
          return { saved: false };
        }
        throw e;
      }
    }).catch((e: any) => {
      if (e.code === 'P2003') throw new AppError.NotFoundError('Post not found');
      throw e;
    });
  }

  async getSaveCount(postId: string) {
    return savedPostRepo.getSaveCount(postId);
  }

  async getSaveCountsBatch(postIds: string[]) {
    const map = await savedPostRepo.getSaveCountsBatch(postIds);
    return postIds.map(id => map.get(id) || 0);
  }

  async getCommentsCount(postId: string) {
    return commentRepo.getCommentCountForPost(postId);
  }

  async getCommentCountsBatch(postIds: string[]) {
    const map = await commentRepo.getCommentCountsForPostBatch(postIds);
    return postIds.map(id => map.get(id) || 0);
  }

  async searchPosts(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const posts = await postRepo.search(query, limit, skip);
    return posts;
  }
}

export const postService = new PostService();