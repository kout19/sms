-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "departmentId" UUID,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "academicYear" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_classes" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "classId" UUID NOT NULL,
    "academicYear" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "subject_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_teacher_assignments" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "teacherProfileId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "classId" UUID,
    "academicYear" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "subject_teacher_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_code_key" ON "subjects"("schoolId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_name_key" ON "subjects"("schoolId", "name");

-- CreateIndex
CREATE INDEX "subjects_schoolId_isActive_idx" ON "subjects"("schoolId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "subject_classes_subjectId_classId_academicYear_key" ON "subject_classes"("subjectId", "classId", "academicYear");

-- CreateIndex
CREATE INDEX "subject_classes_schoolId_subjectId_idx" ON "subject_classes"("schoolId", "subjectId");

-- CreateIndex
CREATE INDEX "subject_classes_schoolId_classId_idx" ON "subject_classes"("schoolId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "subject_teacher_assignments_schoolId_teacherProfileId_subjectId_classId_academicYear_key" ON "subject_teacher_assignments"("schoolId", "teacherProfileId", "subjectId", "classId", "academicYear");

-- CreateIndex
CREATE INDEX "subject_teacher_assignments_schoolId_subjectId_idx" ON "subject_teacher_assignments"("schoolId", "subjectId");

-- CreateIndex
CREATE INDEX "subject_teacher_assignments_schoolId_teacherProfileId_idx" ON "subject_teacher_assignments"("schoolId", "teacherProfileId");

-- AddForeignKey
ALTER TABLE "subjects"
    ADD CONSTRAINT "subjects_schoolId_fkey"
    FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "subjects"
    ADD CONSTRAINT "subjects_departmentId_fkey"
    FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_classes"
    ADD CONSTRAINT "subject_classes_schoolId_fkey"
    FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "subject_classes"
    ADD CONSTRAINT "subject_classes_subjectId_fkey"
    FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "subject_classes"
    ADD CONSTRAINT "subject_classes_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_teacher_assignments"
    ADD CONSTRAINT "subject_teacher_assignments_schoolId_fkey"
    FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "subject_teacher_assignments"
    ADD CONSTRAINT "subject_teacher_assignments_teacherProfileId_fkey"
    FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "subject_teacher_assignments"
    ADD CONSTRAINT "subject_teacher_assignments_subjectId_fkey"
    FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "subject_teacher_assignments"
    ADD CONSTRAINT "subject_teacher_assignments_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
