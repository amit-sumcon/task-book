/*
  Warnings:

  - The `dependencies` column on the `TaskDetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TaskDetail" DROP COLUMN "dependencies",
ADD COLUMN     "dependencies" JSONB;
