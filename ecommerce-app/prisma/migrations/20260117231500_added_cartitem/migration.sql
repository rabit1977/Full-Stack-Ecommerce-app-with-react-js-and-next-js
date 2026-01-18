/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,selectedOptions]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Made the column `selectedOptions` on table `CartItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "CartItem_userId_productId_key";

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "selectedOptions" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_productId_selectedOptions_key" ON "CartItem"("userId", "productId", "selectedOptions");
