import { Prisma } from '../../config/prisma.js';
import { mentionRepo, mentionTargetRepo, userRepo } from '../../Repository/instances.js';

export class MentionService {

  private extractMentions(content: string): string[] {
    const matches = content.match(/@[\w\u0600-\u06FF]+/g) || [];
    return [...new Set(matches.map(m => m.slice(1)))];
  }

  private async linkMentions(
    usernames: string[],
    targetResolver: () => Promise<string>
  ): Promise<void> {
    if (usernames.length === 0) return;

    // 1. Get user IDs for these usernames
    const users = await userRepo.findMany({
      where: { username: { in: usernames } },
      select: { user_id: true, username: true },
    });
    if (users.length === 0) return;

    // 2. Get the mention_target_id for the target entity (comment or post)
    const mentionTargetId = await targetResolver();

    // 3. Batch create mentions (skip duplicates)
    const entries = users.map(user => ({
      mentioned_user_id: user.user_id,
      mention_target_id: mentionTargetId,
    }));
    await mentionRepo.createMany(entries, { skipDuplicates: true });
  }

  // ─── Public methods ─────────────────────────────────────────

  async scanAndLinkForComment(comment_id: string, content: string, tx?: Prisma.TransactionClient): Promise<void> {
    const usernames = this.extractMentions(content);
    await this.linkMentions(usernames, async () => {
      const target = await mentionTargetRepo.withTx(tx).findOrCreateForComment(comment_id);
      return target.target_id;
    });
  }

  async scanAndLinkForPost(post_id: string, textContent: string | null, tx?: Prisma.TransactionClient): Promise<void> {
    if (!textContent) return;
    const usernames = this.extractMentions(textContent);
    await this.linkMentions(usernames, async () => {
      const target = await mentionTargetRepo.withTx(tx).findOrCreateForPost(post_id);
      return target.target_id;
    });
  }
}

export const mentionService = new MentionService();