/*
  Warnings:

  - Made the column `itemName` on table `SellItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `count` on table `SellItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weightPerItem` on table `SellItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ratePerKg` on table `SellItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalWeight` on table `SellItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalAmount` on table `SellItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SellItem" ALTER COLUMN "itemName" SET NOT NULL,
ALTER COLUMN "count" SET NOT NULL,
ALTER COLUMN "weightPerItem" SET NOT NULL,
ALTER COLUMN "ratePerKg" SET NOT NULL,
ALTER COLUMN "totalWeight" SET NOT NULL,
ALTER COLUMN "totalAmount" SET NOT NULL;
