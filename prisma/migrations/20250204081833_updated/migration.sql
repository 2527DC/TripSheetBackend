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
CREATE TABLE "Tripsheet" (
    "id" SERIAL NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vehicleNo" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "openKm" DOUBLE PRECISION NOT NULL,
    "openHr" TEXT NOT NULL,
    "closeKm" DOUBLE PRECISION NOT NULL,
    "closeHr" TEXT NOT NULL,
    "totalKm" DOUBLE PRECISION NOT NULL,
    "totalHr" DOUBLE PRECISION NOT NULL,
    "ms" TEXT,
    "reporting" TEXT,
    "bookedBy" TEXT NOT NULL,
    "journeyDetails" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "driver_url" TEXT NOT NULL,
    "guest_url" TEXT NOT NULL,

    CONSTRAINT "Tripsheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "formId" TEXT NOT NULL,
    "drivername" TEXT NOT NULL,
    "vehicleNo" TEXT NOT NULL,
    "passengerName" TEXT NOT NULL,
    "passengerPh" TEXT NOT NULL,
    "reportingTime" TEXT NOT NULL,
    "reportingAddress" TEXT NOT NULL,
    "dropAddress" TEXT NOT NULL,
    "acType" TEXT NOT NULL,
    "signature" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Man" (
    "id" SERIAL NOT NULL,
    "formId" TEXT NOT NULL,
    "drivername" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Form_formId_key" ON "Form"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "Man_formId_key" ON "Man"("formId");
