/*
  Warnings:

  - You are about to drop the column `vendorId` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_vendorId_fkey";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "vendorId";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "vendorId" INTEGER;

-- DropTable
DROP TABLE "address";

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
