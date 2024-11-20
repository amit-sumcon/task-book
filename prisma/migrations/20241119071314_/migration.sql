/*
  Warnings:

  - You are about to drop the column `actualDate` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `buddyEmail` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `emailForBuddySystem` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDuration` on the `AssignedTask` table. All the data in the column will be lost.
  - Changed the type of `status` on the `AssignedTask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'In_Progress', 'Completed');

-- AlterTable
ALTER TABLE "AssignedTask" DROP COLUMN "actualDate",
DROP COLUMN "buddyEmail",
DROP COLUMN "emailForBuddySystem",
DROP COLUMN "estimatedDuration",
ADD COLUMN     "completionDate" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;
