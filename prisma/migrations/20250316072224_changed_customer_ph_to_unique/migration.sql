/*
  Warnings:

  - A unique constraint covering the columns `[phoneNo]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Customers" DROP CONSTRAINT "Customers_companyId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Customers_phoneNo_key" ON "Customers"("phoneNo");

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
