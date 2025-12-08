/*
  Warnings:

  - You are about to drop the column `bookingId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `guideSpotId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_bookingId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingId",
ADD COLUMN     "guideSpotId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_guideSpotId_fkey" FOREIGN KEY ("guideSpotId") REFERENCES "GuideSpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
