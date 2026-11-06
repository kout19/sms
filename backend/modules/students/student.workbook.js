const ExcelJS = require("exceljs");
const AppError = require("../../utils/AppError");
const {
  IMPORT_HEADERS,
  MAX_IMPORT_ROWS,
  MAX_IMPORT_BYTES,
} = require("./student.constants");

const SAMPLE_ROW = [
  "Amina",
  "Bekele",
  "amina.bekele@example.com",
  "ChangeMe123",
  "+251911000000",
  "ADM-1001",
  "2012-04-15",
  "female",
  "2026-09-01",
  "10",
  "A",
  "2026-2027",
  "Sara Bekele",
  "+251922000000",
  "sara.bekele@example.com",
  "Bole, Addis Ababa",
  "Previous Primary School",
  "",
];

const INSTRUCTIONS = [
  ["Student import instructions"],
  [""],
  ["Use the Students sheet. Do not rename the column headers."],
  ["Save the file as .xlsx. .xls workbooks and macro-enabled files are rejected."],
  [`Maximum ${MAX_IMPORT_ROWS} students and ${MAX_IMPORT_BYTES / (1024 * 1024)} MB per file.`],
  ["Replace the sample row before you import. It is treated as a real student if you leave it in the file."],
  [""],
  ["Required columns: firstName, lastName, email, password."],
  ["password must be 8 to 72 characters. The school does not store the spreadsheet after import."],
  ["email must be unique. admissionNo must be unique when you provide one."],
  ["Dates use YYYY-MM-DD. dateOfBirth must be in the past."],
  ["gender, when provided, must be female, male, or other."],
  [""],
  ["Class placement uses an existing class in your school."],
  ["Leave grade, section, and academicYear blank to import the student without a class."],
  ["When you set a class, all three values must match a class exactly, including the academic year."],
  ["This import does not create classes, parents, or guardian accounts."],
  ["guardianName, guardianPhone, and guardianEmail are contact details stored on the student."],
  [""],
  ["Valid rows are saved. Invalid rows and duplicates are reported and are not saved."],
  ["If a database conflict happens while saving the valid rows, none of those rows are kept."],
];

const formulaRejected = Symbol("formulaRejected");

const cellText = (value) => {
  if (value == null) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") {
    if (Object.prototype.hasOwnProperty.call(value, "formula")) {
      return formulaRejected;
    }
    if (Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text || "").join("").trim();
    }
    if (typeof value.text === "string") return value.text.trim();
    if (typeof value.result === "string" || typeof value.result === "number") {
      return String(value.result).trim();
    }
    return "";
  }
  return String(value).trim();
};

const assertWorkbookBuffer = (buffer, originalName = "") => {
  const name = String(originalName || "").toLowerCase();
  if (!name.endsWith(".xlsx")) {
    throw new AppError(
      "Save the workbook as .xlsx. Older .xls files are not accepted.",
      400,
    );
  }
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) {
    throw new AppError("The file is empty or not a valid Excel workbook.", 400);
  }
  if (buffer.length > MAX_IMPORT_BYTES) {
    throw new AppError("The file exceeds the 2 MB limit.", 400);
  }
  if (buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
    throw new AppError("The file content is not an Excel .xlsx workbook.", 400);
  }
  if (buffer.includes(Buffer.from("vbaProject.bin"))) {
    throw new AppError(
      "Workbooks with macros are not accepted. Save a macro-free .xlsx file.",
      400,
    );
  }
};

const buildTemplateBuffer = async () => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SMS";
  const sheet = workbook.addWorksheet("Students");
  sheet.addRow(IMPORT_HEADERS);
  sheet.addRow(SAMPLE_ROW);
  sheet.getRow(1).font = { bold: true };
  IMPORT_HEADERS.forEach((header, index) => {
    sheet.getColumn(index + 1).width = Math.max(header.length + 2, 18);
  });
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const instructions = workbook.addWorksheet("Instructions");
  instructions.addRows(INSTRUCTIONS);
  instructions.getColumn(1).width = 110;

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

const parseWorkbook = async (buffer, originalName) => {
  assertWorkbookBuffer(buffer, originalName);

  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer);
  } catch (error) {
    throw new AppError("The file is not a valid Excel workbook.", 400);
  }

  const sheet =
    workbook.getWorksheet("Students") || workbook.worksheets[0] || null;
  if (!sheet) {
    throw new AppError("The workbook has no worksheets.", 400);
  }

  const headerRow = sheet.getRow(1);
  const presentHeaders = [];
  headerRow.eachCell({ includeEmpty: false }, (cell, columnNumber) => {
    const text = cellText(cell.value);
    if (text === formulaRejected) {
      throw new AppError("Column headers cannot contain formulas.", 400);
    }
    presentHeaders.push({ columnNumber, name: text });
  });

  const names = presentHeaders.map((header) => header.name);
  const missing = IMPORT_HEADERS.filter((header) => !names.includes(header));
  const unexpected = names.filter((header) => !IMPORT_HEADERS.includes(header));
  if (missing.length || unexpected.length) {
    const parts = [];
    if (missing.length) parts.push(`Missing columns: ${missing.join(", ")}`);
    if (unexpected.length) {
      parts.push(`Unexpected columns: ${unexpected.join(", ")}`);
    }
    throw new AppError(parts.join(". "), 400);
  }

  const columnByName = new Map(
    presentHeaders.map((header) => [header.name, header.columnNumber]),
  );
  const rows = [];

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const sheetRow = sheet.getRow(rowNumber);
    const record = { rowNumber };
    let hasValue = false;
    let hasFormula = false;

    IMPORT_HEADERS.forEach((header) => {
      const text = cellText(sheetRow.getCell(columnByName.get(header)).value);
      if (text === formulaRejected) {
        hasFormula = true;
        record[header] = "";
        return;
      }
      record[header] = text;
      if (text) hasValue = true;
    });

    if (!hasValue) continue;

    if (hasFormula) {
      record.formulaError = "Enter values in the cells. Formulas are not imported.";
    }

    rows.push(record);
    if (rows.length > MAX_IMPORT_ROWS) {
      throw new AppError(
        `The file has more than ${MAX_IMPORT_ROWS} student rows.`,
        400,
      );
    }
  }

  if (!rows.length) {
    throw new AppError("The file has no student rows.", 400);
  }

  return rows;
};

module.exports = {
  buildTemplateBuffer,
  parseWorkbook,
  assertWorkbookBuffer,
};
