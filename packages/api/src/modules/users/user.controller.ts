import { Request, Response } from "express";
import { userService } from "./user.service";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class UserController {
  public getMe = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      message: "اطلاعات کاربر با موفقیت دریافت شد.",
      data: req.user,
    });
  });

  public getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.findAllUsers();
    res.status(200).json({
      message: "لیست تمام کاربران با موفقیت دریافت شد.",
      data: users,
    });
  });

  public getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.findUserById(req.params.id);
    if (!user) {
      throw new ApiError(404, "کاربری با این شناسه یافت نشد.");
    }
    res.status(200).json({
      message: "اطلاعات کاربر با موفقیت دریافت شد.",
      data: user,
    });
  });
}

export const userController = new UserController();
