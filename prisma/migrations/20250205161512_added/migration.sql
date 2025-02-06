/*
  Warnings:

  - Added the required column `vehicleType` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "vehicleType" TEXT NOT NULL;
