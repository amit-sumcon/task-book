/*
  Warnings:

  - Changed the type of `department` on the `TaskDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Department" AS ENUM ('ACCOUNTS', 'MDO', 'S_T', 'PM', 'MD', 'MANAGER_HO', 'COORDINATOR_HO', 'OHE', 'MARKETING_TENDER', 'HR', 'CA', 'BILLING_ENGINEER', 'SURVEYER_DEPARTMENT', 'OTHERS', 'OFFICE_EXECUTIVES', 'PURCHASE', 'QC_ENGINEER');

-- AlterTable
ALTER TABLE "TaskDetail" DROP COLUMN "department",
ADD COLUMN     "department" "Department" NOT NULL;
