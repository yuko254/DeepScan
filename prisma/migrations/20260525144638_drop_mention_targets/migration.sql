/*
  Warnings:

  - You are about to drop the `mention_targets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mention_targets" DROP CONSTRAINT "mention_targets_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "mention_targets" DROP CONSTRAINT "mention_targets_post_id_fkey";

-- DropForeignKey
ALTER TABLE "mentions" DROP CONSTRAINT "mentions_mention_target_id_fkey";

-- DropTable
DROP TABLE "mention_targets";
