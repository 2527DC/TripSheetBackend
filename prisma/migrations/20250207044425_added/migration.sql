/*
  Warnings:

  - The `parkingCharges` column on the `Form` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `toolCharges` column on the `Form` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "parkingCharges",
ADD COLUMN     "parkingCharges" DOUBLE PRECISION,
DROP COLUMN "toolCharges",
ADD COLUMN     "toolCharges" DOUBLE PRECISION;
