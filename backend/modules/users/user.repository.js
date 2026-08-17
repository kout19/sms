const prisma = require("../../config/prisma");

const findByEmailWithPassword = async (email) => {
  return prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
    include: {
      school: true,
    },
  });
};

const findById = async (id) => {
 const user = await prisma.user.findUnique({
    where: { id },
    include: {
      school: true,
    },
  });
//  console.log("PRISMA FETCH USER:", JSON.stringify(user, null, 2));
 return user;
};

const updateLastLogin = async (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      lastLogin: new Date(),
    },
    include: {
      school: true,
    },
  });
};

module.exports = {
  findByEmailWithPassword,
  findById,
  updateLastLogin,
};
