-- DropForeignKey
ALTER TABLE "admin_audits" DROP CONSTRAINT "admin_audits_admin_username_fkey";

-- AddForeignKey
ALTER TABLE "admin_audits" ADD CONSTRAINT "admin_audits_admin_username_fkey" FOREIGN KEY ("admin_username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE CASCADE;
