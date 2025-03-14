/*
  Warnings:

  - You are about to drop the column `driver_url` on the `TripSheet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TripSheet" DROP COLUMN "driver_url",
ADD COLUMN     "review" TEXT;
