/*
  Warnings:

  - Made the column `updated_at` on table `comments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET NOT NULL;
