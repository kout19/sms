/*
  Warnings:

  - You are about to drop the `StudentProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeacherProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherProfile" DROP CONSTRAINT "TeacherProfile_userId_fkey";

-- DropTable
DROP TABLE "StudentProfile";

-- DropTable
DROP TABLE "TeacherProfile";

-- CreateTable
CREATE TABLE "teacher_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "departmentId" UUID,
    "hireDate" TIMESTAMP(3),
    "qualifications" TEXT,
    "employeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "admissionNo" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "enrollmentDate" TIMESTAMP(3),
    "classId" UUID,
    "previousSchool" TEXT,
    "medicalNotes" TEXT,
    "address" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "capacity" INTEGER,
    "homeroomTeacherId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_userId_key" ON "teacher_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_admissionNo_key" ON "student_profiles"("admissionNo");

-- CreateIndex
CREATE INDEX "student_profiles_classId_idx" ON "student_profiles"("classId");

-- CreateIndex
CREATE INDEX "classes_schoolId_idx" ON "classes"("schoolId");

-- CreateIndex
CREATE INDEX "classes_homeroomTeacherId_idx" ON "classes"("homeroomTeacherId");

-- CreateIndex
CREATE UNIQUE INDEX "classes_schoolId_grade_section_academicYear_key" ON "classes"("schoolId", "grade", "section", "academicYear");

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_homeroomTeacherId_fkey" FOREIGN KEY ("homeroomTeacherId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
