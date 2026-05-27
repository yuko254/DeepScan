/*
  Warnings:

  - You are about to drop the column `category_name` on the `categories` table. All the data in the column will be lost.
  - The primary key for the `chat_participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `city_id` column on the `cities` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `comment_likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `countries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `country_id` column on the `countries` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `city_id` column on the `locations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `post_likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `story_views` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,chat_id]` on the table `chat_participants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,comment_id]` on the table `comment_likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,post_id]` on the table `post_likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reporter_id,reported_item_id]` on the table `reports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[viewer_id,story_id]` on the table `story_views` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `country_id` on the `cities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `country_id` on the `locations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "chat_participants" DROP CONSTRAINT "chat_participants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_country_id_fkey";

-- DropForeignKey
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_city_id_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_country_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_category_id_fkey";

-- DropForeignKey
ALTER TABLE "story_views" DROP CONSTRAINT "story_views_viewer_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- DropIndex
ALTER TABLE "categories" DROP CONSTRAINT "categories_category_name_key";

-- DropIndex
DROP INDEX "idx_device_tokens_user_id";

-- DropIndex
DROP INDEX "idx_post_blocks_post_id_position";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "category_name",
ADD COLUMN     "name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "chat_participants" DROP CONSTRAINT "chat_participants_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ADD CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cities" DROP CONSTRAINT "cities_pkey",
DROP COLUMN "city_id",
ADD COLUMN     "city_id" BIGSERIAL NOT NULL,
DROP COLUMN "country_id",
ADD COLUMN     "country_id" BIGINT NOT NULL,
ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("city_id");

-- AlterTable
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ADD CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "likes_count" BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "countries" DROP CONSTRAINT "countries_pkey",
DROP COLUMN "country_id",
ADD COLUMN     "country_id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("country_id");

-- AlterTable
ALTER TABLE "hashtags" ALTER COLUMN "post_count" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "city_id",
ADD COLUMN     "city_id" BIGINT,
DROP COLUMN "country_id",
ADD COLUMN     "country_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "post_blocks" ALTER COLUMN "position" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ADD CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "story_views" DROP CONSTRAINT "story_views_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "viewer_id" DROP NOT NULL,
ADD CONSTRAINT "story_views_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "chat_participants_user_id_idx" ON "chat_participants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_user_id_chat_id_key" ON "chat_participants"("user_id", "chat_id") WHERE (user_id is NOT NULL);

-- CreateIndex
CREATE INDEX "chats_title_idx" ON "chats" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "cities_country_id_idx" ON "cities"("country_id");

-- CreateIndex
CREATE INDEX "cities_name_idx" ON "cities" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_country_id_key" ON "cities"("name", "country_id");

-- CreateIndex
CREATE INDEX "comment_likes_user_id_idx" ON "comment_likes"("user_id");

-- CreateIndex
CREATE INDEX "comment_likes_comment_id_idx" ON "comment_likes"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_likes_user_id_comment_id_key" ON "comment_likes"("user_id", "comment_id") WHERE (user_id IS NOT NULL);

-- CreateIndex
CREATE INDEX "countries_name_idx" ON "countries" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "media_post_id_idx" ON "media"("post_id");

-- CreateIndex
CREATE INDEX "media_story_id_idx" ON "media"("story_id");

-- CreateIndex
CREATE INDEX "media_scan_id_idx" ON "media"("scan_id");

-- CreateIndex
CREATE INDEX "media_storage_path_idx" ON "media"("storage_path");

-- CreateIndex
CREATE INDEX "mentions_mentioned_user_id_idx" ON "mentions"("mentioned_user_id");

-- CreateIndex
CREATE INDEX "mentions_post_id_idx" ON "mentions"("post_id");

-- CreateIndex
CREATE INDEX "mentions_comment_id_idx" ON "mentions"("comment_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_idx" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "post_likes_user_id_idx" ON "post_likes"("user_id");

-- CreateIndex
CREATE INDEX "post_likes_post_id_idx" ON "post_likes"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_likes_user_id_post_id_key" ON "post_likes"("user_id", "post_id") WHERE (user_id IS NOT NULL);

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");

-- CreateIndex
CREATE INDEX "reports_reporter_id_idx" ON "reports"("reporter_id");

-- CreateIndex
CREATE INDEX "reports_reported_item_id_idx" ON "reports"("reported_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "reports_reporter_id_reported_item_id_key" ON "reports"("reporter_id", "reported_item_id") WHERE (reporter_id is NOT NULL);

-- CreateIndex
CREATE INDEX "roles_role_name_idx" ON "roles" USING GIN ("role_name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "story_views_viewer_id_idx" ON "story_views"("viewer_id");

-- CreateIndex
CREATE INDEX "story_views_story_id_idx" ON "story_views"("story_id");

-- CreateIndex
CREATE UNIQUE INDEX "story_views_viewer_id_story_id_key" ON "story_views"("viewer_id", "story_id") WHERE (viewer_id is NOT NULL);

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("comment_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("city_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_views" ADD CONSTRAINT "story_views_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;
