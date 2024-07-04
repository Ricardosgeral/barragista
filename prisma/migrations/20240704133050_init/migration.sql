-- CreateEnum
CREATE TYPE "DamMaterial" AS ENUM ('Concrete', 'Earthfill', 'Masonary', 'Mixed', 'Other');

-- CreateEnum
CREATE TYPE "DamClass" AS ENUM ('I', 'II', 'III', 'Unknown', 'Other');

-- CreateEnum
CREATE TYPE "Foundation" AS ENUM ('Soil', 'Rock', 'Mixed', 'Unknown', 'Other');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('Draw', 'Image', 'Other');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "dam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "material" "DamMaterial" NOT NULL DEFAULT 'Other',
    "profile" JSONB,
    "purpose" JSONB,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT DEFAULT '',
    "damLocationId" TEXT,
    "damProjectId" TEXT,
    "damHydrologyId" TEXT,
    "damReservoirId" TEXT,
    "damBodyId" TEXT,
    "damFoundationId" TEXT,
    "damDischargeId" TEXT,
    "damSpillwayId" TEXT,
    "damEnvironmentalId" TEXT,
    "damHydropowerId" TEXT,
    "damRiskId" TEXT,
    "userId" TEXT,
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dam_pkey" PRIMARY KEY ("id")
);

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
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

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
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

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
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

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
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

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
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

    CONSTRAINT "damBody_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damFoundation" (
    "id" TEXT NOT NULL,
    "foundation_type" JSONB,
    "foundation_geology" TEXT DEFAULT '',
    "foundation_treatment" JSONB,
    "foundation_notes" TEXT DEFAULT '',
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

    CONSTRAINT "damFoundation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damDischarge" (
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
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

    CONSTRAINT "damDischarge_pkey" PRIMARY KEY ("id")
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
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

    CONSTRAINT "damSpillway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damEnvironmental" (
    "id" TEXT NOT NULL,
    "has_environ_circuit" BOOLEAN NOT NULL DEFAULT false,
    "environ_local" TEXT DEFAULT '',
    "environ_type_control" TEXT DEFAULT '',
    "environ_max_flow" DOUBLE PRECISION DEFAULT 0,
    "environ_ref_flow" DOUBLE PRECISION DEFAULT 0,
    "environ_more" TEXT DEFAULT '',
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

    CONSTRAINT "damEnvironmental_pkey" PRIMARY KEY ("id")
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
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

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
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

    CONSTRAINT "damRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damFiles" (
    "id" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "label" TEXT NOT NULL,
    "cover_image" INTEGER NOT NULL DEFAULT 0,
    "data_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "damId" TEXT NOT NULL,

    CONSTRAINT "damFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFactorToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwoFactorToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFactorConfirmation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TwoFactorConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dam_name_key" ON "dam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damLocationId_key" ON "dam"("damLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damProjectId_key" ON "dam"("damProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damHydrologyId_key" ON "dam"("damHydrologyId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damReservoirId_key" ON "dam"("damReservoirId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damBodyId_key" ON "dam"("damBodyId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damFoundationId_key" ON "dam"("damFoundationId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damDischargeId_key" ON "dam"("damDischargeId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damSpillwayId_key" ON "dam"("damSpillwayId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damEnvironmentalId_key" ON "dam"("damEnvironmentalId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damHydropowerId_key" ON "dam"("damHydropowerId");

-- CreateIndex
CREATE UNIQUE INDEX "dam_damRiskId_key" ON "dam"("damRiskId");

-- CreateIndex
CREATE INDEX "dam_damRiskId_damLocationId_damProjectId_damHydrologyId_dam_idx" ON "dam"("damRiskId", "damLocationId", "damProjectId", "damHydrologyId", "damReservoirId", "damBodyId", "damFoundationId", "damDischargeId", "damSpillwayId", "damEnvironmentalId", "damHydropowerId", "userId");

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
CREATE UNIQUE INDEX "damDischarge_damId_key" ON "damDischarge"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damSpillway_damId_key" ON "damSpillway"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damEnvironmental_damId_key" ON "damEnvironmental"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damHydropower_damId_key" ON "damHydropower"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "damRisk_damId_key" ON "damRisk"("damId");

-- CreateIndex
CREATE INDEX "damFiles_damId_idx" ON "damFiles"("damId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_token_key" ON "VerificationToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorToken_token_key" ON "TwoFactorToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorToken_email_token_key" ON "TwoFactorToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorConfirmation_userId_key" ON "TwoFactorConfirmation"("userId");

-- AddForeignKey
ALTER TABLE "dam" ADD CONSTRAINT "dam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damLocation" ADD CONSTRAINT "damLocation_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damProject" ADD CONSTRAINT "damProject_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damHydrology" ADD CONSTRAINT "damHydrology_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damReservoir" ADD CONSTRAINT "damReservoir_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damBody" ADD CONSTRAINT "damBody_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damFoundation" ADD CONSTRAINT "damFoundation_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damDischarge" ADD CONSTRAINT "damDischarge_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damSpillway" ADD CONSTRAINT "damSpillway_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damEnvironmental" ADD CONSTRAINT "damEnvironmental_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damHydropower" ADD CONSTRAINT "damHydropower_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damRisk" ADD CONSTRAINT "damRisk_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damFiles" ADD CONSTRAINT "damFiles_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
