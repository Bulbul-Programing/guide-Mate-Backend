/*
  Warnings:

  - You are about to drop the column `userId` on the `GuideSpot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GuideSpot" DROP CONSTRAINT "GuideSpot_userId_fkey";

-- AlterTable
ALTER TABLE "GuideSpot" DROP COLUMN "userId";
