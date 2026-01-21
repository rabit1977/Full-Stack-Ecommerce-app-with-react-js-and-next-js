-- AlterTable
ALTER TABLE "User" ADD COLUMN     "couponId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
