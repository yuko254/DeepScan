/*
  Warnings:

  - You are about to drop the column `likes_count` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `post_count` on the `hashtags` table. All the data in the column will be lost.
  - You are about to drop the column `media_type` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `scan_id` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `story_id` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `comment_id` on the `mentions` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `mentions` table. All the data in the column will be lost.
  - You are about to drop the column `target_id` on the `notifications` table. All the data in the column will be lost.
  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `item_type` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `reported_item_id` on the `reports` table. All the data in the column will be lost.
  - The primary key for the `stories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `story_id` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the `post_hashtags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scan_history` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reporter_id,report_target_id]` on the table `reports` will be added. If there are existing duplicate values, this will fail.
  - Made the column `is_group_chat` on table `chats` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mention_target_id` to the `mentions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `report_target_id` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_id` to the `stories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_post_id_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_scan_id_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_story_id_fkey";

-- DropForeignKey
ALTER TABLE "mentions" DROP CONSTRAINT "mentions_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "mentions" DROP CONSTRAINT "mentions_post_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "post_blocks" DROP CONSTRAINT "post_blocks_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_hashtags" DROP CONSTRAINT "post_hashtags_hashtag_id_fkey";

-- DropForeignKey
ALTER TABLE "post_hashtags" DROP CONSTRAINT "post_hashtags_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "saved_posts" DROP CONSTRAINT "saved_posts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "scan_history" DROP CONSTRAINT "scan_history_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stories" DROP CONSTRAINT "stories_user_id_fkey";

-- DropForeignKey
ALTER TABLE "story_views" DROP CONSTRAINT "story_views_story_id_fkey";

-- DropIndex
DROP INDEX "media_post_id_idx";

-- DropIndex
DROP INDEX "media_scan_id_idx";

-- DropIndex
DROP INDEX "media_story_id_idx";

-- DropIndex
DROP INDEX "mentions_comment_id_idx";

-- DropIndex
DROP INDEX "mentions_post_id_idx";

-- DropIndex
DROP INDEX "posts_user_id_idx";

-- DropIndex
DROP INDEX "reports_reported_item_id_idx";

-- DropIndex
DROP INDEX "reports_reporter_id_reported_item_id_key";

-- AlterTable
ALTER TABLE "chats" ALTER COLUMN "is_group_chat" SET NOT NULL;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "likes_count";

-- AlterTable
ALTER TABLE "hashtags" DROP COLUMN "post_count";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "media_type",
DROP COLUMN "post_id",
DROP COLUMN "scan_id",
DROP COLUMN "story_id",
ADD COLUMN     "content_id" UUID,
ADD COLUMN     "type" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "mentions" DROP COLUMN "comment_id",
DROP COLUMN "post_id",
ADD COLUMN     "mention_target_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "target_id",
ADD COLUMN     "actor_id" UUID,
ADD COLUMN     "notification_target_id" UUID;

-- AlterTable
ALTER TABLE "posts" DROP CONSTRAINT "posts_pkey",
DROP COLUMN "created_at",
DROP COLUMN "post_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "content_id" UUID NOT NULL,
ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("content_id");

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "item_type",
DROP COLUMN "reported_item_id",
ADD COLUMN     "report_target_id" UUID NOT NULL,
ADD COLUMN     "resolved_at" TIMESTAMPTZ(6),
ADD COLUMN     "resolver_id" UUID;

-- AlterTable
ALTER TABLE "stories" DROP CONSTRAINT "stories_pkey",
DROP COLUMN "story_id",
DROP COLUMN "user_id",
ADD COLUMN     "content_id" UUID NOT NULL,
ADD CONSTRAINT "stories_pkey" PRIMARY KEY ("content_id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;

-- DropTable
DROP TABLE "post_hashtags";

-- DropTable
DROP TABLE "scan_history";

-- CreateTable
CREATE TABLE "follow_requests" (
    "id" BIGSERIAL NOT NULL,
    "requester_id" UUID NOT NULL,
    "target_id" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_hashtags" (
    "id" BIGSERIAL NOT NULL,
    "content_id" UUID NOT NULL,
    "hashtag_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_hashtags" (
    "id" BIGSERIAL NOT NULL,
    "comment_id" UUID NOT NULL,
    "hashtag_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "content_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "visibility" VARCHAR(20) NOT NULL DEFAULT 'public',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "mention_targets" (
    "target_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID,
    "comment_id" UUID,

    CONSTRAINT "mention_targets_pkey" PRIMARY KEY ("target_id")
);

-- CreateTable
CREATE TABLE "notification_targets" (
    "target_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID,
    "comment_id" UUID,
    "chat_id" UUID,

    CONSTRAINT "notification_targets_pkey" PRIMARY KEY ("target_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "tag_id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "id" BIGSERIAL NOT NULL,
    "post_id" UUID NOT NULL,
    "tag_id" BIGINT NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_targets" (
    "target_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID,
    "comment_id" UUID,
    "story_id" UUID,

    CONSTRAINT "report_targets_pkey" PRIMARY KEY ("target_id")
);

-- CreateTable
CREATE TABLE "scans" (
    "content_id" UUID NOT NULL,
    "location_id" UUID,
    "metadata" JSONB,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scans_pkey" PRIMARY KEY ("content_id")
);

-- CreateIndex
CREATE INDEX "follow_requests_target_id_idx" ON "follow_requests"("target_id");

-- CreateIndex
CREATE UNIQUE INDEX "follow_requests_requester_id_target_id_key" ON "follow_requests"("requester_id", "target_id");

-- CreateIndex
CREATE INDEX "content_hashtags_hashtag_id_idx" ON "content_hashtags"("hashtag_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_hashtags_content_id_hashtag_id_key" ON "content_hashtags"("content_id", "hashtag_id");

-- CreateIndex
CREATE INDEX "comment_hashtags_hashtag_id_idx" ON "comment_hashtags"("hashtag_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_hashtags_comment_id_hashtag_id_key" ON "comment_hashtags"("comment_id", "hashtag_id");

-- CreateIndex
CREATE UNIQUE INDEX "mention_targets_post_id_key" ON "mention_targets"("post_id") WHERE (post_id IS NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "mention_targets_comment_id_key" ON "mention_targets"("comment_id") WHERE (comment_id IS NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "notification_targets_post_id_key" ON "notification_targets"("post_id") WHERE (post_id IS NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "notification_targets_comment_id_key" ON "notification_targets"("comment_id") WHERE (comment_id IS NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "notification_targets_chat_id_key" ON "notification_targets"("chat_id") WHERE (chat_id IS NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "post_tags_tag_id_idx" ON "post_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_tags_post_id_tag_id_key" ON "post_tags"("post_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_targets_post_id_key" ON "report_targets"("post_id") WHERE (post_id IS NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "report_targets_comment_id_key" ON "report_targets"("comment_id") WHERE (comment_id IS NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "report_targets_story_id_key" ON "report_targets"("story_id") WHERE (story_id IS NOT NULL);

-- CreateIndex
CREATE INDEX "media_content_id_idx" ON "media"("content_id");

-- CreateIndex
CREATE INDEX "mentions_mention_target_id_idx" ON "mentions"("mention_target_id");

-- CreateIndex
CREATE INDEX "notifications_notification_target_id_idx" ON "notifications"("notification_target_id");

-- CreateIndex
CREATE INDEX "reports_resolver_id_idx" ON "reports"("resolver_id");

-- CreateIndex
CREATE UNIQUE INDEX "reports_reporter_id_report_target_id_key" ON "reports"("reporter_id", "report_target_id") WHERE (reporter_id is NOT NULL);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "follow_requests" ADD CONSTRAINT "follow_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "follow_requests" ADD CONSTRAINT "follow_requests_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_hashtags" ADD CONSTRAINT "content_hashtags_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_hashtags" ADD CONSTRAINT "content_hashtags_hashtag_id_fkey" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("hashtag_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_hashtags" ADD CONSTRAINT "comment_hashtags_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_hashtags" ADD CONSTRAINT "comment_hashtags_hashtag_id_fkey" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("hashtag_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mentions" ADD CONSTRAINT "mentions_mention_target_id_fkey" FOREIGN KEY ("mention_target_id") REFERENCES "mention_targets"("target_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mention_targets" ADD CONSTRAINT "mention_targets_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mention_targets" ADD CONSTRAINT "mention_targets_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notification_target_id_fkey" FOREIGN KEY ("notification_target_id") REFERENCES "notification_targets"("target_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_targets" ADD CONSTRAINT "notification_targets_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_targets" ADD CONSTRAINT "notification_targets_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_targets" ADD CONSTRAINT "notification_targets_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("chat_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_blocks" ADD CONSTRAINT "post_blocks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolver_id_fkey" FOREIGN KEY ("resolver_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_report_target_id_fkey" FOREIGN KEY ("report_target_id") REFERENCES "report_targets"("target_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report_targets" ADD CONSTRAINT "report_targets_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report_targets" ADD CONSTRAINT "report_targets_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report_targets" ADD CONSTRAINT "report_targets_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("content_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_views" ADD CONSTRAINT "story_views_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("content_id") ON DELETE CASCADE ON UPDATE NO ACTION;


-- Extensions (required for GIN trigram indexes)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Check constraints (Prisma can't migrate these)
ALTER TABLE follow_requests
  ADD CONSTRAINT no_self_request CHECK (requester_id <> target_id);

ALTER TABLE report_targets
  ADD CONSTRAINT single_target_check CHECK (
    (post_id IS NOT NULL)::int +
    (comment_id IS NOT NULL)::int +
    (story_id IS NOT NULL)::int = 1
  );

ALTER TABLE notification_targets
  ADD CONSTRAINT single_target_check CHECK (
    (post_id IS NOT NULL)::int +
    (comment_id IS NOT NULL)::int +
    (chat_id IS NOT NULL)::int = 1
  );

ALTER TABLE mention_targets
  ADD CONSTRAINT single_target_check CHECK (
    (post_id IS NOT NULL)::int +
    (comment_id IS NOT NULL)::int = 1
  );

-- Views
CREATE VIEW hashtag_usage AS
SELECT hashtag_id, COUNT(*) AS usage_count
FROM (
  SELECT hashtag_id FROM content_hashtags
  UNION ALL
  SELECT hashtag_id FROM comment_hashtags
) AS usages
GROUP BY hashtag_id;

CREATE VIEW post_like_counts AS
SELECT post_id, COUNT(*) AS likes_count
FROM post_likes
GROUP BY post_id;

CREATE VIEW comment_like_counts AS
SELECT comment_id, COUNT(*) AS likes_count
FROM comment_likes
GROUP BY comment_id;