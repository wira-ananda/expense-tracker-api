/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerkId" TEXT,
ADD COLUMN     "phone_number" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
