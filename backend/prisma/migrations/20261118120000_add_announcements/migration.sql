CREATE TYPE "AnnouncementStatus" AS ENUM (
    'draft', 'scheduled', 'published', 'expired', 'archived', 'cancelled'
);

CREATE TYPE "AnnouncementPriority" AS ENUM ('normal', 'important', 'urgent');

CREATE TYPE "AnnouncementAudienceType" AS ENUM ('all_users', 'role', 'class', 'section');

CREATE TYPE "AnnouncementAuditAction" AS ENUM (
    'created', 'updated', 'scheduled', 'published', 'cancelled', 'archived', 'expired'
);

CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "priority" "AnnouncementPriority" NOT NULL DEFAULT 'normal',
    "status" "AnnouncementStatus" NOT NULL DEFAULT 'draft',
    "scheduledFor" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "announcement_audience_rules" (
    "id" UUID NOT NULL,
    "announcementId" UUID NOT NULL,
    "type" "AnnouncementAudienceType" NOT NULL,
    "role" "UserRole",
    "classId" UUID,
    "sectionId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "announcement_audience_rules_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "announcement_audience_rule_shape_check" CHECK (
      ("type" = 'all_users' AND "role" IS NULL AND "classId" IS NULL AND "sectionId" IS NULL)
      OR ("type" = 'role' AND "role" IS NOT NULL AND "classId" IS NULL AND "sectionId" IS NULL)
      OR ("type" = 'class' AND "role" IS NULL AND "classId" IS NOT NULL AND "sectionId" IS NULL)
      OR ("type" = 'section' AND "role" IS NULL AND "classId" IS NULL AND "sectionId" IS NOT NULL)
    )
);

CREATE TABLE "announcement_recipients" (
    "id" UUID NOT NULL,
    "announcementId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "deliveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "announcement_recipients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "announcement_audit_events" (
    "id" UUID NOT NULL,
    "announcementId" UUID NOT NULL,
    "actorId" UUID,
    "schoolId" UUID NOT NULL,
    "action" "AnnouncementAuditAction" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "announcement_audit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "announcements_schoolId_status_createdAt_idx" ON "announcements"("schoolId", "status", "createdAt");
CREATE INDEX "announcements_schoolId_scheduledFor_idx" ON "announcements"("schoolId", "scheduledFor");
CREATE INDEX "announcements_schoolId_expiresAt_idx" ON "announcements"("schoolId", "expiresAt");
CREATE INDEX "announcements_schoolId_authorId_createdAt_idx" ON "announcements"("schoolId", "authorId", "createdAt");
CREATE INDEX "announcement_audience_rules_announcementId_idx" ON "announcement_audience_rules"("announcementId");
CREATE INDEX "announcement_audience_rules_classId_idx" ON "announcement_audience_rules"("classId");
CREATE INDEX "announcement_audience_rules_sectionId_idx" ON "announcement_audience_rules"("sectionId");
CREATE UNIQUE INDEX "announcement_recipients_announcement_user_key" ON "announcement_recipients"("announcementId", "userId");
CREATE INDEX "announcement_recipients_inbox_idx" ON "announcement_recipients"("schoolId", "userId", "readAt");
CREATE INDEX "announcement_recipients_read_idx" ON "announcement_recipients"("announcementId", "readAt");
CREATE INDEX "announcement_audit_events_announcementId_createdAt_idx" ON "announcement_audit_events"("announcementId", "createdAt");
CREATE INDEX "announcement_audit_events_schoolId_createdAt_idx" ON "announcement_audit_events"("schoolId", "createdAt");

ALTER TABLE "announcements" ADD CONSTRAINT "announcements_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "announcement_audience_rules" ADD CONSTRAINT "announcement_audience_rules_announcementId_fkey"
  FOREIGN KEY ("announcementId") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "announcement_audience_rules" ADD CONSTRAINT "announcement_audience_rules_classId_fkey"
  FOREIGN KEY ("classId") REFERENCES "school_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "announcement_audience_rules" ADD CONSTRAINT "announcement_audience_rules_sectionId_fkey"
  FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "announcement_recipients" ADD CONSTRAINT "announcement_recipients_announcementId_fkey"
  FOREIGN KEY ("announcementId") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "announcement_recipients" ADD CONSTRAINT "announcement_recipients_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "announcement_recipients" ADD CONSTRAINT "announcement_recipients_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "announcement_audit_events" ADD CONSTRAINT "announcement_audit_events_announcementId_fkey"
  FOREIGN KEY ("announcementId") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "announcement_audit_events" ADD CONSTRAINT "announcement_audit_events_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "announcement_audit_events" ADD CONSTRAINT "announcement_audit_events_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
