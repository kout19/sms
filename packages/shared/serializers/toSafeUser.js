// packages/shared/serializers/toSafeUser.js
// One file, many small reusable functions. Each relationship gets its own
// function (toSafeSchool, toSafeClass, ...) so it's written once and reused
// everywhere it's needed - not re-inlined by hand in every serializer.

function toSafeSchool(school) {
  if (!school) return null;
  return {
    id: school.id || school._id,
    name: school.name,
    slug: school.slug,
    isActive: school.isActive,
  };
}

// Add more as new modules need them, same pattern:
// function toSafeClass(cls) { ... }
// function toSafeSubject(subject) { ... }

function toSafeUser(user) {
  if (!user) return null;

  return {
    id: user._id || user.id,
    schoolId: user.schoolId || null, // raw FK - always present even if `school` below isn't populated
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    role: user.role || null,
    phone: user.phone || null,
    isActive: user.isActive ?? true,
    isEmailVerified: user.isEmailVerified ?? false,
    lastLogin: user.lastLogin || null,
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null,

    // // populated relation - null if not populated on this query
    school: toSafeSchool(user.school),
  };
}

module.exports = {
  toSafeUser,
  toSafeSchool, // exported too - reusable directly wherever school data needs shaping outside a user context
};
