-- AlterTable
ALTER TABLE "users" ADD COLUMN     "forcePasswordReset" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP DEFAULT;
