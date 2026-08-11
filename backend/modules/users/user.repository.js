const prisma = require("../../config/prisma");

const findByEmailWithPassword = async (email) => {
  return prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });
};

const findById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const updateLastLogin = async (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      lastLogin: new Date(),
    },
  });
};

module.exports = {
  findByEmailWithPassword,
  findById,
  updateLastLogin,
};
