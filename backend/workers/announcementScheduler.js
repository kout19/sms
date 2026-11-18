const prisma = require("../config/prisma");
const {
  processDueAnnouncements,
  expireDueAnnouncements,
} = require("../modules/announcements/announcement.service");

const INTERVAL_MS = Number(process.env.ANNOUNCEMENT_WORKER_INTERVAL_MS || 60_000);
let running = false;

const tick = async () => {
  if (running) return;
  running = true;
  try {
    const [published, expired] = await Promise.all([
      processDueAnnouncements(),
      expireDueAnnouncements(),
    ]);
    if (published || expired) {
      console.log(`Announcement worker: published ${published}, expired ${expired}`);
    }
  } catch (error) {
    console.error("Announcement worker tick failed", error);
  } finally {
    running = false;
  }
};

const start = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await tick();
    const timer = setInterval(tick, Math.max(10_000, INTERVAL_MS));
    const shutdown = async () => {
      clearInterval(timer);
      await prisma.$disconnect();
      process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Announcement worker could not start", error);
    await prisma.$disconnect();
    process.exitCode = 1;
  }
};

start();
