/*
  Warnings:

  - Added the required column `driver_url` to the `Tripsheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guest_url` to the `Tripsheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tripsheet" ADD COLUMN     "driver_url" TEXT NOT NULL,
ADD COLUMN     "guest_url" TEXT NOT NULL;
