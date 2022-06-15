/*
  Warnings:

  - The primary key for the `EventState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `EventState` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "EventState" DROP CONSTRAINT "EventState_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "latest_created_block" SET DEFAULT 0,
ALTER COLUMN "latest_funded_block" SET DEFAULT 0,
ALTER COLUMN "latest_paused_block" SET DEFAULT 0,
ALTER COLUMN "latest_resumed_block" SET DEFAULT 0,
ALTER COLUMN "latest_used_funded_block" SET DEFAULT 0,
ALTER COLUMN "latest_value_per_share_updated_block" SET DEFAULT 0,
ALTER COLUMN "latest_withdrawn_block" SET DEFAULT 0,
ADD CONSTRAINT "EventState_pkey" PRIMARY KEY ("id");
