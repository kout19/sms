CREATE TABLE "academic_years" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

INSERT INTO "academic_years" ("id", "schoolId", "name", "createdAt", "updatedAt")
SELECT gen_random_uuid(), years."schoolId", years."academicYear", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (
    SELECT DISTINCT "schoolId", "academicYear"
    FROM "sections"
) AS years;

ALTER TABLE "sections" ADD COLUMN "academicYearId" UUID;
ALTER TABLE "enrollments" ADD COLUMN "academicYearId" UUID;

UPDATE "sections" AS section
SET "academicYearId" = year."id"
FROM "academic_years" AS year
WHERE year."schoolId" = section."schoolId"
  AND year."name" = section."academicYear";

UPDATE "enrollments" AS enrollment
SET "academicYearId" = year."id"
FROM "academic_years" AS year
WHERE year."schoolId" = enrollment."schoolId"
  AND year."name" = enrollment."academicYear";

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "sections" WHERE "academicYearId" IS NULL)
       OR EXISTS (SELECT 1 FROM "enrollments" WHERE "academicYearId" IS NULL) THEN
        RAISE EXCEPTION 'Cannot normalize academic years: one or more section or enrollment years could not be matched';
    END IF;
END $$;

ALTER TABLE "sections" ALTER COLUMN "academicYearId" SET NOT NULL;
ALTER TABLE "enrollments" ALTER COLUMN "academicYearId" SET NOT NULL;

DROP INDEX "sections_schoolId_classId_academicYear_name_key";
DROP INDEX "sections_schoolId_classId_academicYear_code_key";
DROP INDEX "sections_schoolId_academicYear_isActive_idx";
DROP INDEX "sections_classId_academicYear_idx";
DROP INDEX "enrollments_schoolId_studentProfileId_sectionId_academicYear_key";
DROP INDEX "enrollments_schoolId_sectionId_academicYear_isActive_idx";
DROP INDEX "enrollments_studentProfileId_academicYear_idx";

ALTER TABLE "sections" DROP COLUMN "academicYear";
ALTER TABLE "enrollments" DROP COLUMN "academicYear";

CREATE UNIQUE INDEX "academic_years_schoolId_name_key"
    ON "academic_years"("schoolId", "name");
CREATE INDEX "academic_years_schoolId_isActive_idx"
    ON "academic_years"("schoolId", "isActive");

CREATE UNIQUE INDEX "sections_schoolId_classId_academicYearId_name_key"
    ON "sections"("schoolId", "classId", "academicYearId", "name");
CREATE UNIQUE INDEX "sections_schoolId_classId_academicYearId_code_key"
    ON "sections"("schoolId", "classId", "academicYearId", "code");
CREATE INDEX "sections_schoolId_academicYearId_isActive_idx"
    ON "sections"("schoolId", "academicYearId", "isActive");
CREATE INDEX "sections_classId_academicYearId_idx"
    ON "sections"("classId", "academicYearId");

CREATE UNIQUE INDEX "enrollments_schoolId_studentProfileId_sectionId_academicYearId_key"
    ON "enrollments"("schoolId", "studentProfileId", "sectionId", "academicYearId");
CREATE INDEX "enrollments_schoolId_sectionId_academicYearId_isActive_idx"
    ON "enrollments"("schoolId", "sectionId", "academicYearId", "isActive");
CREATE INDEX "enrollments_studentProfileId_academicYearId_idx"
    ON "enrollments"("studentProfileId", "academicYearId");

ALTER TABLE "academic_years"
    ADD CONSTRAINT "academic_years_schoolId_fkey"
    FOREIGN KEY ("schoolId") REFERENCES "schools"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sections"
    ADD CONSTRAINT "sections_academicYearId_fkey"
    FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "enrollments"
    ADD CONSTRAINT "enrollments_academicYearId_fkey"
    FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
