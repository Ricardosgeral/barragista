/*
  Warnings:

  - You are about to drop the column `btd_downsstream` on the `dams` table. All the data in the column will be lost.
  - You are about to drop the column `has_spillwayy` on the `dams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dams" DROP COLUMN "btd_downsstream",
DROP COLUMN "has_spillwayy",
ADD COLUMN     "btd_downstream" TEXT,
ADD COLUMN     "has_spillway" BOOLEAN NOT NULL DEFAULT true;
