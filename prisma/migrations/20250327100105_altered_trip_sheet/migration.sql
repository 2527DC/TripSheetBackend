/*
  Warnings:

  - You are about to drop the column `dummy` on the `TripSheet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TripSheet" DROP COLUMN "dummy",
ADD COLUMN     "closingDate" TIMESTAMP(3),
ADD COLUMN     "driverSubmitted" TIMESTAMP(3);
