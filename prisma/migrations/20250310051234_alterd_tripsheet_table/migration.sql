/*
  Warnings:

  - You are about to drop the column `drivername` on the `TripSheet` table. All the data in the column will be lost.
  - Added the required column `driverName` to the `TripSheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripSheet" DROP COLUMN "drivername",
ADD COLUMN     "driverName" TEXT NOT NULL;
