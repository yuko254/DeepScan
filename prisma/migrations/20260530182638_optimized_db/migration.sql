/*
  Warnings:

  - You are about to drop the column `visibility` on the `contents` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "admin_audits_admin_username_idx";

-- DropIndex
DROP INDEX "idx_blocks_blocked_id";

-- DropIndex
DROP INDEX "idx_follows_following_id";

-- DropIndex
DROP INDEX "notifications_delivered_at_idx";

-- DropIndex
DROP INDEX "notifications_user_id_idx";

-- DropIndex
DROP INDEX "reports_created_at_idx";

-- DropIndex
DROP INDEX "reports_reporter_id_idx";

-- DropIndex
DROP INDEX "reports_resolver_id_idx";

-- AlterTable
ALTER TABLE "admin_audits" ALTER COLUMN "audit_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "comment_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "contents" DROP COLUMN "visibility",
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "content_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "device_tokens" ALTER COLUMN "token_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "hashtags" ALTER COLUMN "hashtag_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "location_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "media" ALTER COLUMN "media_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "message_reactions" ALTER COLUMN "reaction_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "message_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "notification_targets" ALTER COLUMN "target_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "notification_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "profile_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "report_targets" ALTER COLUMN "target_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "report_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "saved_posts" ALTER COLUMN "saved_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_id" DROP DEFAULT;

-- DropEnum
DROP TYPE "Visibility";

-- CreateIndex
CREATE INDEX "admin_audits_admin_username_idx" ON "admin_audits" USING HASH ("admin_username");

-- CreateIndex
CREATE INDEX "idx_admin_audits_admin_username_gin" ON "admin_audits" USING GIN ("admin_username" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "blocks_blocker_id_idx" ON "blocks" USING HASH ("blocker_id");

-- CreateIndex
CREATE INDEX "blocks_blocked_id_idx" ON "blocks" USING HASH ("blocked_id");

-- CreateIndex
CREATE INDEX "blocks_created_at_idx" ON "blocks"("created_at");

-- CreateIndex
CREATE INDEX "follows_follower_id_idx" ON "follows" USING HASH ("follower_id");

-- CreateIndex
CREATE INDEX "follows_following_id_idx" ON "follows" USING HASH ("following_id");

-- CreateIndex
CREATE INDEX "follows_created_at_idx" ON "follows"("created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_delivered_at_idx" ON "notifications"("user_id", "delivered_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");

-- CreateIndex
CREATE INDEX "notifications_actor_id_idx" ON "notifications"("actor_id");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "profiles_first_name_last_name_idx" ON "profiles" USING GIN ("first_name" gin_trgm_ops, "last_name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "profiles_birth_location_id_idx" ON "profiles"("birth_location_id");

-- CreateIndex
CREATE INDEX "profiles_current_location_id_idx" ON "profiles"("current_location_id");

-- CreateIndex
CREATE INDEX "reports_status_created_at_idx" ON "reports"("status", "created_at");

-- CreateIndex
CREATE INDEX "reports_reporter_id_created_at_idx" ON "reports"("reporter_id", "created_at");

-- CreateIndex
CREATE INDEX "reports_resolver_id_resolved_at_idx" ON "reports"("resolver_id", "resolved_at");

-- CreateIndex
CREATE INDEX "reports_report_target_id_idx" ON "reports"("report_target_id");

-- RenameIndex
ALTER INDEX "idx_device_tokens_last_used" RENAME TO "device_tokens_last_used_idx";

-- RenameIndex
ALTER INDEX "idx_users_username_trgm" RENAME TO "users_username_idx";
