/*
  Warnings:

  - You are about to drop the `mentions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mentions" DROP CONSTRAINT "mentions_mentioned_user_id_fkey";

-- DropTable
DROP TABLE "mentions";
