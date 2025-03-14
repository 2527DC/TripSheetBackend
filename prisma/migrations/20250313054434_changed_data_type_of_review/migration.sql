/*
  Warnings:

  - The `review` column on the `TripSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TripSheet" DROP COLUMN "review",
ADD COLUMN     "review" INTEGER;
