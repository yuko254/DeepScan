/*
  Warnings:

  - Made the column `text_content` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'message_reaction';

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "text_content" SET NOT NULL;
