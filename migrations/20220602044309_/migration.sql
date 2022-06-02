/*
  Warnings:

  - You are about to drop the column `blockchain` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `network` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `tokenAddress` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `tokenName` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `tokenSymbol` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `totalValue` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `valuePerShare` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `network` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Deposit` table. All the data in the column will be lost.
  - You are about to alter the column `value` on the `Deposit` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.
  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[campaignHash]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[walletAddress]` on the table `Creator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tweetId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `campaignHash` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Made the column `published` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Deposit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `Deposit` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tweetId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `twitterUsername` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "Post_content_key";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "blockchain",
DROP COLUMN "network",
DROP COLUMN "tokenAddress",
DROP COLUMN "tokenName",
DROP COLUMN "tokenSymbol",
DROP COLUMN "totalValue",
DROP COLUMN "valuePerShare",
ADD COLUMN     "campaignHash" TEXT NOT NULL,
ALTER COLUMN "published" SET NOT NULL;

-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "blockchain",
DROP COLUMN "network",
DROP COLUMN "token",
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "message" DROP NOT NULL,
ALTER COLUMN "value" SET NOT NULL,
ALTER COLUMN "value" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
ADD COLUMN     "tweetId" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "twitterUsername" SET NOT NULL;

-- CreateTable
CREATE TABLE "Blockchain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "nativeTokenId" INTEGER,

    CONSTRAINT "Blockchain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "totalSupply" BIGINT NOT NULL,
    "native" BOOLEAN NOT NULL,
    "blockchainId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignDetails" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "valuePerShare" BIGINT NOT NULL,
    "totalValue" BIGINT NOT NULL,

    CONSTRAINT "CampaignDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_chainId_key" ON "Blockchain"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_nativeTokenId_key" ON "Blockchain"("nativeTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_address_blockchainId_key" ON "Token"("address", "blockchainId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignDetails_campaignId_key" ON "CampaignDetails"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_campaignHash_key" ON "Campaign"("campaignHash");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_walletAddress_key" ON "Creator"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Post_tweetId_key" ON "Post"("tweetId");

-- AddForeignKey
ALTER TABLE "Blockchain" ADD CONSTRAINT "Blockchain_nativeTokenId_fkey" FOREIGN KEY ("nativeTokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_blockchainId_fkey" FOREIGN KEY ("blockchainId") REFERENCES "Blockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignDetails" ADD CONSTRAINT "CampaignDetails_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignDetails" ADD CONSTRAINT "CampaignDetails_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
