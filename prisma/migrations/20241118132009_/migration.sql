/*
  Warnings:

  - You are about to drop the column `department` on the `AssignedTask` table. All the data in the column will be lost.
  - Added the required column `department` to the `TaskDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignedTask" DROP COLUMN "department";

-- AlterTable
ALTER TABLE "TaskDetail" ADD COLUMN     "department" TEXT NOT NULL;
