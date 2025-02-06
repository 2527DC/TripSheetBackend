-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "signature" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
