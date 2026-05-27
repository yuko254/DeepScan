/*
  Warnings:

  - You are about to drop the `password_resets` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `created_at` on table `blocks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `joined_at` on table `chat_participants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `chats` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `comment_likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `comments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_used` on table `device_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `device_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `follows` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `hashtags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `mentions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sent_at` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `delivered_at` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `read_at` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `post_blocks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `post_hashtags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `post_likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `reports` required. This step will fail if there are existing NULL values in that column.
  - Made the column `saved_at` on table `saved_posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timestamp` on table `scan_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `viewed_at` on table `story_views` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "password_resets" DROP CONSTRAINT "password_resets_user_id_fkey";

-- AlterTable
ALTER TABLE "blocks" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "chat_participants" ALTER COLUMN "joined_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "chats" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "comment_likes" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "device_tokens" ALTER COLUMN "last_used" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "follows" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "hashtags" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "mentions" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "sent_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "delivered_at" SET NOT NULL,
ALTER COLUMN "read_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "post_blocks" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "post_hashtags" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "post_likes" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "saved_posts" ALTER COLUMN "saved_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "scan_history" ALTER COLUMN "timestamp" SET NOT NULL;

-- AlterTable
ALTER TABLE "story_views" ALTER COLUMN "viewed_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;

-- DropTable
DROP TABLE "password_resets";
