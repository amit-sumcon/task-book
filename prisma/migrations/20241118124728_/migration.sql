/*
  Warnings:

  - The primary key for the `TaskDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `estimatedDuration` on the `TaskDetail` table. All the data in the column will be lost.
  - You are about to drop the column `plannedDate` on the `TaskDetail` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `TaskDetail` table. All the data in the column will be lost.
  - The `id` column on the `TaskDetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `priority` to the `AssignedTask` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `taskDetailId` on the `AssignedTask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AssignedTask" DROP CONSTRAINT "AssignedTask_taskDetailId_fkey";

-- AlterTable
ALTER TABLE "AssignedTask" ADD COLUMN     "estimatedDuration" INTEGER,
ADD COLUMN     "priority" "Priority" NOT NULL,
DROP COLUMN "taskDetailId",
ADD COLUMN     "taskDetailId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TaskDetail" DROP CONSTRAINT "TaskDetail_pkey",
DROP COLUMN "estimatedDuration",
DROP COLUMN "plannedDate",
DROP COLUMN "priority",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TaskDetail_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "AssignedTask_taskDetailId_fkey" FOREIGN KEY ("taskDetailId") REFERENCES "TaskDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
