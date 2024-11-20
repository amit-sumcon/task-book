/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `AssignedTask` table. All the data in the column will be lost.
  - The `status` column on the `AssignedTask` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AssignedTask" DROP COLUMN "isDeleted",
ALTER COLUMN "priority" SET DEFAULT 'LOW',
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Status";
