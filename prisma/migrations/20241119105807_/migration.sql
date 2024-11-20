/*
  Warnings:

  - You are about to drop the column `assignmentDate` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `completionDate` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `completionNotes` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `isUrgent` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `dependencies` on the `TaskDetail` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `TaskDetail` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `TaskDetail` table. All the data in the column will be lost.
  - Added the required column `planned` to the `AssignedTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freq` to the `TaskDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignedTask" DROP COLUMN "assignmentDate",
DROP COLUMN "completionDate",
DROP COLUMN "completionNotes",
DROP COLUMN "deadline",
DROP COLUMN "isUrgent",
DROP COLUMN "priority",
DROP COLUMN "progress",
ADD COLUMN     "actual" TIMESTAMP(3),
ADD COLUMN     "planned" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TaskDetail" DROP COLUMN "dependencies",
DROP COLUMN "frequency",
DROP COLUMN "isDeleted",
ADD COLUMN     "freq" "Frequency" NOT NULL;

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "Progress";
