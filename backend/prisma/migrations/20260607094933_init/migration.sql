-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'HINDI', 'MARATHI', 'TAMIL', 'TELUGU', 'BENGALI');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('STUDENT', 'FARMER', 'WOMEN', 'SENIOR_CITIZEN', 'STARTUP_FOUNDER');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('MAHARASHTRA', 'TAMIL_NADU', 'KARNATAKA', 'PUNJAB', 'GUJARAT', 'RAJASTHAN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "preferredLanguage" "Language" NOT NULL DEFAULT 'ENGLISH',
    "category" "Category" NOT NULL DEFAULT 'STUDENT',
    "state" "State" NOT NULL DEFAULT 'MAHARASHTRA',
    "annualIncome" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_phone_key" ON "Profile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
