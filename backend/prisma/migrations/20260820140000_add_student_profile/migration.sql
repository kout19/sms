-- CreateTable
CREATE TABLE "StudentProfile" (
    "userId" UUID NOT NULL,
    "gradeLevel" TEXT,
    "section" TEXT,
    "admissionNumber" TEXT,
    "rollNumber" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "StudentProfile"
ADD CONSTRAINT "StudentProfile_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
