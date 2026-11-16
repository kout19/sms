CREATE TYPE "AttendanceStatus" AS ENUM (
    'present',
    'absent',
    'late',
    'excused'
);

CREATE TABLE "attendance_sessions" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "subjectId" UUID,
    "teacherId" UUID,
    "attendanceDate" DATE NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'daily',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "attendance_sessions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "attendance_sessions_schoolId_fkey"
        FOREIGN KEY ("schoolId") REFERENCES "schools"("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attendance_sessions_academicYearId_fkey"
        FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attendance_sessions_sectionId_fkey"
        FOREIGN KEY ("sectionId") REFERENCES "sections"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attendance_sessions_subjectId_fkey"
        FOREIGN KEY ("subjectId") REFERENCES "subjects"("id")
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "attendance_sessions_teacherId_fkey"
        FOREIGN KEY ("teacherId") REFERENCES "users"("id")
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "attendance_records" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "studentProfileId" UUID NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "attendance_records_schoolId_fkey"
        FOREIGN KEY ("schoolId") REFERENCES "schools"("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attendance_records_sessionId_fkey"
        FOREIGN KEY ("sessionId") REFERENCES "attendance_sessions"("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attendance_records_studentProfileId_fkey"
        FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "attendance_sessions_dedupe_key"
    ON "attendance_sessions"("schoolId", "sectionId", "academicYearId", "attendanceDate", "type");
CREATE INDEX "attendance_sessions_schoolId_attendanceDate_idx"
    ON "attendance_sessions"("schoolId", "attendanceDate");
CREATE INDEX "attendance_sessions_schoolId_sectionId_attendanceDate_idx"
    ON "attendance_sessions"("schoolId", "sectionId", "attendanceDate");
CREATE INDEX "attendance_sessions_schoolId_academicYearId_attendanceDate_idx"
    ON "attendance_sessions"("schoolId", "academicYearId", "attendanceDate");
CREATE UNIQUE INDEX "attendance_records_session_student_key"
    ON "attendance_records"("sessionId", "studentProfileId");
CREATE INDEX "attendance_records_schoolId_sessionId_idx"
    ON "attendance_records"("schoolId", "sessionId");
CREATE INDEX "attendance_records_schoolId_studentProfileId_idx"
    ON "attendance_records"("schoolId", "studentProfileId");
CREATE INDEX "attendance_records_status_idx"
    ON "attendance_records"("status");
