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
    "openHr" DOUBLE PRECISION NOT NULL,
    "closeKm" DOUBLE PRECISION NOT NULL,
    "closeHr" DOUBLE PRECISION NOT NULL,
    "totalKm" DOUBLE PRECISION NOT NULL,
    "totalHr" DOUBLE PRECISION NOT NULL,
    "ms" TEXT,
    "reporting" TEXT,
    "bookedBy" TEXT NOT NULL,
    "journeyDetails" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Tripsheet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
