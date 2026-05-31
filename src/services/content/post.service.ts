import { Prisma, prisma } from '../../config/prisma.js';
import { postRepo, savedPostRepo, postLikeRepo, commentRepo } from '../../Repository/instances.js';
import { deepClean } from "../../dtos/dto.js";
import * as content from "../../validations/content.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import { hashtagService } from '../references/hashtag.service.js';
import { mentionService } from '../references/mention.service.js';
import { tagService } from '../references/tag.service.js';
import { locationService } from '../references/location.service.js';
import { followService } from '../interactions/follow.service.js';
import { userService } from '../users/account.service.js';
import { blockService } from '../interactions/block.service.js';

class PostService {

  filterPrivatePosts(posts: any[], currentUserId?: string): any[] {
    return posts.filter(post => {
      const isOwner = currentUserId === post.content.user_id;
      const isPrivate = post.content.is_private === true;

      // If post is private and not owner, exclude it
      if (isPrivate && !isOwner) return false;

      return true;
    });
  }

  async validatePostAccess(postOwnerId: string, currentUserId?: string) {
    const isOwner = currentUserId === postOwnerId;

    if (!isOwner) {
      const postOwner = await userService.getUser(postOwnerId);
      if (!postOwner) throw new AppError.NotFoundError('User not found');
      const isAccountPrivate = postOwner?.profile?.is_private === true;

      // Logged in but not owner
      if (currentUserId) {
        const isBlocked = await blockService.checkIfBlocked(currentUserId, postOwnerId);
        if (isBlocked) throw new AppError.ForbiddenError('You cannot view this content');

        if (isAccountPrivate) {
          const isFollowing = await followService.checkIfFollowing(currentUserId, postOwnerId);
          if (!isFollowing) throw new AppError.ForbiddenError('This account is private');
        }
      } // If no user logged in, they can only see public accounts
      else if (isAccountPrivate)
        throw new AppError.ForbiddenError('This account is private');
    }
  }

  async getPost(postId: string, tx?: Prisma.TransactionClient) {
    const post = await postRepo.withTx(tx).findPost(postId);
    if (!post) throw new AppError.NotFoundError('Post not found');
    return post;
  }

  async getUserPosts(userId: string, limit: number, cursor?: Date) {
    return postRepo.findUserPosts(userId, limit, cursor);
  }

  async getUserPostsCount(userId: string, isOwner = false) {
    return postRepo.countByUser(userId, isOwner);
  }

  async getUserSavedPosts(userId: string, limit: number, cursor?: Date) {
    return savedPostRepo.findUserSavedPosts(userId, limit, cursor);
  }

  async createPost(userId: string, contentId: string, input: content.PostCreate, textContent?: string | null, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const locationId = await locationService.resolveLocation(input.location, undefined, tx);
      const postTextContent = textContent ?? "";

      await postRepo.withTx(tx).createPost({
        content_id: contentId,
        category_id: input.category_id,
        text_content: postTextContent,
        location_id: locationId
      }).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2003') throw new AppError.NotFoundError('Category not found');
        }
        throw e;
      });

      await Promise.all([
        hashtagService.scanAndLinkForPost(contentId, postTextContent, tx),
        mentionService.scanAndNotifyForPost(userId, contentId, postTextContent, tx),
        tagService.scanAndLinkForPost(contentId, input.tagsIds, tx)
      ]);

      return this.getPost(contentId, tx);
    });
  }

  async updatePost(userId: string, input: content.PostUpdate, textContent?: string | null, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getPost(input.content_id, tx);

    return (tx || prisma).$transaction(async (tx) => {
      const existing = await this.getPost(input.content_id, tx);
      if (!existing) throw new AppError.NotFoundError('Post not found');
      if (existing.content.user_id !== userId) throw new AppError.ForbiddenError('You can only update your own posts');

      const { location, ...post } = data
      const locationId = await locationService.resolveLocation(location, existing.location_id, tx);
      const postTextContent = textContent === undefined ? undefined : textContent === null ? "" : textContent;

      const updatedPost = await postRepo.withTx(tx).updatePost({
        content_id: existing.content_id,
        text_content: postTextContent,
        category_id: post.category_id,
        location_id: locationId,
      }).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2003') throw new AppError.NotFoundError('Category not found');
          if (e.code === 'P2025') throw new AppError.NotFoundError("Post not found");
        }
        throw e;
      });

      const deleteTags = input.tagsIds !== undefined;
      const updateTags = deleteTags && input.tagsIds !== null && input.tagsIds!.length > 0;
      const deleteText = postTextContent !== undefined;
      const updateText = deleteText && postTextContent !== existing.text_content;

      await Promise.all([
        deleteTags ? tx.post_tags.deleteMany({ where: { post_id: input.content_id } }) : Promise.resolve(undefined),
        deleteText ? tx.content_hashtags.deleteMany({ where: { content_id: input.content_id } }) : Promise.resolve(undefined)
      ]);

      await Promise.all([
        updateText
          ? Promise.all([
            hashtagService.scanAndLinkForPost(input.content_id, postTextContent!, tx),
            mentionService.scanAndNotifyForPost(userId, input.content_id, postTextContent!, tx)
          ])
          : Promise.resolve(),
        updateTags ? tagService.scanAndLinkForPost(input.content_id, input.tagsIds, tx) : Promise.resolve(),
      ]);

      return deleteTags ? this.getPost(input.content_id, tx) : updatedPost;
    });
  }

  async isLiked(userId: string, postId: string) {
    return postLikeRepo.isLiked(userId, postId);
  }

  async getIsLikedBatch(postIds: string[], userId: string) {
    return postLikeRepo.getIsLikedBatch(postIds, userId);
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
    return postLikeRepo.getLikeCountsBatch(postIds);
  }

  async isSaved(userId: string, postId: string) {
    return savedPostRepo.isSaved(userId, postId);
  }

  async getIsSavedBatch(postIds: string[], userId: string) {
    return savedPostRepo.getIsSavedBatch(postIds, userId);
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
    return savedPostRepo.getSaveCountsBatch(postIds);
  }

  async getCommentsCount(postId: string) {
    return commentRepo.getCommentCountForPost(postId);
  }

  async getCommentCountsBatch(postIds: string[]) {
    return commentRepo.getCommentCountsForPostBatch(postIds);
  }
}

export const postService = new PostService();