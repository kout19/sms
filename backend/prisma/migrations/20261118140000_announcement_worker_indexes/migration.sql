CREATE INDEX "announcements_status_scheduled_for_idx" ON "announcements"("status", "scheduledFor");
CREATE INDEX "announcements_status_expires_at_idx" ON "announcements"("status", "expiresAt");
