/*
  Warnings:

  - You are about to drop the column `reservoir_managment` on the `dams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dams" DROP COLUMN "reservoir_managment",
ADD COLUMN     "reservoir_management" TEXT DEFAULT '';
