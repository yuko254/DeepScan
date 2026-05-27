/*
  Warnings:

  - A unique constraint covering the columns `[profile_id]` on the table `report_targets` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "report_targets" ADD COLUMN     "profile_id" UUID;

-- AddForeignKey
ALTER TABLE "report_targets" ADD CONSTRAINT "report_targets_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- CreateIndex
CREATE UNIQUE INDEX "report_targets_profile_id_key" ON "report_targets"("profile_id") WHERE (profile_id IS NOT NULL);
