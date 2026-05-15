/*
  Warnings:

  - You are about to drop the column `parent_id` on the `comments` table. All the data in the column will be lost.
  - The `visibility` column on the `contents` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `follow_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `reports` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `contents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `device_type` on the `device_tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `post_blocks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role_name` on the `roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('post', 'story', 'scan');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'followers', 'private');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('ios', 'android', 'web');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('mention', 'like', 'comment', 'reply', 'system', 'message');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "FollowRequestStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('text', 'media');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'moderator', 'user');

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_id_fkey";

-- DropIndex
DROP INDEX "idx_comments_parent_id";

-- DropIndex
DROP INDEX "roles_role_name_idx";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "parent_id",
ADD COLUMN     "comment_parent_id" UUID;

-- AlterTable
ALTER TABLE "contents" DROP COLUMN "type",
ADD COLUMN     "type" "ContentType" NOT NULL,
DROP COLUMN "visibility",
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'public';

-- AlterTable
ALTER TABLE "device_tokens" DROP COLUMN "device_type",
ADD COLUMN     "device_type" "DeviceType" NOT NULL;

-- AlterTable
ALTER TABLE "follow_requests" DROP COLUMN "status",
ADD COLUMN     "status" "FollowRequestStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "media" DROP COLUMN "type",
ADD COLUMN     "type" "MediaType" NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType";

-- AlterTable
ALTER TABLE "post_blocks" DROP COLUMN "type",
ADD COLUMN     "type" "BlockType" NOT NULL;

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "role_name",
ADD COLUMN     "role_name" "Role" NOT NULL;

-- CreateIndex
CREATE INDEX "idx_comments_parent_id" ON "comments"("comment_parent_id");

-- CreateIndex
CREATE INDEX "idx_post_blocks_type" ON "post_blocks"("type");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_comment_parent_id_fkey" FOREIGN KEY ("comment_parent_id") REFERENCES "comments"("comment_id") ON DELETE SET NULL ON UPDATE NO ACTION;
