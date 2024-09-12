-- CreateEnum
CREATE TYPE "DamMaterial" AS ENUM ('Concrete', 'Embankment', 'Masonary', 'Mixed', 'Other');

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
    "data_modified" TIMESTAMP(3) NOT NULL,

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
    "total_capacity" DOUBLE PRECISION NOT NULL DEFAULT 0,
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
    "hazard_factor_X" DOUBLE PRECISION DEFAULT 0.0,
    "houses_downstream" INTEGER DEFAULT 0,
    "persons_downstream" INTEGER DEFAULT 0,
    "has_infrastructures" BOOLEAN DEFAULT false,
    "infrastructures" TEXT DEFAULT '',
    "sismicity" INTEGER DEFAULT 0,
    "geo_conditions" INTEGER DEFAULT 0,
    "design_flow" INTEGER DEFAULT 0,
    "reservoir_management" INTEGER DEFAULT 0,
    "env_harshness" INTEGER DEFAULT 0,
    "project_construction" INTEGER DEFAULT 0,
    "foundations" INTEGER DEFAULT 0,
    "discharge_structures" INTEGER DEFAULT 0,
    "maintenance" INTEGER DEFAULT 0,
    "has_pei" BOOLEAN DEFAULT false,
    "pei" TEXT DEFAULT '',
    "risk_E" DOUBLE PRECISION DEFAULT 0,
    "risk_V" DOUBLE PRECISION DEFAULT 0,
    "risk_D" DOUBLE PRECISION DEFAULT 0,
    "risk_global" DOUBLE PRECISION DEFAULT 0,
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
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "weather" TEXT NOT NULL,
    "weather_prior" TEXT NOT NULL,
    "reservoir_level" DOUBLE PRECISION NOT NULL,
    "tailwater_level" DOUBLE PRECISION,
    "inspection_phase" TEXT NOT NULL,
    "inspection_type" TEXT NOT NULL,
    "equipments_reading" BOOLEAN NOT NULL,
    "notes" TEXT NOT NULL,
    "summary" TEXT,
    "dam_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "section_level" INTEGER NOT NULL,
    "section_number" INTEGER NOT NULL,
    "parentId" TEXT,
    "notes" TEXT,
    "inspected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "inspectionId" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "notes" TEXT,
    "inspected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anomaly" (
    "id" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "hint" TEXT,
    "magnitudeId" TEXT NOT NULL,
    "perceivedRiskId" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anomaly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnomalyStatus" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "hint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnomalyStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnomalyPerceivedRisk" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "hint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnomalyPerceivedRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnomalyMagnitude" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "hint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnomalyMagnitude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemOnPhoto" (
    "item_id" TEXT NOT NULL,
    "photo_id" TEXT NOT NULL,

    CONSTRAINT "ItemOnPhoto_pkey" PRIMARY KEY ("item_id","photo_id")
);

-- CreateTable
CREATE TABLE "PersonOnInspection" (
    "personId" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonOnInspection_pkey" PRIMARY KEY ("personId","inspectionId")
);

-- CreateTable
CREATE TABLE "SectionOnInspection" (
    "sectionId" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionOnInspection_pkey" PRIMARY KEY ("sectionId","inspectionId")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionOnRecommendation" (
    "inspectionId" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InspectionOnRecommendation_pkey" PRIMARY KEY ("inspectionId","recommendationId")
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
CREATE UNIQUE INDEX "AnomalyStatus_label_key" ON "AnomalyStatus"("label");

-- CreateIndex
CREATE UNIQUE INDEX "AnomalyStatus_color_key" ON "AnomalyStatus"("color");

-- CreateIndex
CREATE UNIQUE INDEX "AnomalyPerceivedRisk_level_key" ON "AnomalyPerceivedRisk"("level");

-- CreateIndex
CREATE UNIQUE INDEX "AnomalyPerceivedRisk_color_key" ON "AnomalyPerceivedRisk"("color");

-- CreateIndex
CREATE UNIQUE INDEX "AnomalyMagnitude_level_key" ON "AnomalyMagnitude"("level");

-- CreateIndex
CREATE UNIQUE INDEX "AnomalyMagnitude_color_key" ON "AnomalyMagnitude"("color");

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
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_dam_id_fkey" FOREIGN KEY ("dam_id") REFERENCES "dam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anomaly" ADD CONSTRAINT "Anomaly_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "AnomalyStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anomaly" ADD CONSTRAINT "Anomaly_magnitudeId_fkey" FOREIGN KEY ("magnitudeId") REFERENCES "AnomalyMagnitude"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anomaly" ADD CONSTRAINT "Anomaly_perceivedRiskId_fkey" FOREIGN KEY ("perceivedRiskId") REFERENCES "AnomalyPerceivedRisk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anomaly" ADD CONSTRAINT "Anomaly_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOnPhoto" ADD CONSTRAINT "ItemOnPhoto_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOnPhoto" ADD CONSTRAINT "ItemOnPhoto_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOnInspection" ADD CONSTRAINT "PersonOnInspection_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOnInspection" ADD CONSTRAINT "PersonOnInspection_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionOnInspection" ADD CONSTRAINT "SectionOnInspection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionOnInspection" ADD CONSTRAINT "SectionOnInspection_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionOnRecommendation" ADD CONSTRAINT "InspectionOnRecommendation_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionOnRecommendation" ADD CONSTRAINT "InspectionOnRecommendation_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
