/*
  Warnings:

  - You are about to drop the `CampaignDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CampaignDetails" DROP CONSTRAINT "CampaignDetails_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignDetails" DROP CONSTRAINT "CampaignDetails_tokenId_fkey";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "tokenId" INTEGER,
ADD COLUMN     "totalValue" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "valuePerShare" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "CampaignDetails";

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;
