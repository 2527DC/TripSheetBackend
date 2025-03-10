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
CREATE TABLE "TripSheet" (
    "id" SERIAL NOT NULL,
    "formId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "passengerName" TEXT NOT NULL,
    "passengerPh" TEXT NOT NULL,
    "reportingAddress" TEXT NOT NULL,
    "dropAddress" TEXT NOT NULL,
    "acType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "vehicleType" TEXT NOT NULL,
    "closeHr" DOUBLE PRECISION,
    "closeKm" DOUBLE PRECISION,
    "driver_url" TEXT,
    "guest_url" TEXT,
    "openHr" DOUBLE PRECISION,
    "openKm" DOUBLE PRECISION,
    "totalKm" DOUBLE PRECISION,
    "parkingCharges" DOUBLE PRECISION,
    "toolCharges" DOUBLE PRECISION,
    "bookedBy" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "totalHr" DOUBLE PRECISION,
    "reportingTime" TEXT NOT NULL,
    "vendorName" TEXT,

    CONSTRAINT "TripSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "vehicleNo" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "driverName" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "vendorId" INTEGER,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "vendorName" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "id" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "Vendor_vendorName_key" ON "Vendor"("vendorName");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
