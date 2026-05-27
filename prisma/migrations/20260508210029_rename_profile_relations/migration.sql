/*
  Warnings:

  - You are about to drop the column `birth_location` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `current_location` on the `profiles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_birth_location_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_current_location_fkey";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "birth_location",
DROP COLUMN "current_location",
ADD COLUMN     "birth_location_id" UUID,
ADD COLUMN     "current_location_id" UUID;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_birth_location_id_fkey" FOREIGN KEY ("birth_location_id") REFERENCES "locations"("location_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "locations"("location_id") ON DELETE SET NULL ON UPDATE NO ACTION;
