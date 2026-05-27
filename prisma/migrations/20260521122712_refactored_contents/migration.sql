/*
  Warnings:

  - You are about to drop the column `content_id` on the `media` table. All the data in the column will be lost.
  - You are about to drop the `post_blocks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content_map` to the `contents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_content_id_fkey";

-- DropForeignKey
ALTER TABLE "post_blocks" DROP CONSTRAINT "post_blocks_media_id_fkey";

-- DropForeignKey
ALTER TABLE "post_blocks" DROP CONSTRAINT "post_blocks_post_id_fkey";

-- DropIndex
DROP INDEX "media_content_id_idx";

-- AlterTable
ALTER TABLE "contents" ADD COLUMN     "content_map" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "media" DROP COLUMN "content_id";

-- DropTable
DROP TABLE "post_blocks";
