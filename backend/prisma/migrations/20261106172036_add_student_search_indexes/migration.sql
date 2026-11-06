-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateIndex
CREATE INDEX "student_profiles_admission_trgm_idx" ON "student_profiles" USING GIN ("admissionNo" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "users_schoolId_role_createdAt_idx" ON "users"("schoolId", "role", "createdAt");

-- CreateIndex
CREATE INDEX "users_first_name_trgm_idx" ON "users" USING GIN ("firstName" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "users_last_name_trgm_idx" ON "users" USING GIN ("lastName" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "users_email_trgm_idx" ON "users" USING GIN ("email" gin_trgm_ops);
