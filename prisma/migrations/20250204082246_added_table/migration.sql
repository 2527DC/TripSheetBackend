/*
  Warnings:

  - You are about to drop the `Man` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Man";

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "driverName" TEXT NOT NULL,
    "phoneNo" INTEGER NOT NULL,
    "vehicleNo" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "vendorName" TEXT NOT NULL,
    "phoneNo" INTEGER NOT NULL,
    "city" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_phoneNo_key" ON "Driver"("phoneNo");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_vehicleNo_key" ON "Driver"("vehicleNo");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_phoneNo_key" ON "Vendor"("phoneNo");
