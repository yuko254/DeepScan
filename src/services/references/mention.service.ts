import { Prisma } from '../../config/prisma.js';
import { userRepo } from '../../Repository/instances.js';
import { notificationService } from '../notification.service.js';

class MentionService {

  private extractMentions(content: string): string[] {
    const matches = content.match(/@[\w\u0600-\u06FF]+/g) || [];
    return [...new Set(matches.map(m => m.slice(1)))];
  }

  private async getUsers(usernames: string[]) {
    if (usernames.length === 0) return;

    // 1. Get user IDs for these usernames
    return await userRepo.findMany({
      where: { username: { in: usernames } },
      select: { user_id: true },
    });
  }

  async scanAndNotifyForComment(userId: string, commentId: string, content: string, tx?: Prisma.TransactionClient) {
    const usernames = this.extractMentions(content);
    const users = await this.getUsers(usernames);
    if (!users || users.length === 0) return;

    await Promise.all(users.map(user =>
      notificationService.sendForComment({
        user_id: user.user_id,
        actor_id: userId,
        type: "mention",
        message: "you were mentioned in a comment"
      }, commentId, tx)
    ));
  }

  async scanAndNotifyForPost(userId: string, postId: string, textContent: string | null, tx?: Prisma.TransactionClient) {
    if (!textContent) return;
    const usernames = this.extractMentions(textContent);
    const users = await this.getUsers(usernames);
    if (!users || users.length === 0) return;

    await Promise.all(users.map(user =>
      notificationService.sendForPost({
        user_id: user.user_id,
        actor_id: userId,
        type: "mention",
        message: "you were mentioned in a post"
      }, postId, tx)
    ));
  }
}

export const mentionService = new MentionService();