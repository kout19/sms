const studentService = require("./student.service");
const {
  validateCreateStudent,
  validateUpdateStudent,
} = require("./student.validation");
const AppError = require("../../utils/AppError");

exports.list = async (req, res, next) => {
  try {
    const { search, gradeLevel, isActive, page, limit } = req.query;
    const result = await studentService.listStudents(req.tenant.schoolId, {
      search,
      gradeLevel,
      isActive: isActive === undefined ? undefined : isActive === "true",
      page,
      limit,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(
      req.tenant.schoolId,
      req.params.id,
    );

    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.json({ data: student });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = validateCreateStudent(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const student = await studentService.createStudent(req.tenant.schoolId, value);
    res.status(201).json({ data: student });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = validateUpdateStudent(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const student = await studentService.updateStudent(
      req.tenant.schoolId,
      req.params.id,
      value,
    );

    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.json({ data: student });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const student = await studentService.deleteStudent(
      req.tenant.schoolId,
      req.params.id,
    );

    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const student = await studentService.toggleStudentStatus(
      req.tenant.schoolId,
      req.params.id,
    );

    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.json({ data: student });
  } catch (error) {
    next(error);
  }
};
