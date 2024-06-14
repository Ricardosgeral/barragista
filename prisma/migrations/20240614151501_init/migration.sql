-- CreateEnum
CREATE TYPE "DamMaterial" AS ENUM ('Concrete', 'Earthfill', 'Masonary', 'Mixed', 'Other');

-- CreateEnum
CREATE TYPE "DamClass" AS ENUM ('I', 'II', 'III', 'Other');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('Draw', 'Image', 'Other');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "dams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" "DamClass",
    "material" "DamMaterial" NOT NULL,
    "structure" TEXT NOT NULL,
    "description" TEXT,
    "usages" TEXT[],
    "owner" TEXT,
    "promotor" TEXT,
    "builder" TEXT,
    "designer" TEXT,
    "project_year" TEXT,
    "completion_year" TEXT,
    "database_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "local" TEXT,
    "hydro_basin" TEXT,
    "water_line" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "watershed_area" BIGINT,
    "average_annual_prec" INTEGER,
    "flood_flow" INTEGER,
    "average_annual_flow" BIGINT,
    "return_period" INTEGER,
    "flood_area" BIGINT,
    "total_capacity" BIGINT,
    "useful_capacity" BIGINT,
    "dead_volume" BIGINT,
    "fsl" INTEGER,
    "mfl" INTEGER,
    "mol" INTEGER,
    "height_to_foundation" INTEGER,
    "height_to_natural" INTEGER,
    "crest_elevation" DOUBLE PRECISION,
    "crest_length" INTEGER,
    "crest_width" DOUBLE PRECISION,
    "embankment_volume" BIGINT,
    "concrete_volume" BIGINT,
    "foundation_geology" TEXT,
    "foundation_treatment" TEXT,
    "hasEcoFlow" BOOLEAN DEFAULT true,
    "ecoFlow" TEXT,
    "notes" TEXT,
    "cover_image" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT,

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
CREATE INDEX "dams_name_structure_user_id_idx" ON "dams"("name", "structure", "user_id");

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
ALTER TABLE "dams" ADD CONSTRAINT "dams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damFiles" ADD CONSTRAINT "damFiles_damId_fkey" FOREIGN KEY ("damId") REFERENCES "dams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
