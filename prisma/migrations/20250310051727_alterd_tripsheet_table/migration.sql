/*
  Warnings:

  - Added the required column `category` to the `TripSheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripSheet" ADD COLUMN     "category" TEXT NOT NULL;
