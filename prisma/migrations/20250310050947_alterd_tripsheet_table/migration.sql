/*
  Warnings:

  - You are about to drop the column `bookedBy` on the `TripSheet` table. All the data in the column will be lost.
  - You are about to drop the column `passengerName` on the `TripSheet` table. All the data in the column will be lost.
  - You are about to drop the column `passengerPh` on the `TripSheet` table. All the data in the column will be lost.
  - Added the required column `customer` to the `TripSheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPh` to the `TripSheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drivername` to the `TripSheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripSheet" DROP COLUMN "bookedBy",
DROP COLUMN "passengerName",
DROP COLUMN "passengerPh",
ADD COLUMN     "customer" TEXT NOT NULL,
ADD COLUMN     "customerPh" TEXT NOT NULL,
ADD COLUMN     "drivername" TEXT NOT NULL;
