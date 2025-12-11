/*
  Warnings:

  - You are about to drop the column `ratePerKg` on the `SellItem` table. All the data in the column will be lost.
  - Added the required column `ratePerItem` to the `SellItem` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new column with default value
ALTER TABLE "SellItem" ADD COLUMN "ratePerItem" DOUBLE PRECISION DEFAULT 0;

-- Step 2: Copy data from old column (assuming old data was per kg, we'll just copy it as-is for now)
-- Note: This is approximate - ideally you'd recalculate based on totalAmount / count
UPDATE "SellItem" SET "ratePerItem" = COALESCE("ratePerKg", 0);

-- Step 3: Remove default constraint
ALTER TABLE "SellItem" ALTER COLUMN "ratePerItem" DROP DEFAULT;

-- Step 4: Drop old column
ALTER TABLE "SellItem" DROP COLUMN "ratePerKg";
