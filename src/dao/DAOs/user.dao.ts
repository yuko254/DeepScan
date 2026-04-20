import { Prisma, type users } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
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

  async findWithRole(user_id: string) {
    return prisma.users.findUnique({
      where: { user_id },
      include: { roles: true },
    });
  }

  async findWithProfile(user_id: string) {
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

  async findWithPosts(user_id: string) {
    return prisma.users.findUnique({
      where: { user_id },
      include: { posts: true },
    });
  }
}
