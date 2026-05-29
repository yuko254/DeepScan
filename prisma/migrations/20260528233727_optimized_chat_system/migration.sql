/*
  Warnings:

  - The primary key for the `chats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `is_group_chat` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the `chat_participants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_a,user_b]` on the table `chats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_a` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_b` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Made the column `sender_id` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "chat_participants" DROP CONSTRAINT "chat_participants_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_participants" DROP CONSTRAINT "chat_participants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_targets" DROP CONSTRAINT "notification_targets_chat_id_fkey";

-- DropIndex
DROP INDEX "chats_title_idx";

-- AlterTable
ALTER TABLE "chats" DROP CONSTRAINT "chats_pkey",
DROP COLUMN "is_group_chat",
DROP COLUMN "title",
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "user_a" UUID NOT NULL,
ADD COLUMN     "user_b" UUID NOT NULL,
ALTER COLUMN "chat_id" DROP DEFAULT,
ALTER COLUMN "chat_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("chat_id");

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "reply_to" UUID,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6),
ALTER COLUMN "chat_id" SET DATA TYPE TEXT,
ALTER COLUMN "sender_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "notification_targets" ALTER COLUMN "chat_id" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "chat_participants";

-- CreateTable
CREATE TABLE "message_reactions" (
    "reaction_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "emoji" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reactions_pkey" PRIMARY KEY ("reaction_id")
);

-- CreateIndex
CREATE INDEX "message_reactions_message_id_idx" ON "message_reactions"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "message_reactions_message_id_user_id_key" ON "message_reactions"("message_id", "user_id");

-- CreateIndex
CREATE INDEX "chats_user_a_idx" ON "chats"("user_a");

-- CreateIndex
CREATE INDEX "chats_user_b_idx" ON "chats"("user_b");

-- CreateIndex
CREATE UNIQUE INDEX "chats_user_a_user_b_key" ON "chats"("user_a", "user_b");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_a_fkey" FOREIGN KEY ("user_a") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_b_fkey" FOREIGN KEY ("user_b") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_fkey" FOREIGN KEY ("reply_to") REFERENCES "messages"("message_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_targets" ADD CONSTRAINT "notification_targets_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("chat_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- RenameIndex
ALTER INDEX "idx_messages_chat_id" RENAME TO "messages_chat_id_idx";

-- RenameIndex
ALTER INDEX "idx_messages_sent_at" RENAME TO "messages_sent_at_idx";
