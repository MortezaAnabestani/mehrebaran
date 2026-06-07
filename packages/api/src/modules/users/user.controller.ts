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
    const userId = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    const user = await userService.findUserById(userId);
    if (!user) {
      throw new ApiError(404, "کاربری با این شناسه یافت نشد.");
    }
    res.status(200).json({
      message: "اطلاعات کاربر با موفقیت دریافت شد.",
      data: user,
    });
  });

  public updateUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updates = req.body;

    // اگر فایل آپلود شده باشد، مسیر آن را به updates اضافه کن
    if (req.processedFiles?.desktop) {
      updates.avatar = req.processedFiles.desktop;
    }

    const id = typeof userId === "string" ? userId : userId[0];
    const user = await userService.updateUser(id, updates);
    if (!user) {
      throw new ApiError(404, "کاربری با این شناسه یافت نشد.");
    }

    res.status(200).json({
      message: "اطلاعات کاربر با موفقیت بروز شد.",
      data: user,
    });
  });

  public deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    const user = await userService.deleteUser(id);
    if (!user) {
      throw new ApiError(404, "کاربری با این شناسه یافت نشد.");
    }
    res.status(200).json({
      message: "کاربر با موفقیت حذف شد.",
    });
  });
}

export const userController = new UserController();
