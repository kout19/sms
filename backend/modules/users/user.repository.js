const { getPrisma } = require("../../infrastructure/prisma");
const { PUBLIC_USER_SELECT } = require("./user.helpers");

const prisma = () => getPrisma();

const findByEmailWithPassword = async (email) =>
  prisma().user.findUnique({
    where: { email },
  });

const findById = async (id) =>
  prisma().user.findUnique({
    where: { id },
    select: PUBLIC_USER_SELECT,
  });

const updateLastLogin = async (id) =>
  prisma().user.update({
    where: { id },
    data: { lastLogin: new Date() },
    select: PUBLIC_USER_SELECT,
  });

module.exports = {
  findByEmailWithPassword,
  findById,
  updateLastLogin,
};
