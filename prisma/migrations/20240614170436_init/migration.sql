/*
  Warnings:

  - You are about to drop the column `ecoFlow` on the `dams` table. All the data in the column will be lost.
  - You are about to drop the column `hasEcoFlow` on the `dams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dams" DROP COLUMN "ecoFlow",
DROP COLUMN "hasEcoFlow",
ADD COLUMN     "btd_diameter" DOUBLE PRECISION,
ADD COLUMN     "btd_downsstream" TEXT,
ADD COLUMN     "btd_energy" TEXT,
ADD COLUMN     "btd_local" TEXT,
ADD COLUMN     "btd_maxflow" DOUBLE PRECISION,
ADD COLUMN     "btd_more" TEXT,
ADD COLUMN     "btd_number" INTEGER,
ADD COLUMN     "btd_section" TEXT,
ADD COLUMN     "btd_type" TEXT,
ADD COLUMN     "btd_upstream" TEXT,
ADD COLUMN     "ecocirc_flow" INTEGER,
ADD COLUMN     "ecocirc_more" TEXT,
ADD COLUMN     "has_btd" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "has_eco_circuit" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "has_hydropower" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "has_spillwayy" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hp_anual_energy" INTEGER,
ADD COLUMN     "hp_group_type" TEXT,
ADD COLUMN     "hp_local" TEXT,
ADD COLUMN     "hp_more" TEXT,
ADD COLUMN     "hp_power" INTEGER,
ADD COLUMN     "spillway_energy" TEXT,
ADD COLUMN     "spillway_floodgates" TEXT,
ADD COLUMN     "spillway_local" TEXT,
ADD COLUMN     "spillway_maxflow" INTEGER,
ADD COLUMN     "spillway_more" TEXT,
ADD COLUMN     "spillway_number" INTEGER,
ADD COLUMN     "spillway_sill_elevation" DOUBLE PRECISION,
ADD COLUMN     "spillway_sill_length" DOUBLE PRECISION,
ADD COLUMN     "spillway_type" TEXT;
