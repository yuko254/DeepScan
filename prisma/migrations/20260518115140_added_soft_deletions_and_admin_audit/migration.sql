-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_comment_parent_id_fkey";

-- AlterTable
ALTER TABLE "contents" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "admin_audits" (
    "audit_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "admin_username" TEXT,
    "action" TEXT NOT NULL,
    "target_table" TEXT,
    "target_id" TEXT,
    "old_data" JSONB,
    "new_data" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audits_pkey" PRIMARY KEY ("audit_id")
);

-- CreateIndex
CREATE INDEX "admin_audits_admin_username_idx" ON "admin_audits"("admin_username");

-- CreateIndex
CREATE INDEX "admin_audits_created_at_idx" ON "admin_audits"("created_at");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_comment_parent_id_fkey" FOREIGN KEY ("comment_parent_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_audits" ADD CONSTRAINT "admin_audits_admin_username_fkey" FOREIGN KEY ("admin_username") REFERENCES "users"("username") ON DELETE SET NULL ON UPDATE CASCADE;
