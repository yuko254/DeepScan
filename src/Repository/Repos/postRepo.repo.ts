<<<<<<< HEAD
import { posts } from '@prisma/client';
=======
import { ContentType } from '@prisma/client';
>>>>>>> dev
import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostRepo extends BaseRepository<typeof prisma.posts> {
  constructor() {
    super(prisma.posts, 'posts', 'content_id');
  }

  private includeDetails = {
    content: { include: { user: { include: { profile: true } } } },
    category: true,
    location: { include: { city: true, country: true } },
    postTags: { include: { tag: true } }
  }

  async findByCategory(category_id: number) {
<<<<<<< HEAD
    return await this.model.findMany({
=======
    return this.model.findMany({
>>>>>>> dev
      where: { category_id },
      include: this.includeDetails,
      orderBy: { content: { created_at: 'desc' } },
    });
  }

  async findPost(content_id: string) {
<<<<<<< HEAD
    return await this.model.findUnique({
=======
    return this.model.findUnique({
>>>>>>> dev
      where: { content_id },
      include: this.includeDetails
    });
  }

  async findUserPosts(user_id: string, limit: number, cursor?: Date) {
    const posts = await this.model.findMany({
      where: {
        content: { user_id },
        ...(cursor && { content: { created_at: { lt: cursor } } })
      },
      include: this.includeDetails,
      orderBy: { content: { created_at: 'desc' } },
      take: limit
    });

    const nextCursor = posts.length === limit
      ? posts[posts.length - 1]?.content?.created_at
      : null;

    return { posts, nextCursor };
  }

  async findFeedPosts(ownerIds: string[], cursor?: Date, limit = 50) {
    let where: any = {
      content: {
        is_deleted: false,
        ...(cursor && { created_at: { lt: cursor } })
      }
    };

    if (ownerIds.length === 0) {
<<<<<<< HEAD
      where.content.visibility = 'public';
    } else {
      where.OR = [
        { content: { user_id: { in: ownerIds } } },
        { content: { visibility: 'public' } }
=======
      where.content.is_private = false;
    }
    else {
      where.OR = [
        { content: { user_id: { in: ownerIds } } },
        { content: { is_private: false } }
>>>>>>> dev
      ];
    }

    const posts = await this.model.findMany({
      where,
      include: this.includeDetails,
      orderBy: { content: { created_at: 'desc' } },
      take: limit
    });

<<<<<<< HEAD
    // Get next cursor from last item
=======
>>>>>>> dev
    const nextCursor = posts.length === limit
      ? posts[posts.length - 1]?.content?.created_at
      : null;

    return { posts, nextCursor };
  }

<<<<<<< HEAD
  async countByUser(user_id: string) {
    return this.model.count({ where: { content: { user_id } } });
=======
  async countByUser(user_id: string, isOwner: boolean) {
    return this.model.count({
      where: {
        content: {
          user_id,
          type: 'post',
          is_deleted: false,
          ...(isOwner ? {} : { is_private: false })
        }
      }
    });
>>>>>>> dev
  }

  async createPost(data: Prisma.postsUncheckedCreateInput) {
    return this.model.create({ data });
  }

  async updatePost(data: Prisma.postsUncheckedUpdateInput) {
    return this.model.update({
      where: { content_id: data.content_id as string },
      data,
<<<<<<< HEAD
    });
  }

  async search(query: string, take: number, skip: number) {
    return this.model.findMany({
      take,
      skip,
      where: {
        OR: [
          { text_content: { contains: query, mode: 'insensitive' } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
          {
            content: {
              user: {
                profile: {
                  OR: [
                    { first_name: { contains: query, mode: 'insensitive' } },
                    { last_name: { contains: query, mode: 'insensitive' } }
                  ]
                }
              }
            }
          }
        ],
        content: { is_deleted: false }
      },
      include: this.includeDetails,
      orderBy: { content: { created_at: 'desc' } }
    })
  }
=======
      include: this.includeDetails
    });
  }
>>>>>>> dev
}
