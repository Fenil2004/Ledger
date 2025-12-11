/*
  Warnings:

  - You are about to drop the column `itemCode` on the `SellItem` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `SellItem` table. All the data in the column will be lost.
  - You are about to drop the column `sheetBlack` on the `SellItem` table. All the data in the column will be lost.
  - You are about to drop the column `sheetHny` on the `SellItem` table. All the data in the column will be lost.
  - You are about to drop the column `shoesBlack` on the `SellItem` table. All the data in the column will be lost.
  - You are about to drop the column `shoesHny` on the `SellItem` table. All the data in the column will be lost.
  - Added the required column `count` to the `SellItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemName` to the `SellItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratePerKg` to the `SellItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `SellItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWeight` to the `SellItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightPerItem` to the `SellItem` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new columns with default values
ALTER TABLE "SellItem" 
ADD COLUMN "itemName" TEXT DEFAULT 'Unknown Item',
ADD COLUMN "count" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN "weightPerItem" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN "ratePerKg" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN "totalWeight" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN "totalAmount" DOUBLE PRECISION DEFAULT 0;

-- Step 2: Migrate existing data (copy itemCode to itemName and payment to totalAmount)
UPDATE "SellItem" 
SET 
  "itemName" = COALESCE("itemCode", 'Unknown Item'),
  "totalAmount" = COALESCE("payment", 0);

-- Step 3: Remove default constraints to make columns required
ALTER TABLE "SellItem" 
ALTER COLUMN "itemName" DROP DEFAULT,
ALTER COLUMN "count" DROP DEFAULT,
ALTER COLUMN "weightPerItem" DROP DEFAULT,
ALTER COLUMN "ratePerKg" DROP DEFAULT,
ALTER COLUMN "totalWeight" DROP DEFAULT,
ALTER COLUMN "totalAmount" DROP DEFAULT;

-- Step 4: Drop old columns
ALTER TABLE "SellItem" 
DROP COLUMN "itemCode",
DROP COLUMN "payment",
DROP COLUMN "sheetBlack",
DROP COLUMN "sheetHny",
DROP COLUMN "shoesBlack",
DROP COLUMN "shoesHny";
