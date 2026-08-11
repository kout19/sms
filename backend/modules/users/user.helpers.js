const bcrypt = require("bcryptjs");

const comparePassword = async (candidatePassword, passwordHash) =>
  bcrypt.compare(candidatePassword, passwordHash);

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainPassword, salt);
};

const toSafeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone ?? null,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    lastLogin: user.lastLogin,
    passwordChangedAt: user.passwordChangedAt,
    schoolId: user.schoolId ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
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
  passwordChangedAt: true,
  createdAt: true,
  updatedAt: true,
};

module.exports = {
  comparePassword,
  hashPassword,
  toSafeUser,
  PUBLIC_USER_SELECT,
};
