/*
  Warnings:

  - You are about to drop the column `reviewerEmail` on the `AssignedTask` table. All the data in the column will be lost.
  - The `progress` column on the `AssignedTask` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Progress" AS ENUM ('Pending', 'In_Progress', 'Completed');

-- AlterTable
ALTER TABLE "AssignedTask" DROP COLUMN "reviewerEmail",
DROP COLUMN "progress",
ADD COLUMN     "progress" "Progress" NOT NULL DEFAULT 'Pending';
