/*
  Warnings:

  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('D', 'W', 'M', 'Y', 'Q', 'F', 'E1ST', 'E2ND', 'E3RD', 'E4TH', 'ELAST');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_verified";

-- CreateTable
CREATE TABLE "TaskDetail" (
    "id" TEXT NOT NULL,
    "taskCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "frequency" "Frequency" NOT NULL,
    "plannedDate" TIMESTAMP(3) NOT NULL,
    "priority" "Priority" NOT NULL,
    "estimatedDuration" INTEGER,
    "dependencies" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TaskDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignedTask" (
    "id" SERIAL NOT NULL,
    "doerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "actualDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "emailForBuddySystem" TEXT NOT NULL,
    "buddyEmail" TEXT NOT NULL,
    "assignmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3),
    "completionNotes" TEXT,
    "progress" INTEGER,
    "reviewerEmail" TEXT,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "taskDetailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AssignedTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskDetail_taskCode_key" ON "TaskDetail"("taskCode");

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "AssignedTask_taskDetailId_fkey" FOREIGN KEY ("taskDetailId") REFERENCES "TaskDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
