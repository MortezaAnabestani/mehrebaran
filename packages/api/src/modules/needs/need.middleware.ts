import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { NeedModel } from "./need.model";
import { Types } from "mongoose";

export const isSupporter = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id: needId } = req.params;
  const userId = req.user!._id;

  if (!Types.ObjectId.isValid(needId)) {
    throw new ApiError(400, "شناسه نیاز معتبر نیست.");
  }

  const need = await NeedModel.findById(needId).select("supporters");

  if (!need) {
    throw new ApiError(404, "نیاز یافت نشد.");
  }

  const isUserSupporter = need.supporters.some((supporterId) => supporterId.equals(userId));

  if (!isUserSupporter) {
    throw new ApiError(403, "شما حامی این طرح نیستید و اجازه انجام این عملیات را ندارید.");
  }

  next();
});
