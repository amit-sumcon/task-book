/*
  Warnings:

  - You are about to drop the column `doerName` on the `AssignedTask` table. All the data in the column will be lost.
  - Added the required column `name` to the `AssignedTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignedTask" DROP COLUMN "doerName",
ADD COLUMN     "name" TEXT NOT NULL;
