/*
  Warnings:

  - You are about to drop the column `check` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "check",
ADD COLUMN     "category" TEXT;
