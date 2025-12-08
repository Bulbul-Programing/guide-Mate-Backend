-- DropForeignKey
ALTER TABLE "GuideSpot" DROP CONSTRAINT "GuideSpot_guideId_fkey";

-- AddForeignKey
ALTER TABLE "GuideSpot" ADD CONSTRAINT "GuideSpot_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guideProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
