const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const studentRoutes = require("./modules/students/student.routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const teacherRoutes = require("./modules/teachers/teacher.routes");
const departmentRoutes = require("./modules/departments/department.routes");
const subjectRoutes = require("./modules/subjects/subject.routes");
const accountantRoutes = require("./modules/accountants/accountant.routes");
const parentRoutes = require("./modules/parents/parent.route");

const app = express();

const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    process.env.CORS_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean),
);

// ---- Global Middleware ----
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ---- Routes ----
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/admin/departments", departmentRoutes);
app.use("/api/v1/admin/subjects", subjectRoutes);
app.use("/api/v1/admin/subjectes", subjectRoutes);
app.use("/api/v1/admin/accountants", accountantRoutes);
app.use("/api/v1/admin/parents", parentRoutes);

//-----Teachers routes-----

app.use("/api/v1/admin/teachers", teacherRoutes);

// ---- Error Handling (always last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
