import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

// تابع برای مدیریت خطای کلید تکراری
const handleDuplicateFieldsDB = (err: any) => {
  const field = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  const message = `مقدار '${value}' برای فیلد '${field}' از قبل وجود دارد. لطفاً مقدار دیگری را انتخاب کنید.`;
  return new ApiError(409, message); // 409 Conflict
};

// تابع برای مدیریت خطاهای اعتبارسنجی Mongoose
const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `داده‌های ورودی نامعتبر است: ${errors.join(". ")}`;
  return new ApiError(400, message);
};

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "خطای داخلی سرور";

  let error = { ...err, message: err.message };

  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (error.name === "ZodError") {
    const message = "داده‌های ورودی نامعتبر است.";
    const errors = error.flatten().fieldErrors;
    return res.status(400).json({ message, errors });
  }

  res.status(error.statusCode).json({
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default globalErrorHandler;
