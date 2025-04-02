-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "tripSheetId" INTEGER NOT NULL,
    "editedBy" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripSheet" (
    "id" SERIAL NOT NULL,
    "formId" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "driverPh" TEXT NOT NULL,
    "vehicleNo" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "customerPh" TEXT NOT NULL,
    "reportingAddress" TEXT NOT NULL,
    "dropAddress" TEXT NOT NULL,
    "acType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Assigned',
    "closeHr" TEXT,
    "closeKm" DOUBLE PRECISION,
    "guest_url" TEXT,
    "openHr" TEXT,
    "openKm" DOUBLE PRECISION,
    "totalKm" DOUBLE PRECISION,
    "parkingCharges" DOUBLE PRECISION,
    "toolCharges" DOUBLE PRECISION,
    "company" TEXT NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "totalHr" TEXT,
    "reportingTime" TEXT NOT NULL,
    "vendorName" TEXT,
    "category" TEXT NOT NULL,
    "review" INTEGER,
    "edit" BOOLEAN NOT NULL DEFAULT false,
    "extraHr" INTEGER,
    "extraKm" INTEGER,
    "city" TEXT NOT NULL,
    "driverSubmitted" TIMESTAMP(3),
    "reportingDate" TEXT NOT NULL,
    "closingDate" TEXT,
    "driverId" INTEGER,
    "vehicleId" INTEGER,
    "vendorId" INTEGER,
    "categoryId" INTEGER,
    "companyId" INTEGER,
    "customerId" INTEGER,

    CONSTRAINT "TripSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "vehicleNo" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vendorId" INTEGER,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hours" INTEGER,
    "KM" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TripSheet_formId_key" ON "TripSheet"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vehicleNo_key" ON "Vehicle"("vehicleNo");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_phoneNo_key" ON "Driver"("phoneNo");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_phoneNo_key" ON "Vendor"("phoneNo");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_phoneNo_key" ON "Customers"("phoneNo");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tripSheetId_fkey" FOREIGN KEY ("tripSheetId") REFERENCES "TripSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripSheet" ADD CONSTRAINT "TripSheet_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripSheet" ADD CONSTRAINT "TripSheet_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripSheet" ADD CONSTRAINT "TripSheet_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripSheet" ADD CONSTRAINT "TripSheet_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripSheet" ADD CONSTRAINT "TripSheet_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripSheet" ADD CONSTRAINT "TripSheet_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
