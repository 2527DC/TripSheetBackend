/*
  Warnings:

  - You are about to drop the column `signature` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "signature",
DROP COLUMN "status";
