import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class AdminAuditRepo extends BaseRepository<typeof prisma.admin_audits> {
  constructor() {
    super(prisma.admin_audits, 'admin_audits', 'audit_id');
  }

  /**
   * Log an admin action into admin_audits table.
   * old_data and new_data can be any JSON-serializable snapshot.
   */
  async log(admin_username: string | null, action: string, target_table?: string | null, target_id?: string | null, old_data?: any, new_data?: any) {
    return this.model.create({ data: { admin_username: admin_username, action, target_table, target_id, old_data: old_data ?? null, new_data: new_data ?? null } as any });
  }
}
