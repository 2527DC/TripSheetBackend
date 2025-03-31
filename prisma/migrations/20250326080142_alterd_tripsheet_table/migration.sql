/*
  Warnings:

  - Added the required column `city` to the `TripSheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripSheet" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "extraHr" TEXT,
ADD COLUMN     "extraKm" TEXT;
