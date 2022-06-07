/*
  Warnings:

  - A unique constraint covering the columns `[nonce]` on the table `Creator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nonce` to the `Creator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Creator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nonce" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Creator_nonce_key" ON "Creator"("nonce");
