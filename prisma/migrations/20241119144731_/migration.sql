/*
  Warnings:

  - The values [E4TH] on the enum `Frequency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Frequency_new" AS ENUM ('D', 'W', 'M', 'Y', 'Q', 'F', 'E1ST', 'E2ND', 'E3RD', 'ELAST');
ALTER TABLE "tasks" ALTER COLUMN "freq" TYPE "Frequency_new" USING ("freq"::text::"Frequency_new");
ALTER TYPE "Frequency" RENAME TO "Frequency_old";
ALTER TYPE "Frequency_new" RENAME TO "Frequency";
DROP TYPE "Frequency_old";
COMMIT;
