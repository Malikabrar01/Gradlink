import fs from "fs";
import { allowedOrigins } from "./config/origins.js";
import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";
import { ApiError } from "./utils/ApiError.js";

const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());

// initialize user routes
import userRouter from "./routes/user.routes.js";
app.use("/gradlink/api/v1/users", userRouter);

app.use((err, req, res, next) => {
  const uploaded = [req.file, ...Object.values(req.files || {}).flat()].filter(Boolean);
  uploaded.forEach((f) => {
  if (f.path && fs.existsSync(f.path)) fs.unlink(f.path, () => {});
  });
  let customError = err;

  // If it's not an ApiError, convert it
  if (!(err instanceof ApiError)) {
    customError = new ApiError(
      err.statusCode || 500,
      err.message || "Internal Server Error",
      [], // Optional: collect validation or system errors
      process.env.NODE_ENV === "development" ? err.stack : ""
    );
  }

  res.status(customError.statusCode).json({
    success: customError.success,
    message: customError.message,
    errors: customError.errors,
    stack: process.env.NODE_ENV === "development" ? customError.stack : undefined,
  });
});

export { app };

