/*
  Warnings:

  - You are about to drop the `assigned_tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assigned_tasks" DROP CONSTRAINT "assigned_tasks_taskId_fkey";

-- DropForeignKey
ALTER TABLE "assigned_tasks" DROP CONSTRAINT "assigned_tasks_userId_fkey";

-- DropTable
DROP TABLE "assigned_tasks";

-- DropTable
DROP TABLE "task_details";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "taskCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "freq" "Frequency" NOT NULL,
    "department" "Department" NOT NULL,
    "planned" TIMESTAMP(3) NOT NULL,
    "actual" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT false,
    "doerEmail" TEXT NOT NULL,
    "doerName" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tasks_taskCode_key" ON "tasks"("taskCode");
