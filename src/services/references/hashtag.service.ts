import { Prisma } from '../../config/prisma.js';
import { hashtagRepo, commentHashtagRepo, contentHashtagRepo } from '../../Repository/instances.js';

class HashtagService {

  private extractHashtags(content: string): string[] {
    const matches = content.match(/#[\w\u0600-\u06FF]+/g) || [];
    return [...new Set(matches.map(tag => tag.slice(1)))];
  }

  private async linkHashtags(
    hashtagNames: string[],
    targetId: string,
    linkCreator: (entries: { hashtag_id: string; target_id: string }[]) => Promise<unknown>
  ): Promise<void> {
    if (hashtagNames.length === 0) return;

    // 1. Find existing hashtags
    const existing = await hashtagRepo.findMany({
      where: { name: { in: hashtagNames } },
      select: { name: true, hashtag_id: true },
    });
    const existingMap = new Map(existing.map(h => [h.name, h.hashtag_id]));

    // 2. Determine which names need creation
    const existingNames = new Set(existing.map(h => h.name));
    const toCreate = hashtagNames.filter(name => !existingNames.has(name));

    // 3. Batch create missing hashtags
    if (toCreate.length) {
      await hashtagRepo.createMany(toCreate.map(name => ({ name })));
      const newOnes = await hashtagRepo.findMany({
        where: { name: { in: toCreate } },
        select: { name: true, hashtag_id: true },
      });
      for (const h of newOnes) existingMap.set(h.name, h.hashtag_id);
    }

    // 4. Prepare entries for the link table
    const entries = hashtagNames.map(name => ({
      hashtag_id: existingMap.get(name)!,
      target_id: targetId,
    }));

    // 5. Batch insert links
    await linkCreator(entries);
  }

  // ─── Public methods ─────────────────────────────────────────

  async scanAndLinkForComment(comment_id: string, content: string, tx?: Prisma.TransactionClient): Promise<void> {
    const hashtagNames = this.extractHashtags(content);
    await this.linkHashtags(hashtagNames, comment_id, async (entries) => {
      await commentHashtagRepo.withTx(tx).createMany(
        entries.map(e => ({ comment_id: e.target_id, hashtag_id: e.hashtag_id })),
        { skipDuplicates: true }
      );
    });
  }

  async scanAndLinkForPost(content_id: string, textContent: string | null, tx?: Prisma.TransactionClient): Promise<void> {
    if (!textContent) return;
    const hashtagNames = this.extractHashtags(textContent);
    await this.linkHashtags(hashtagNames, content_id, async (entries) => {
      await contentHashtagRepo.withTx(tx).createMany(
        entries.map(e => ({ content_id: e.target_id, hashtag_id: e.hashtag_id })),
        { skipDuplicates: true }
      );
    });
  }
}

export const hashtagService = new HashtagService();