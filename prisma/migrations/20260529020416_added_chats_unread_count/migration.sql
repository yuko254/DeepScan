-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "user_a_unread_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "user_b_unread_count" INTEGER NOT NULL DEFAULT 0;
