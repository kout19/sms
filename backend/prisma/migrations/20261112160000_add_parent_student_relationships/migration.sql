CREATE TABLE "parent_students" (
    "schoolId" UUID NOT NULL,
    "parentId" UUID NOT NULL,
    "studentProfileId" UUID NOT NULL,
    "relationship" TEXT NOT NULL DEFAULT 'guardian',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_students_pkey" PRIMARY KEY ("schoolId", "parentId", "studentProfileId")
);

CREATE INDEX "parent_students_schoolId_parentId_idx"
    ON "parent_students"("schoolId", "parentId");

CREATE INDEX "parent_students_schoolId_studentProfileId_idx"
    ON "parent_students"("schoolId", "studentProfileId");

ALTER TABLE "parent_students"
    ADD CONSTRAINT "parent_students_schoolId_fkey"
    FOREIGN KEY ("schoolId") REFERENCES "schools"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "parent_students"
    ADD CONSTRAINT "parent_students_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "parent_students"
    ADD CONSTRAINT "parent_students_studentProfileId_fkey"
    FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
