const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ---- Global Middleware ----
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
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

// ---- Error Handling (always last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
