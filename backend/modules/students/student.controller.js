const studentService = require("./student.service");
const { parseWorkbook, buildTemplateBuffer } = require("./student.workbook");
const {
  validateCreateStudent,
  validateUpdateStudent,
  validationErrorItems,
} = require("./student.validation");
const AppError = require("../../utils/AppError");

const requireSchoolId = (req) => {
  if (!req.tenant?.schoolId) {
    throw new AppError("Your account is not assigned to a school", 403);
  }
  return req.tenant.schoolId;
};

const rejectValidation = (error) => {
  throw new AppError("Validation failed", 400, validationErrorItems(error));
};

exports.list = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { search, classId, isActive, page, limit } = req.query;
    const result = await studentService.listStudents(schoolId, {
      search,
      classId,
      isActive: isActive === undefined ? undefined : isActive === "true",
      page,
      limit,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.listClasses = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const classes = await studentService.listClassesForSchool(schoolId);
    res.json({ data: classes });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const student = await studentService.getStudentById(schoolId, req.params.id);
    if (!student) return next(new AppError("Student not found", 404));
    res.json({ data: student });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateCreateStudent(req.body);
    if (error) rejectValidation(error);
    const student = await studentService.createStudent(schoolId, value);
    res.status(201).json({ data: student });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateUpdateStudent(req.body);
    if (error) rejectValidation(error);
    const student = await studentService.updateStudent(
      schoolId,
      req.params.id,
      value,
    );
    if (!student) return next(new AppError("Student not found", 404));
    res.json({ data: student });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const student = await studentService.deactivateStudent(
      schoolId,
      req.params.id,
    );
    if (!student) return next(new AppError("Student not found", 404));
    res.json({ data: student });
  } catch (error) {
    next(error);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const student = await studentService.toggleStudentStatus(
      schoolId,
      req.params.id,
    );
    if (!student) return next(new AppError("Student not found", 404));
    res.json({ data: student });
  } catch (error) {
    next(error);
  }
};

exports.template = async (req, res, next) => {
  try {
    requireSchoolId(req);
    const buffer = await buildTemplateBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="student-import-template.xlsx"',
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

const readRows = async (req) => {
  const schoolId = requireSchoolId(req);
  if (!req.file) {
    throw new AppError("Choose an Excel .xlsx file.", 400);
  }
  const rows = await parseWorkbook(req.file.buffer, req.file.originalname);
  return { schoolId, rows };
};

exports.previewImport = async (req, res, next) => {
  try {
    const { schoolId, rows } = await readRows(req);
    const summary = await studentService.previewImport(schoolId, rows);
    res.json({ data: summary });
  } catch (error) {
    next(error);
  }
};

exports.commitImport = async (req, res, next) => {
  try {
    const { schoolId, rows } = await readRows(req);
    const summary = await studentService.commitImport(schoolId, rows);
    res.json({ data: summary });
  } catch (error) {
    next(error);
  }
};
