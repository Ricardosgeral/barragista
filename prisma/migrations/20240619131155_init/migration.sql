/*
  Warnings:

  - The `latitude` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `longitude` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `watershed_area` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `average_annual_prec` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `flood_flow` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `average_annual_flow` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `flood_area` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `total_capacity` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `useful_capacity` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dead_volume` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fsl` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `mfl` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `mol` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `height_to_natural` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `crest_width` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `embankment_volume` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `concrete_volume` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `btd_diameter` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `btd_maxflow` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `spillway_sill_elevation` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `spillway_sill_length` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `spillway_maxflow` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hp_power` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hp_annual_energy` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `environ_max_flow` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `environ_ref_flow` column on the `dams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `height_to_foundation` on the `dams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `crest_elevation` on the `dams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `crest_length` on the `dams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "dams" DROP COLUMN "latitude",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "longitude",
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "watershed_area",
ADD COLUMN     "watershed_area" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "average_annual_prec",
ADD COLUMN     "average_annual_prec" INTEGER DEFAULT 0,
DROP COLUMN "flood_flow",
ADD COLUMN     "flood_flow" INTEGER DEFAULT 0,
DROP COLUMN "average_annual_flow",
ADD COLUMN     "average_annual_flow" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "flood_area",
ADD COLUMN     "flood_area" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "total_capacity",
ADD COLUMN     "total_capacity" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "useful_capacity",
ADD COLUMN     "useful_capacity" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "dead_volume",
ADD COLUMN     "dead_volume" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "fsl",
ADD COLUMN     "fsl" INTEGER DEFAULT 0,
DROP COLUMN "mfl",
ADD COLUMN     "mfl" INTEGER DEFAULT 0,
DROP COLUMN "mol",
ADD COLUMN     "mol" INTEGER DEFAULT 0,
DROP COLUMN "height_to_foundation",
ADD COLUMN     "height_to_foundation" INTEGER NOT NULL,
DROP COLUMN "height_to_natural",
ADD COLUMN     "height_to_natural" INTEGER DEFAULT 0,
DROP COLUMN "crest_elevation",
ADD COLUMN     "crest_elevation" DOUBLE PRECISION NOT NULL,
DROP COLUMN "crest_length",
ADD COLUMN     "crest_length" INTEGER NOT NULL,
DROP COLUMN "crest_width",
ADD COLUMN     "crest_width" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "embankment_volume",
ADD COLUMN     "embankment_volume" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "concrete_volume",
ADD COLUMN     "concrete_volume" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "btd_diameter",
ADD COLUMN     "btd_diameter" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "btd_maxflow",
ADD COLUMN     "btd_maxflow" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "spillway_sill_elevation",
ADD COLUMN     "spillway_sill_elevation" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "spillway_sill_length",
ADD COLUMN     "spillway_sill_length" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "spillway_maxflow",
ADD COLUMN     "spillway_maxflow" INTEGER DEFAULT 0,
DROP COLUMN "hp_power",
ADD COLUMN     "hp_power" INTEGER DEFAULT 0,
DROP COLUMN "hp_annual_energy",
ADD COLUMN     "hp_annual_energy" INTEGER DEFAULT 0,
DROP COLUMN "environ_max_flow",
ADD COLUMN     "environ_max_flow" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "environ_ref_flow",
ADD COLUMN     "environ_ref_flow" DOUBLE PRECISION DEFAULT 0;

-- CreateIndex
CREATE INDEX "dams_name_material_profile_height_to_foundation_country_sta_idx" ON "dams"("name", "material", "profile", "height_to_foundation", "country", "state", "city", "hydro_basin", "userId");
