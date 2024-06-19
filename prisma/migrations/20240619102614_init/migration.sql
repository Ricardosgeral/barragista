-- CreateEnum
CREATE TYPE "DamMaterial" AS ENUM ('Concrete', 'Earthfill', 'Masonary', 'Mixed', 'Other');

-- CreateEnum
CREATE TYPE "DamClass" AS ENUM ('I', 'II', 'III', 'Unknown', 'Other');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('Draw', 'Image', 'Other');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "dams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" "DamClass" NOT NULL DEFAULT 'Unknown',
    "material" "DamMaterial" NOT NULL DEFAULT 'Other',
    "profile" TEXT NOT NULL DEFAULT '',
    "description" TEXT DEFAULT '',
    "usages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "owner" TEXT NOT NULL,
    "promotor" TEXT DEFAULT '',
    "builder" TEXT DEFAULT '',
    "designer" TEXT DEFAULT '',
    "project_year" TEXT NOT NULL DEFAULT '',
    "completion_year" TEXT NOT NULL DEFAULT '',
    "database_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country" TEXT NOT NULL DEFAULT 'PT',
    "state" TEXT NOT NULL DEFAULT '',
    "city" TEXT DEFAULT '',
    "local" TEXT DEFAULT '',
    "hydro_basin" TEXT DEFAULT '',
    "water_line" TEXT DEFAULT '',
    "latitude" TEXT NOT NULL DEFAULT '',
    "longitude" TEXT NOT NULL DEFAULT '',
    "watershed_area" TEXT NOT NULL DEFAULT '',
    "average_annual_prec" TEXT DEFAULT '',
    "flood_flow" TEXT DEFAULT '',
    "average_annual_flow" TEXT DEFAULT '',
    "return_period" INTEGER DEFAULT 0,
    "flood_area" TEXT NOT NULL DEFAULT '',
    "total_capacity" TEXT DEFAULT '',
    "useful_capacity" TEXT DEFAULT '',
    "dead_volume" TEXT DEFAULT '',
    "fsl" TEXT DEFAULT '',
    "mfl" TEXT DEFAULT '',
    "mol" TEXT DEFAULT '',
    "height_to_foundation" TEXT NOT NULL DEFAULT '',
    "height_to_natural" TEXT DEFAULT '',
    "crest_elevation" TEXT NOT NULL DEFAULT '',
    "crest_length" TEXT NOT NULL DEFAULT '',
    "crest_width" TEXT DEFAULT '',
    "embankment_volume" TEXT DEFAULT '',
    "concrete_volume" TEXT DEFAULT '',
    "foundation_geology" TEXT DEFAULT '',
    "foundation_treatment" TEXT DEFAULT '',
    "has_btd" BOOLEAN NOT NULL DEFAULT false,
    "btd_local" TEXT DEFAULT '',
    "btd_type" TEXT DEFAULT '',
    "btd_number" INTEGER DEFAULT 0,
    "btd_section" TEXT DEFAULT '',
    "btd_diameter" TEXT DEFAULT '',
    "btd_maxflow" TEXT DEFAULT '',
    "btd_upstream" TEXT DEFAULT '',
    "btd_downstream" TEXT DEFAULT '',
    "btd_energy" TEXT DEFAULT '',
    "btd_more" TEXT DEFAULT '',
    "has_spillway" BOOLEAN NOT NULL DEFAULT false,
    "spillway_local" TEXT DEFAULT '',
    "spillway_type" TEXT DEFAULT '',
    "spillway_number" INTEGER DEFAULT 0,
    "spillway_floodgates" TEXT DEFAULT '',
    "spillway_sill_elevation" TEXT DEFAULT '',
    "spillway_sill_length" TEXT DEFAULT '',
    "spillway_maxflow" TEXT DEFAULT '',
    "spillway_energy" TEXT DEFAULT '',
    "spillway_more" TEXT DEFAULT '',
    "has_hydropower" BOOLEAN NOT NULL DEFAULT false,
    "hp_local" TEXT DEFAULT '',
    "hp_number_groups" INTEGER DEFAULT 0,
    "hp_groups_type" TEXT DEFAULT '',
    "hp_power" TEXT DEFAULT '',
    "hp_annual_energy" TEXT DEFAULT '',
    "hp_more" TEXT DEFAULT '',
    "has_environ_circuit" BOOLEAN NOT NULL DEFAULT false,
    "environ_local" TEXT DEFAULT '',
    "environ_type_control" TEXT DEFAULT '',
    "environ_max_flow" TEXT DEFAULT '',
    "environ_ref_flow" TEXT DEFAULT '',
    "environ_more" TEXT DEFAULT '',
    "notes" TEXT DEFAULT '',
    "cover_image" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,

    CONSTRAINT "dams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damFiles" (
    "id" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "label" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "dams_name_key" ON "dams"("name");

-- CreateIndex
CREATE INDEX "dams_name_material_profile_height_to_foundation_country_sta_idx" ON "dams"("name", "material", "profile", "height_to_foundation", "country", "state", "city", "hydro_basin", "userId");

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
ALTER TABLE "dams" ADD CONSTRAINT "dams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damFiles" ADD CONSTRAINT "damFiles_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
