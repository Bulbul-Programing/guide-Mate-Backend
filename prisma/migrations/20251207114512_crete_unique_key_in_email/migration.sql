/*
  Warnings:

  - You are about to drop the column `language` on the `guideProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "guideProfile" DROP COLUMN "language";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "language" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
