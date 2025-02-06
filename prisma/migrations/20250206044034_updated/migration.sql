/*
  Warnings:

  - You are about to drop the column `signature` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "signature",
ADD COLUMN     "closeHr" TEXT,
ADD COLUMN     "closeKm" DOUBLE PRECISION,
ADD COLUMN     "driver_url" TEXT,
ADD COLUMN     "guest_url" TEXT,
ADD COLUMN     "openHr" TEXT,
ADD COLUMN     "openKm" DOUBLE PRECISION,
ADD COLUMN     "totalKm" DOUBLE PRECISION;
