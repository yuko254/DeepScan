/*
  Warnings:

  - You are about to drop the column `mention_target_id` on the `mentions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "mentions_mention_target_id_idx";

-- AlterTable
ALTER TABLE "mentions" DROP COLUMN "mention_target_id";
