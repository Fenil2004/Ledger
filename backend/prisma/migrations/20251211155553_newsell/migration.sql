/*
  Warnings:

  - Made the column `ratePerItem` on table `SellItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SellItem" ALTER COLUMN "ratePerItem" SET NOT NULL;
