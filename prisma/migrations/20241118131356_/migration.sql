/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TaskDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TaskDetail_name_key" ON "TaskDetail"("name");
