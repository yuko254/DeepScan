import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class AdminAuditRepo extends BaseRepository<typeof prisma.admin_audits> {
  constructor() {
    super(prisma.admin_audits, 'admin_audits', 'audit_id');
  }

  async log(admin_username: string | null, action: string, target_table?: string | null, target_id?: string | null, old_data?: any, new_data?: any) {
    return this.model.create({
      data: {
        admin_username: admin_username,
        action, target_table,
        target_id,
        old_data: old_data ?? null,
        new_data: new_data ?? null
      } as any
    });
  }

  async findAudit(audit_id: string) {
    return this.model.findUnique({
      where: { audit_id },
      include: { admin: { include: { profile: true } } }
    });
  }

  async getPage(limit: number, skip: number, filters?: { admin_username?: string; action?: string; target_table?: string; }) {
    const where: Prisma.admin_auditsWhereInput = {
      ...(filters?.admin_username && { admin_username: filters.admin_username }),
      ...(filters?.action && { action: filters.action }),
      ...(filters?.target_table && { target_table: filters.target_table }),
    };

    return this.model.findMany({
      take: limit,
      skip,
      where,
      include: { admin: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async countByFilters(filters?: { admin_username?: string; action?: string; target_table?: string; }) {
    const where: Prisma.admin_auditsWhereInput = {
      ...(filters?.admin_username && { admin_username: filters.admin_username }),
      ...(filters?.action && { action: filters.action }),
      ...(filters?.target_table && { target_table: filters.target_table }),
    };
    return this.model.count({ where });
  }
}