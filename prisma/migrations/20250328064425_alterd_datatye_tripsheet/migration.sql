/*
  Warnings:

  - The `extraHr` column on the `TripSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `extraKm` column on the `TripSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TripSheet" DROP COLUMN "extraHr",
ADD COLUMN     "extraHr" INTEGER,
DROP COLUMN "extraKm",
ADD COLUMN     "extraKm" INTEGER;
