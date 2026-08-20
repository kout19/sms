const bcrypt = require("bcryptjs");
const toSafeUser =require("@packages/shared");

const comparePassword = async (candidatePassword, passwordHash) =>
  bcrypt.compare(candidatePassword, passwordHash);

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainPassword, salt);
};


const PUBLIC_USER_SELECT = {
  id: true,
  schoolId: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  phone: true,
  isActive: true,
  isEmailVerified: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
};

module.exports = {
  comparePassword,
  hashPassword,
  toSafeUser,
  PUBLIC_USER_SELECT,
};
