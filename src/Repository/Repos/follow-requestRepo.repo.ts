import { type follow_requests, FollowRequestStatus } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class FollowRequestRepo extends BaseRepository<typeof prisma.follow_requests> {
  constructor() {
    super(prisma.follow_requests, 'follow_requests', undefined);
  }

  async findById() {
    throw new Error('FollowRequestRepo does not support findById — use findUnique with composite key { requester_id, target_id }');
  }

  async request(requester_id: string, target_id: string) {
    return this.model.create({
      data: {
        requester: { connect: { user_id: requester_id } },
        target: { connect: { user_id: target_id } },
      },
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
}
