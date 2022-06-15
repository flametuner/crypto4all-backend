/*
  Warnings:

  - You are about to drop the column `latest_used_funded_block` on the `EventState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventState" DROP COLUMN "latest_used_funded_block",
ADD COLUMN     "latest_user_funded_block" INTEGER NOT NULL DEFAULT 0;
