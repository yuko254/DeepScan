import { Prisma } from '../../config/prisma.js';
import { userRepo } from '../../Repository/instances.js';
import { notificationService } from '../notification.service.js';

class MentionService {

  private extractMentions(content: string): string[] {
    const matches = content.match(/@[\w\u0600-\u06FF]+/g) || [];
    return [...new Set(matches.map(m => m.slice(1)))];
  }

  private async getUsersByMention(mentionText: string) {
    const cleanText = mentionText.startsWith('@') ? mentionText.slice(1) : mentionText;

    return userRepo.findMany({
      where: {
        OR: [
          { username: { equals: cleanText, mode: 'insensitive' } },
          { profile: { first_name: { equals: cleanText, mode: 'insensitive' } } },
          { profile: { last_name: { equals: cleanText, mode: 'insensitive' } } }
        ]
      },
      select: { user_id: true },
    });
  }

  async scanAndNotifyForComment(userId: string, commentId: string, content: string, tx?: Prisma.TransactionClient) {
    const mentionTexts = this.extractMentions(content);
    if (mentionTexts.length === 0) return;

    const userArrays = await Promise.all(
      mentionTexts.map(text => this.getUsersByMention(text))
    );
    const users = [...new Map(userArrays.flat().map(u => [u.user_id, u])).values()];
    if (users.length === 0) return;

    const recipients = users.filter(u => u.user_id !== userId);

    await Promise.all(recipients.map(user =>
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

    const mentionTexts = this.extractMentions(textContent);
    if (mentionTexts.length === 0) return;

    const userArrays = await Promise.all(
      mentionTexts.map(text => this.getUsersByMention(text))
    );
    const users = [...new Map(userArrays.flat().map(u => [u.user_id, u])).values()];
    if (users.length === 0) return;

    const recipients = users.filter(u => u.user_id !== userId);

    await Promise.all(recipients.map(user =>
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
