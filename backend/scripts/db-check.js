const prisma = require("../config/prisma");

(async () => {
  try {
    const message = prisma.message;
    const recipient = prisma.messageRecipient;
    if (typeof message === "undefined" || typeof recipient === "undefined") {
      throw new Error("Prisma client is missing message models");
    }
    const [messages, recipients] = await Promise.all([
      message.count(),
      recipient.count(),
    ]);
    console.log("Models OK", JSON.stringify({ messages, recipients }));
  } catch (error) {
    console.error("CHECK FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();