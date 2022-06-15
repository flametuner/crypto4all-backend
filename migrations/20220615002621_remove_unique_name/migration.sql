-- DropIndex
DROP INDEX "Campaign_title_key";

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "published" SET DEFAULT false;
