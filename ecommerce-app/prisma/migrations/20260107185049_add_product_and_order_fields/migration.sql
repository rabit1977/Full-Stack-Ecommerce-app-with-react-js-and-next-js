-- AlterTable: Add new columns to Order with default values for existing rows
ALTER TABLE "Order" 
ADD COLUMN "billingAddress" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "shippingMethod" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "tax" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Update existing orders to have proper values
UPDATE "Order" 
SET 
  "subtotal" = "total",
  "grandTotal" = "total",
  "tax" = "total" * 0.08,
  "discount" = 0,
  "shippingCost" = 0;

-- AlterTable: Add new columns to OrderItem with defaults
ALTER TABLE "OrderItem" 
ADD COLUMN "priceAtPurchase" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "title" TEXT NOT NULL DEFAULT 'Unknown Product',
ADD COLUMN "thumbnail" TEXT;

-- Update existing order items with current product prices and titles
UPDATE "OrderItem" 
SET 
  "priceAtPurchase" = "price",
  "title" = COALESCE((SELECT "title" FROM "Product" WHERE "Product"."id" = "OrderItem"."productId"), 'Unknown Product');

-- AlterTable: Add new Product columns
ALTER TABLE "Product" 
ADD COLUMN "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "options" JSONB,
ADD COLUMN "specifications" JSONB,
ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable: Add helpful reviews to User
ALTER TABLE "User" 
ADD COLUMN "helpfulReviews" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable: Add fields to Review
ALTER TABLE "Review" 
ADD COLUMN "helpful" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "verifiedPurchase" BOOLEAN NOT NULL DEFAULT false;

-- CreateEnum: OrderStatus
DO $$ BEGIN
 CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AlterTable: Change Order status to use enum (preserve existing data)
ALTER TABLE "Order" 
ADD COLUMN "status_new" "OrderStatus" NOT NULL DEFAULT 'Pending';

-- Copy old status values to new column
UPDATE "Order" 
SET "status_new" = 
  CASE 
    WHEN "status"::text = 'Pending' THEN 'Pending'::"OrderStatus"
    WHEN "status"::text = 'Processing' THEN 'Processing'::"OrderStatus"
    WHEN "status"::text = 'Shipped' THEN 'Shipped'::"OrderStatus"
    WHEN "status"::text = 'Delivered' THEN 'Delivered'::"OrderStatus"
    WHEN "status"::text = 'Cancelled' THEN 'Cancelled'::"OrderStatus"
    ELSE 'Pending'::"OrderStatus"
  END;

-- Drop old column and rename new one
ALTER TABLE "Order" DROP COLUMN "status";
ALTER TABLE "Order" RENAME COLUMN "status_new" TO "status";

-- AlterTable: Add selectedOptions to CartItem if it exists
DO $$ BEGIN
 ALTER TABLE "CartItem" ADD COLUMN IF NOT EXISTS "selectedOptions" JSONB;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;