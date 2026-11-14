# Subject Relationship Architecture Report

## Summary
The current SMS schema has a tenant-scoped `School`, users, teacher profiles, departments, and classes, but no first-class subject model. Subject management was still mocked in the admin UI and the database lacked any real academic subject or offering relationships.

## Existing entities and relationships
- `School` owns users, classes, departments, teacher profiles, and student profiles.
- `TeacherProfile` belongs to one school and one user, and may belong to a department.
- `Department` belongs to one school and can contain many teacher profiles.
- `Class` belongs to one school and stores grade, section, and academic year as columns.
- `StudentProfile` belongs to one class and one school through the class relationship.

## Missing or weak relationships
1. `Subject` to `School` — subject records need school isolation.
2. `Subject` to `Department` — departments are the academic grouping for subject ownership.
3. `Subject` to `Class` — a subject is offered to many classes, and a class can hold many subjects.
4. `Subject` to `TeacherProfile` — teachers can teach multiple subjects, and subjects can have multiple teachers.
5. `TeacherProfile` to `Class` in teaching context — assignments may be tied to a specific class and academic year.

## Proposed relationship model
- `Subject`: the canonical subject catalog for a school.
- `SubjectClass`: join table for subject offerings per class and academic year.
- `SubjectTeacherAssignment`: join table for teacher assignment to a subject, optionally scoped to a class and academic year.

This keeps the subject catalog normalized while allowing multiple classes and teacher assignments without duplicating subject rows.

## Cardinality and integrity rules
- A school can have many subjects; each subject belongs to exactly one school.
- A department can have many subjects; each subject belongs to at most one department.
- A class can be linked to many subjects; each subject can be linked to many classes.
- A teacher profile can be assigned to many subject records; a subject can have many teacher profiles.
- A teacher assignment is scoped by school, subject, and optionally class + academic year.

## Historical-data requirements
Teacher assignments and subject offerings should be versioned by academic year. This avoids mutating the historical record of previous student or teacher allocations when a subject is reassigned or a class changes.

## School-level isolation requirements
Every subject, subject-class link, and subject assignment is school-scoped and must be checked against the authenticated school before reads or writes.

## Frontend workflow changes
Admin subjects screens should load and filter from `/api/v1/admin/subjects`, assign department and class links, and allow teacher assignment updates without mutating subject rows in-place.

## Migration requirements
Introduce the new tables and foreign-key constraints before enabling the admin subjects UI to create or update real data. The migration must preserve current school data and avoid deleting historical records when a class or department is changed.
