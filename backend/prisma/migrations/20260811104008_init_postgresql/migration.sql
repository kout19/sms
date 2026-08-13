-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('super_admin', 'admin', 'teacher', 'student', 'parent','accountant','department_head');

-- CreateTable
CREATE TABLE "public"."schools" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "schoolId" UUID,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3),
    "refreshTokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schools_isActive_idx" ON "public"."schools"("isActive" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "schools_slug_key" ON "public"."schools"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_users_role" ON "public"."users"("role" ASC);

-- CreateIndex
CREATE INDEX "idx_users_school_id" ON "public"."users"("schoolId" ASC);

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "public"."users"("createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email" ASC);

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role" ASC);

-- CreateIndex
CREATE INDEX "users_schoolId_idx" ON "public"."users"("schoolId" ASC);

-- CreateIndex
CREATE INDEX "users_schoolId_role_idx" ON "public"."users"("schoolId" ASC, "role" ASC);

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

