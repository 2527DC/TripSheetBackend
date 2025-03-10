/*
  Warnings:

  - Added the required column `vehicleNo` to the `TripSheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripSheet" ADD COLUMN     "vehicleNo" TEXT NOT NULL;
