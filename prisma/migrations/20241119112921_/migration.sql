/*
  Warnings:

  - You are about to drop the `AssignedTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssignedTask" DROP CONSTRAINT "AssignedTask_taskDetailId_fkey";

-- DropTable
DROP TABLE "AssignedTask";

-- DropTable
DROP TABLE "TaskDetail";

-- CreateTable
CREATE TABLE "task_details" (
    "id" SERIAL NOT NULL,
    "taskCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "freq" "Frequency" NOT NULL,
    "department" "Department" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assigned_tasks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "actual" TIMESTAMP(3),
    "planned" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "assignedBy" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assigned_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_details_taskCode_key" ON "task_details"("taskCode");

-- CreateIndex
CREATE UNIQUE INDEX "task_details_name_key" ON "task_details"("name");

-- AddForeignKey
ALTER TABLE "assigned_tasks" ADD CONSTRAINT "assigned_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_tasks" ADD CONSTRAINT "assigned_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
