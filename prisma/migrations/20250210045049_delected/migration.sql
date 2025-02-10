/*
  Warnings:

  - You are about to drop the `Tripsheet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookedBy` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "bookedBy" TEXT NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL;

-- DropTable
DROP TABLE "Tripsheet";
