/*
  Warnings:

  - Added the required column `value` to the `Deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "value" DECIMAL(65,30) NOT NULL;
