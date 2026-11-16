CREATE TYPE "ExamStatus" AS ENUM (
    'draft',
    'scheduled',
    'ongoing',
    'completed',
    'cancelled'
);

CREATE TABLE "exams" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "term" TEXT,
    "examDate" DATE NOT NULL,
    "startTime" VARCHAR(5),
    "endTime" VARCHAR(5),
    "durationMinutes" INTEGER,
    "totalMarks" DECIMAL(8,2) NOT NULL,
    "passingMarks" DECIMAL(8,2) NOT NULL,
    "status" "ExamStatus" NOT NULL DEFAULT 'draft',
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "exams_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "exams_totalMarks_positive_check" CHECK ("totalMarks" > 0),
    CONSTRAINT "exams_passingMarks_range_check"
        CHECK ("passingMarks" >= 0 AND "passingMarks" <= "totalMarks"),
    CONSTRAINT "exams_durationMinutes_positive_check"
        CHECK ("durationMinutes" IS NULL OR "durationMinutes" > 0),
    CONSTRAINT "exams_time_pair_check"
        CHECK (("startTime" IS NULL) = ("endTime" IS NULL)),
    CONSTRAINT "exams_time_order_check"
        CHECK ("startTime" IS NULL OR "startTime" < "endTime")
);

CREATE UNIQUE INDEX "exams_dedupe_key"
    ON "exams"("schoolId", "academicYearId", "sectionId", "subjectId", "name", "examDate");
CREATE INDEX "exams_schoolId_academicYearId_status_archivedAt_idx"
    ON "exams"("schoolId", "academicYearId", "status", "archivedAt");
CREATE INDEX "exams_schoolId_sectionId_examDate_idx"
    ON "exams"("schoolId", "sectionId", "examDate");
CREATE INDEX "exams_schoolId_subjectId_examDate_idx"
    ON "exams"("schoolId", "subjectId", "examDate");
CREATE INDEX "exams_schoolId_examDate_idx"
    ON "exams"("schoolId", "examDate");

ALTER TABLE "exams"
    ADD CONSTRAINT "exams_schoolId_fkey"
    FOREIGN KEY ("schoolId") REFERENCES "schools"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "exams"
    ADD CONSTRAINT "exams_academicYearId_fkey"
    FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "exams"
    ADD CONSTRAINT "exams_sectionId_fkey"
    FOREIGN KEY ("sectionId") REFERENCES "sections"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "exams"
    ADD CONSTRAINT "exams_subjectId_fkey"
    FOREIGN KEY ("subjectId") REFERENCES "subjects"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
