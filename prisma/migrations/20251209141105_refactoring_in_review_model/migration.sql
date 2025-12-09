/*
  Warnings:

  - You are about to drop the column `userId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `travelerId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Made the column `guideSpotId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_guideId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_guideSpotId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "userId",
ADD COLUMN     "guideProfileId" TEXT,
ADD COLUMN     "travelerId" TEXT NOT NULL,
ALTER COLUMN "guideSpotId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_guideSpotId_fkey" FOREIGN KEY ("guideSpotId") REFERENCES "GuideSpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "guideProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
