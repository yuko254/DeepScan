/*
  Warnings:

  - The primary key for the `blocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_hashtags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[blocker_id,blocked_id]` on the table `blocks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[follower_id,following_id]` on the table `follows` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[post_id,hashtag_id]` on the table `post_hashtags` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "blocks" DROP CONSTRAINT "blocks_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "blocks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "follows" DROP CONSTRAINT "follows_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "post_hashtags" DROP CONSTRAINT "post_hashtags_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "post_hashtags_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_blocker_id_blocked_id_key" ON "blocks"("blocker_id", "blocked_id");

-- CreateIndex
CREATE UNIQUE INDEX "follows_follower_id_following_id_key" ON "follows"("follower_id", "following_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_hashtags_post_id_hashtag_id_key" ON "post_hashtags"("post_id", "hashtag_id");
