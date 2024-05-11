-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('hr', 'admin', 'super_admin');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('pending', 'canceled', 'completed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "serName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT DEFAULT '',
    "role" "USER_ROLE" NOT NULL,
    "permissions" TEXT[],
    "profileImage" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trucks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pallets" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "doorSize" TEXT NOT NULL,
    "cargoSpace" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trucks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_requestes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pickupZip" TEXT NOT NULL,
    "deliveryZip" TEXT NOT NULL,
    "totalPices" TEXT NOT NULL,
    "totalWeight" DECIMAL(65,30) NOT NULL,
    "question" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_requestes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_requestes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mcNumber" TEXT NOT NULL,
    "loadDescription" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_requestes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custormer_requestes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "truckType" TEXT NOT NULL,
    "truckDescription" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custormer_requestes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
