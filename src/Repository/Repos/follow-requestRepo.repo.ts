import { FollowRequestStatus } from "@prisma/client";
import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class FollowRequestRepo extends BaseRepository<typeof prisma.follow_requests> {
  constructor() {
    super(prisma.follow_requests, 'follow_requests', undefined);
  }

  override async findById(): Promise<never> {
    throw new Error('FollowRequestRepo does not support findById — use findUnique with composite key { requester_id, target_id }');
  }

  async findRequest(requester_id: string, target_id: string) {
    return this.model.findUnique({
      where: { requester_id_target_id: { requester_id, target_id } },
    });
  }

  async request(requester_id: string, target_id: string) {
    return this.model.create({
      data: { requester_id, target_id },
    });
  }

  async cancel(requester_id: string, target_id: string) {
    return this.model.delete({
      where: { requester_id_target_id: { requester_id, target_id } },
    });
  }

  async accept(requester_id: string, target_id: string) {
    return this.model.update({
      where: { requester_id_target_id: { requester_id, target_id } },
      data: { status: FollowRequestStatus.accepted },
    });
  }

  async reject(requester_id: string, target_id: string) {
    return this.model.update({
      where: { requester_id_target_id: { requester_id, target_id } },
      data: { status: FollowRequestStatus.rejected },
    });
  }

  async findIncomingRequests(target_id: string, limit: number, cursor?: Date) {
    const where: Prisma.follow_requestsWhereInput = {
      target_id,
      status: FollowRequestStatus.pending,
      ...(cursor && { created_at: { lt: cursor } })
    };

    const requests = await this.model.findMany({
      take: limit,
      where,
      include: { requester: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
    });

    const nextCursor = requests.length === limit
      ? requests[requests.length - 1]?.created_at
      : null;

    return { requests, nextCursor };
  }

  async findOutgoingRequests(requester_id: string, limit: number, cursor?: Date) {
    const where: Prisma.follow_requestsWhereInput = {
      requester_id,
      status: FollowRequestStatus.pending,
      ...(cursor && { created_at: { lt: cursor } })
    };

    const requests = await this.model.findMany({
      take: limit,
      where,
      include: { target: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
    });

    const nextCursor = requests.length === limit
      ? requests[requests.length - 1]?.created_at
      : null;

    return { requests, nextCursor };
  }

  async findPendingForUser(target_id: string) {
    return this.model.findMany({
      where: { target_id, status: FollowRequestStatus.pending },
      include: { requester: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async findSentByUser(requester_id: string) {
    return this.model.findMany({
      where: { requester_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async exists(requester_id: string, target_id: string) {
    const req = await this.model.findUnique({
      where: { requester_id_target_id: { requester_id, target_id } },
    });
    return req !== null;
  }

  async getStatus(requester_id: string, target_id: string) {
    const req = await this.model.findUnique({
      where: { requester_id_target_id: { requester_id, target_id } },
    });
    return req?.status ?? null;
  }

  async deleteBoth(user_id_a: string, user_id_b: string) {
    return this.model.deleteMany({
      where: {
        OR: [
          { requester_id: user_id_a, target_id: user_id_b },
          { requester_id: user_id_b, target_id: user_id_a }
        ]
      }
    });
  }
}
