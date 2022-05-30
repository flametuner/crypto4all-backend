/*
  Warnings:

  - You are about to drop the column `content` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `contentsToValidation` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userNameTwitter` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[twitterUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `suggestion` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_creatorId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_userNameTwitter_key";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "content",
DROP COLUMN "contentsToValidation",
ADD COLUMN     "forbiddenContent" TEXT[],
ADD COLUMN     "mandatoryContent" TEXT[],
ADD COLUMN     "suggestion" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "token" DROP NOT NULL,
ALTER COLUMN "network" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "blockchain" DROP NOT NULL,
ALTER COLUMN "value" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "userNameTwitter",
ADD COLUMN     "twitterUsername" TEXT;

-- CreateTable
CREATE TABLE "Creator" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_twitterUsername_key" ON "User"("twitterUsername");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
