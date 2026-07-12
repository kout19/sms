const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// route imports (feature-based)
// const studentRoutes = require('./features/student/student.routes');
// const teacherRoutes = require('./features/teacher/teacher.routes');
// // ...more feature routes as you build them

// const errorHandler = require('./middlewares/errorHandler');
// const notFound = require('./middlewares/notFound');

const app = express();

// ---- Global Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---- Routes ----
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// app.use('/api/students', studentRoutes);
// app.use('/api/teachers', teacherRoutes);
// ...

// ---- Error Handling (always last) ----
// app.use(notFound);
// app.use(errorHandler);

module.exports = app;