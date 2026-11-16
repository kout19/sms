CREATE TABLE "school_classes" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "school_classes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sections" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "classId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "capacity" INTEGER,
    "room" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "homeroomTeacherId" UUID,
    "legacyClassId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "enrollments" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "studentProfileId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "academicYear" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "student_profiles" AS sp
        JOIN "users" AS u ON u."id" = sp."userId"
        JOIN "classes" AS c ON c."id" = sp."classId"
        WHERE sp."classId" IS NOT NULL AND u."schoolId" IS DISTINCT FROM c."schoolId"
    ) THEN
        RAISE EXCEPTION 'Cannot backfill enrollments: a student is assigned to a class from another school';
    END IF;
END $$;

INSERT INTO "school_classes" (
    "id", "schoolId", "name", "code", "grade", "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid(),
    grouped."schoolId",
    CASE
        WHEN grouped."grade" ~ '^[0-9]+$' THEN 'Grade ' || grouped."grade"
        ELSE grouped."grade"
    END,
    grouped."grade",
    grouped."grade",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT DISTINCT "schoolId", "grade"
    FROM "classes"
) AS grouped;

INSERT INTO "sections" (
    "id", "schoolId", "classId", "name", "code", "academicYear",
    "capacity", "homeroomTeacherId", "legacyClassId", "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid(),
    legacy."schoolId",
    school_class."id",
    legacy."section",
    legacy."section",
    legacy."academicYear",
    legacy."capacity",
    legacy."homeroomTeacherId",
    legacy."id",
    legacy."createdAt",
    legacy."updatedAt"
FROM "classes" AS legacy
JOIN "school_classes" AS school_class
  ON school_class."schoolId" = legacy."schoolId"
 AND school_class."grade" = legacy."grade";

INSERT INTO "enrollments" (
    "id", "schoolId", "studentProfileId", "sectionId", "academicYear",
    "isActive", "enrolledAt", "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid(),
    legacy."schoolId",
    sp."id",
    section."id",
    legacy."academicYear",
    true,
    COALESCE(sp."enrollmentDate", sp."createdAt"),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "student_profiles" AS sp
JOIN "users" AS u ON u."id" = sp."userId"
JOIN "classes" AS legacy ON legacy."id" = sp."classId"
JOIN "sections" AS section ON section."legacyClassId" = legacy."id"
WHERE u."schoolId" = legacy."schoolId";

CREATE UNIQUE INDEX "school_classes_schoolId_code_key"
    ON "school_classes"("schoolId", "code");
CREATE UNIQUE INDEX "school_classes_schoolId_grade_key"
    ON "school_classes"("schoolId", "grade");
CREATE INDEX "school_classes_schoolId_isActive_idx"
    ON "school_classes"("schoolId", "isActive");

CREATE UNIQUE INDEX "sections_legacyClassId_key"
    ON "sections"("legacyClassId");
CREATE UNIQUE INDEX "sections_schoolId_classId_academicYear_name_key"
    ON "sections"("schoolId", "classId", "academicYear", "name");
CREATE UNIQUE INDEX "sections_schoolId_classId_academicYear_code_key"
    ON "sections"("schoolId", "classId", "academicYear", "code");
CREATE INDEX "sections_schoolId_academicYear_isActive_idx"
    ON "sections"("schoolId", "academicYear", "isActive");
CREATE INDEX "sections_classId_academicYear_idx"
    ON "sections"("classId", "academicYear");
CREATE INDEX "sections_homeroomTeacherId_idx"
    ON "sections"("homeroomTeacherId");

CREATE UNIQUE INDEX "enrollments_schoolId_studentProfileId_sectionId_academicYear_key"
    ON "enrollments"("schoolId", "studentProfileId", "sectionId", "academicYear");
CREATE INDEX "enrollments_schoolId_sectionId_academicYear_isActive_idx"
    ON "enrollments"("schoolId", "sectionId", "academicYear", "isActive");
CREATE INDEX "enrollments_studentProfileId_academicYear_idx"
    ON "enrollments"("studentProfileId", "academicYear");

ALTER TABLE "school_classes"
    ADD CONSTRAINT "school_classes_schoolId_fkey"
    FOREIGN KEY ("schoolId") REFERENCES "schools"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sections"
    ADD CONSTRAINT "sections_schoolId_fkey"
    FOREIGN KEY ("schoolId") REFERENCES "schools"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sections"
    ADD CONSTRAINT "sections_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "school_classes"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sections"
    ADD CONSTRAINT "sections_homeroomTeacherId_fkey"
    FOREIGN KEY ("homeroomTeacherId") REFERENCES "users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sections"
    ADD CONSTRAINT "sections_legacyClassId_fkey"
    FOREIGN KEY ("legacyClassId") REFERENCES "classes"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "enrollments"
    ADD CONSTRAINT "enrollments_schoolId_fkey"
    FOREIGN KEY ("schoolId") REFERENCES "schools"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "enrollments"
    ADD CONSTRAINT "enrollments_studentProfileId_fkey"
    FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "enrollments"
    ADD CONSTRAINT "enrollments_sectionId_fkey"
    FOREIGN KEY ("sectionId") REFERENCES "sections"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
