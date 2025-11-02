import { Request } from "express";
import { IUser } from "common-types";
import ApiError from "./apiError";

/**
 * دریافت کاربر احراز هویت شده از request
 * اگر user وجود نداشته باشد، خطای 401 می‌دهد
 */
export const getAuthUser = (req: Request): IUser => {
  if (!req.user) {
    throw new ApiError(401, "کاربر احراز هویت نشده است.");
  }
  return req.user as IUser;
};
