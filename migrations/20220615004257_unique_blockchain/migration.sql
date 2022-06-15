/*
  Warnings:

  - You are about to drop the column `latestCreatedBlock` on the `EventState` table. All the data in the column will be lost.
  - You are about to drop the column `latestFundedBlock` on the `EventState` table. All the data in the column will be lost.
  - You are about to drop the column `latestPausedBlock` on the `EventState` table. All the data in the column will be lost.
  - You are about to drop the column `latestResumedBlock` on the `EventState` table. All the data in the column will be lost.
  - You are about to drop the column `latestUsedFundedBlock` on the `EventState` table. All the data in the column will be lost.
  - You are about to drop the column `latestValuePerShareUpdatedBlock` on the `EventState` table. All the data in the column will be lost.
  - You are about to drop the column `latestWithdrawnBlock` on the `EventState` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[blockchainId]` on the table `EventState` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `latest_created_block` to the `EventState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latest_funded_block` to the `EventState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latest_paused_block` to the `EventState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latest_resumed_block` to the `EventState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latest_used_funded_block` to the `EventState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latest_value_per_share_updated_block` to the `EventState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latest_withdrawn_block` to the `EventState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventState" DROP COLUMN "latestCreatedBlock",
DROP COLUMN "latestFundedBlock",
DROP COLUMN "latestPausedBlock",
DROP COLUMN "latestResumedBlock",
DROP COLUMN "latestUsedFundedBlock",
DROP COLUMN "latestValuePerShareUpdatedBlock",
DROP COLUMN "latestWithdrawnBlock",
ADD COLUMN     "latest_created_block" INTEGER NOT NULL,
ADD COLUMN     "latest_funded_block" INTEGER NOT NULL,
ADD COLUMN     "latest_paused_block" INTEGER NOT NULL,
ADD COLUMN     "latest_resumed_block" INTEGER NOT NULL,
ADD COLUMN     "latest_used_funded_block" INTEGER NOT NULL,
ADD COLUMN     "latest_value_per_share_updated_block" INTEGER NOT NULL,
ADD COLUMN     "latest_withdrawn_block" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventState_blockchainId_key" ON "EventState"("blockchainId");
