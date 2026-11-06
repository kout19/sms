-- AlterTable
ALTER TABLE "teacher_profiles" ADD COLUMN "schoolId" UUID;

UPDATE "teacher_profiles" AS tp
SET "schoolId" = u."schoolId"
FROM "users" AS u
WHERE u.id = tp."userId"
  AND tp."schoolId" IS NULL;

ALTER TABLE "teacher_profiles" ALTER COLUMN "schoolId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "teacher_profiles_schoolId_idx" ON "teacher_profiles"("schoolId");

-- CreateIndex
CREATE INDEX "teacher_profiles_employee_trgm_idx" ON "teacher_profiles" USING GIN ("employeeId" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_schoolId_employeeId_key" ON "teacher_profiles"("schoolId", "employeeId");

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
