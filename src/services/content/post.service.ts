import { Prisma, prisma } from '../../config/prisma.js';
import type { PostsCreateInput, PostsUpdateInput } from '../../graphql/graphql.js';
import { postRepo, contentRepo } from '../../Repository/instances.js';
import { hashtagService } from '../references/hashtag.service.js';
import { mentionService } from '../references/mention.service.js';
import { tagService } from '../references/tag.service.js';
import { locationService } from '../references/location.service.js';
import * as AppError from '../../types/appErrors.types.js';


class PostService {

  async getPost(post_id: string) {
    const post = await postRepo.findPost(post_id);
    if (!post) throw new AppError.NotFoundError('Post not found');
    return { post };
  }

  async getUserPostsPage(userID: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const posts = await postRepo.getUserPostsPage(userID, limit, skip);
    return { posts };
  }

  async getUserSavedPostsPage(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const saved = await prisma.saved_posts.findMany({
      where: { user_id: userId },
      include: { post: { include: { content: true } } },
      skip,
      take: limit,
      orderBy: { saved_at: 'desc' }
    });

    return { savedPosts: saved };
  }

  async createPost(
    contentId: string,
    input: PostsCreateInput,
    textContent: string | null,
    tx?: Prisma.TransactionClient,
  ) {
    // 1. Create the posts row
    const post = await postRepo.withTx(tx).create({
      data: {
        content_id: contentId,
        category_id: input.category_id ?? null,
        text_content: textContent,
      },
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') throw new AppError.NotFoundError('Category not found');
      }
      throw e;
    });

    // 2. Location (create new and assign)
    if (input.location) {
      const location = await locationService.createLocation(input.location, tx);
      await postRepo.withTx(tx).update({
        where: { content_id: contentId },
        data: { location_id: location.location_id },
      }).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
          throw new AppError.NotFoundError("an error occured during post creation and the operation couldn't be completed");
        }
        throw e;
      });
    }

    // 3. link tags, hashtags and mentions
    await Promise.all([
      hashtagService.scanAndLinkForPost(contentId, textContent, tx),
      mentionService.scanAndLinkForPost(contentId, textContent, tx),
      tagService.scanAndLinkForPost(contentId, input.tagsIDs, tx)
    ]);

    return post;
  }

  async updatePost(
    userID: string,
    input: PostsUpdateInput,
    textContent: string | null,
    tx?: Prisma.TransactionClient,
  ) {
    return await (tx || prisma).$transaction(async (tx) => {
      // 1. Fetch and validate ownership
      const existing = await postRepo.withTx(tx).findUnique({
        where: { content_id: input.content_id },
        include: { content: true },
      });

      if (!existing) {
        throw new AppError.NotFoundError('Post not found');
      }

      if (existing.content.user_id !== userID) {
        throw new AppError.ForbiddenError('You can only update your own posts');
      }

      // 2. Handle location - create new if provided
      let locationId = existing.location_id;
      if (input.location !== undefined) {
        if (input.location === null) {
          // Remove location if explicitly set to null
          locationId = null;
        } else {
          // Create new location
          const created = await locationService.createLocation(input.location, tx);
          locationId = created.location_id;
        }
      }

      // 3. Update post fields
      const updateData: any = {};
      if (textContent !== null) updateData.text_content = textContent;
      if (input.category_id !== undefined) updateData.category_id = input.category_id;
      if (locationId !== undefined) updateData.location_id = locationId;

      if (Object.keys(updateData).length > 0) {
        await postRepo.withTx(tx).update({
          where: { content_id: input.content_id },
          data: updateData,
        }).catch((e) => {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2003') throw new AppError.NotFoundError('Category not found');
            if (e.code === 'P2025') throw new AppError.NotFoundError("Post not found");
          }
          throw e;
        });
      }

      // 5. Handle tags - replace if provided
      if (input.tagsIDs !== undefined) {
        // Remove existing tag links
        await tx.post_tags.deleteMany({
          where: { post_id: input.content_id }
        });
      }

      // 6. Re-scan hashtags and mentions if text content changed
      if (textContent && textContent !== existing.text_content) {
        // Remove existing links
        await tx.content_hashtags.deleteMany({
          where: { content_id: input.content_id }
        });
        await tx.mentions.deleteMany({
          where: { mention_target: { post_id: input.content_id } }
        });

        // Re-scan new content
        await Promise.all([
          hashtagService.scanAndLinkForPost(input.content_id, textContent, tx),
          mentionService.scanAndLinkForPost(input.content_id, textContent, tx),
          tagService.scanAndLinkForPost(input.content_id, input.tagsIDs, tx)
        ]);
      }

      // 7. Return updated post
      return this.getPost(input.content_id);
    });
  }

  async isLiked(userID: string, postId: string): Promise<boolean> {
    const like = await prisma.post_likes.findUnique({
      where: {
        user_id_post_id: {
          user_id: userID,
          post_id: postId
        }
      }
    });
    return !!like;
  }

  async likeUnlikePost(userID: string, postId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const post = await postRepo.withTx(tx).findById(postId);
      if (!post) throw new AppError.NotFoundError('Post not found');

      const existing = await tx.post_likes.findUnique({
        where: { user_id_post_id: { user_id: userID, post_id: postId } }
      });

      let liked: boolean;
      if (existing) {
        await tx.post_likes.delete({ where: { id: existing.id } });
        liked = false;
      } else {
        await tx.post_likes.create({ data: { user_id: userID, post_id: postId } });
        liked = true;
      }
      return { liked, postId }; // ✅ Add return
    });
  }

  async isSaved(userId: string, postId: string): Promise<boolean> {
    const saved = await prisma.saved_posts.findUnique({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: postId
        }
      }
    });
    return !!saved;
  }

  async saveUnsavePost(userId: string, postId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const post = await postRepo.withTx(tx).findUnique({ where: { content_id: postId } });
      if (!post) throw new AppError.NotFoundError('Post not found');

      const existing = await tx.saved_posts.findUnique({
        where: { user_id_post_id: { user_id: userId, post_id: postId } }
      });

      let saved: boolean;
      if (existing) {
        await tx.saved_posts.delete({ where: { saved_id: existing.saved_id } });
        saved = false;
      } else {
        await tx.saved_posts.create({ data: { user_id: userId, post_id: postId } });
        saved = true;
      }
      return { saved, postId }; // ✅ Add return
    });
  }

  async searchPosts(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const posts = await prisma.posts.findMany({
      where: {
        OR: [
          { text_content: { contains: query, mode: 'insensitive' } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
          { content: { user: { username: { contains: query, mode: 'insensitive' } } } }
        ],
        content: { is_deleted: false }
      },
      include: {
        content: {
          include: {
            user: { include: { profile: true } }
          }
        },
        category: true,
        location: true,
        _count: {
          select: {
            post_likes: true,
            comments: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { content: { created_at: 'desc' } }
    });

    return { posts, total: posts.length };
  }
}

export const postService = new PostService();