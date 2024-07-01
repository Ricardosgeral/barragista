/*
  Warnings:

  - You are about to drop the `DamBody` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamBtDischarge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamEnvFlow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamFoundation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamHydrology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamHydropower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamReservoir` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamRisk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DamSpillway` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[damLocationId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damProjectId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damHydrologyId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damReservoirId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damBodyId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damFoundationId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damBtDischargeId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damSpillwayId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damEnvFlowId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damHydropowerId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[damRiskId]` on the table `dams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damBodyId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damBtDischargeId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damEnvFlowId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damFoundationId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damHydrologyId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damHydropowerId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damLocationId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damProjectId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damReservoirId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damRiskId_fkey";

-- DropForeignKey
ALTER TABLE "dams" DROP CONSTRAINT "dams_damSpillwayId_fkey";

-- DropTable
DROP TABLE "DamBody";

-- DropTable
DROP TABLE "DamBtDischarge";

-- DropTable
DROP TABLE "DamEnvFlow";

-- DropTable
DROP TABLE "DamFoundation";

-- DropTable
DROP TABLE "DamHydrology";

-- DropTable
DROP TABLE "DamHydropower";

-- DropTable
DROP TABLE "DamLocation";

-- DropTable
DROP TABLE "DamProject";

-- DropTable
DROP TABLE "DamReservoir";

-- DropTable
DROP TABLE "DamRisk";

-- DropTable
DROP TABLE "DamSpillway";

-- CreateTable
CREATE TABLE "damLocation" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'PT',
    "state" TEXT NOT NULL DEFAULT '',
    "city" TEXT DEFAULT '',
    "local" TEXT DEFAULT '',
    "hydro_basin" TEXT DEFAULT '',
    "water_line" TEXT DEFAULT '',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "damId" TEXT,

    CONSTRAINT "damLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damProject" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "promotor" TEXT DEFAULT '',
    "builder" TEXT DEFAULT '',
    "designer" TEXT DEFAULT '',
    "project_year" TEXT NOT NULL DEFAULT '',
    "completion_year" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT '',
    "damId" TEXT,

    CONSTRAINT "damProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damHydrology" (
    "id" TEXT NOT NULL,
    "watershed_area" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "average_annual_prec" INTEGER DEFAULT 0,
    "flood_flow" INTEGER DEFAULT 0,
    "average_annual_flow" DOUBLE PRECISION DEFAULT 0,
    "return_period" INTEGER DEFAULT 0,
    "damId" TEXT,

    CONSTRAINT "damHydrology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damReservoir" (
    "id" TEXT NOT NULL,
    "flood_area" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reservoir_length" DOUBLE PRECISION DEFAULT 0,
    "total_capacity" DOUBLE PRECISION DEFAULT 0,
    "useful_capacity" DOUBLE PRECISION DEFAULT 0,
    "dead_volume" DOUBLE PRECISION DEFAULT 0,
    "fsl" INTEGER DEFAULT 0,
    "mfl" INTEGER DEFAULT 0,
    "mol" INTEGER DEFAULT 0,
    "damId" TEXT,

    CONSTRAINT "damReservoir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damBody" (
    "id" TEXT NOT NULL,
    "height_to_foundation" INTEGER NOT NULL,
    "height_to_natural" INTEGER DEFAULT 0,
    "crest_elevation" DOUBLE PRECISION NOT NULL,
    "crest_length" INTEGER NOT NULL,
    "crest_width" DOUBLE PRECISION DEFAULT 0,
    "embankment_volume" DOUBLE PRECISION DEFAULT 0,
    "concrete_volume" DOUBLE PRECISION DEFAULT 0,
    "damId" TEXT,

    CONSTRAINT "damBody_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damFoundation" (
    "id" TEXT NOT NULL,
    "foundation_type" TEXT DEFAULT '',
    "foundation_geology" TEXT DEFAULT '',
    "foundation_impermeab" TEXT DEFAULT '',
    "foundation_treatment" TEXT DEFAULT '',
    "damId" TEXT,

    CONSTRAINT "damFoundation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damBtDischarge" (
    "id" TEXT NOT NULL,
    "has_btd" BOOLEAN NOT NULL DEFAULT false,
    "btd_local" TEXT DEFAULT '',
    "btd_type" TEXT DEFAULT '',
    "btd_number" INTEGER DEFAULT 0,
    "btd_section" TEXT DEFAULT '',
    "btd_diameter" DOUBLE PRECISION DEFAULT 0,
    "btd_maxflow" DOUBLE PRECISION DEFAULT 0,
    "btd_upstream" TEXT DEFAULT '',
    "btd_downstream" TEXT DEFAULT '',
    "btd_energy" TEXT DEFAULT '',
    "btd_more" TEXT DEFAULT '',
    "damId" TEXT,

    CONSTRAINT "damBtDischarge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damSpillway" (
    "id" TEXT NOT NULL,
    "has_spillway" BOOLEAN NOT NULL DEFAULT false,
    "spillway_local" TEXT DEFAULT '',
    "spillway_type" TEXT DEFAULT '',
    "spillway_number" INTEGER DEFAULT 0,
    "spillway_floodgates" TEXT DEFAULT '',
    "spillway_sill_elevation" DOUBLE PRECISION DEFAULT 0,
    "spillway_sill_length" DOUBLE PRECISION DEFAULT 0,
    "spillway_maxflow" INTEGER DEFAULT 0,
    "spillway_energy" TEXT DEFAULT '',
    "spillway_more" TEXT DEFAULT '',
    "damId" TEXT,

    CONSTRAINT "damSpillway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damEnvFlow" (
    "id" TEXT NOT NULL,
    "has_environ_circuit" BOOLEAN NOT NULL DEFAULT false,
    "environ_local" TEXT DEFAULT '',
    "environ_type_control" TEXT DEFAULT '',
    "environ_max_flow" DOUBLE PRECISION DEFAULT 0,
    "environ_ref_flow" DOUBLE PRECISION DEFAULT 0,
    "environ_more" TEXT DEFAULT '',
    "damId" TEXT,

    CONSTRAINT "damEnvFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damHydropower" (
    "id" TEXT NOT NULL,
    "has_hydropower" BOOLEAN NOT NULL DEFAULT false,
    "hp_local" TEXT DEFAULT '',
    "hp_number_groups" INTEGER DEFAULT 0,
    "hp_groups_type" TEXT DEFAULT '',
    "hp_power" INTEGER DEFAULT 0,
    "hp_annual_energy" INTEGER DEFAULT 0,
    "hp_more" TEXT DEFAULT '',
    "damId" TEXT,

    CONSTRAINT "damHydropower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damRisk" (
    "id" TEXT NOT NULL,
    "class" "DamClass" NOT NULL DEFAULT 'Unknown',
    "persons_downstream" INTEGER DEFAULT 0,
    "houses_downstream" INTEGER DEFAULT 0,
    "other_downstream" TEXT DEFAULT '',
    "resettlement" TEXT DEFAULT '',
    "sismicity" TEXT DEFAULT '',
    "geo_conditions" TEXT DEFAULT '',
    "design_flow" TEXT DEFAULT '',
    "reservoir_management" TEXT DEFAULT '',
    "env_harshness" TEXT DEFAULT '',
    "project_construction" TEXT DEFAULT '',
    "foundations" TEXT DEFAULT '',
    "discharge_structures" TEXT DEFAULT '',
    "maintenance" TEXT DEFAULT '',
    "damId" TEXT,

    CONSTRAINT "damRisk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "damLocation_damId_key" ON "damLocation"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damProject_damId_key" ON "damProject"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damHydrology_damId_key" ON "damHydrology"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damReservoir_damId_key" ON "damReservoir"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damBody_damId_key" ON "damBody"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damFoundation_damId_key" ON "damFoundation"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damBtDischarge_damId_key" ON "damBtDischarge"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damSpillway_damId_key" ON "damSpillway"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damEnvFlow_damId_key" ON "damEnvFlow"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damHydropower_damId_key" ON "damHydropower"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damRisk_damId_key" ON "damRisk"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damLocationId_key" ON "dams"("damLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damProjectId_key" ON "dams"("damProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damHydrologyId_key" ON "dams"("damHydrologyId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damReservoirId_key" ON "dams"("damReservoirId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damBodyId_key" ON "dams"("damBodyId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damFoundationId_key" ON "dams"("damFoundationId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damBtDischargeId_key" ON "dams"("damBtDischargeId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damSpillwayId_key" ON "dams"("damSpillwayId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damEnvFlowId_key" ON "dams"("damEnvFlowId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damHydropowerId_key" ON "dams"("damHydropowerId");

-- CreateIndex
CREATE UNIQUE INDEX "dams_damRiskId_key" ON "dams"("damRiskId");

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damLocationId_fkey" FOREIGN KEY ("damLocationId") REFERENCES "damLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damProjectId_fkey" FOREIGN KEY ("damProjectId") REFERENCES "damProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damHydrologyId_fkey" FOREIGN KEY ("damHydrologyId") REFERENCES "damHydrology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damReservoirId_fkey" FOREIGN KEY ("damReservoirId") REFERENCES "damReservoir"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damBodyId_fkey" FOREIGN KEY ("damBodyId") REFERENCES "damBody"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damFoundationId_fkey" FOREIGN KEY ("damFoundationId") REFERENCES "damFoundation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damBtDischargeId_fkey" FOREIGN KEY ("damBtDischargeId") REFERENCES "damBtDischarge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damSpillwayId_fkey" FOREIGN KEY ("damSpillwayId") REFERENCES "damSpillway"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damEnvFlowId_fkey" FOREIGN KEY ("damEnvFlowId") REFERENCES "damEnvFlow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damHydropowerId_fkey" FOREIGN KEY ("damHydropowerId") REFERENCES "damHydropower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dams" ADD CONSTRAINT "dams_damRiskId_fkey" FOREIGN KEY ("damRiskId") REFERENCES "damRisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
