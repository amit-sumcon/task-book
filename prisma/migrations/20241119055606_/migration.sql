/*
  Warnings:

  - Added the required column `updatedBy` to the `TaskDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskDetail" ADD COLUMN     "updatedBy" TEXT NOT NULL;
