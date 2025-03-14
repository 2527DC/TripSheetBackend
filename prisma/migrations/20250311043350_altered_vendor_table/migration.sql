/*
  Warnings:

  - A unique constraint covering the columns `[vendorPh]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorPh` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vendor_vendorName_key";

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "vendorPh" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendorPh_key" ON "Vendor"("vendorPh");
