const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PARENT_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  parentStudentLinks: {
    select: {
      relationship: true,
      studentProfile: {
        select: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          class: {
            select: {
              grade: true,
              section: true,
              academicYear: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  },
};

const toParent = (parent) => {
  if (!parent) return null;

  const { parentStudentLinks, ...parentData } = parent;
  return {
    ...parentData,
    name: `${parent.firstName} ${parent.lastName}`.trim(),
    children: (parentStudentLinks || []).map(({ relationship, studentProfile }) => ({
      id: studentProfile.user.id,
      name: `${studentProfile.user.firstName} ${studentProfile.user.lastName}`.trim(),
      grade: studentProfile.class
        ? `${studentProfile.class.grade}${studentProfile.class.section}`
        : "Unassigned",
      academicYear: studentProfile.class?.academicYear || null,
      relationship,
    })),
    registeredDate: parent.createdAt,
  };
};

module.exports = { UUID_PATTERN, PARENT_SELECT, toParent };