/*
  Warnings:

  - Made the column `metadata` on table `scans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "scans" ALTER COLUMN "metadata" SET NOT NULL;
