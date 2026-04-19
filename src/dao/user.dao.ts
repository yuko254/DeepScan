import { Prisma, type users } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class UserDao extends BaseDao<
  users,
  Prisma.usersCreateInput,
  Prisma.usersUpdateInput,
  Prisma.usersWhereUniqueInput
> {
  constructor() {
    super(prisma.users);
  }

  async findByUsername(username: string): Promise<users | null> {
    return prisma.users.findUnique({ where: { username } });
  }

  async findByEmail(email: string): Promise<users | null> {
    return prisma.users.findUnique({ where: { email } });
  }

  async findWithProfile(user_id: string): Promise<users | null> {
    return prisma.users.findUnique({
      where: { user_id },
      include: { profiles: true },
    });
  }

  async findWithFullProfile(user_id: string) {
    return prisma.users.findUnique({
      where: { user_id },
      include: {
        profiles: { include: { 
          locations_profiles_birth_locationTolocations: true,
          locations_profiles_current_locationTolocations: true 
        }},
        roles: true,
      },
    });
  }

  async findWithPosts(user_id: string): Promise<users | null> {
    return prisma.users.findUnique({
      where: { user_id },
      include: { posts: true },
    });
  }
}
