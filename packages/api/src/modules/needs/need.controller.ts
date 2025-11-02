import { Request, Response } from "express";
import { needService } from "./need.service";
import {
  createNeedSchema,
  updateNeedSchema,
  createNeedUpdateSchema,
  updateNeedUpdateSchema,
} from "./need.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class NeedController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    let submissionData = { ...req.body };
    if (req.user) {
      submissionData.submittedBy = { user: req.user._id };
    } else {
      if (!req.body.guestName || !req.body.guestEmail) {
        throw new ApiError(400, "برای ثبت نیاز به عنوان مهمان، نام و ایمیل الزامی است.");
      }
      submissionData.submittedBy = { guestName: req.body.guestName, guestEmail: req.body.guestEmail };
    }
    const validatedData = createNeedSchema.parse({ body: submissionData });
    const need = await needService.create(validatedData.body);
    res
      .status(201)
      .json({ message: "نیاز شما با موفقیت ثبت شد و پس از تایید در سایت قرار خواهد گرفت.", data: need });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const needs = await needService.findAll(req.query);
    res.status(200).json({ results: needs.length, data: needs });
  });

  public getAllForAdmin = asyncHandler(async (req: Request, res: Response) => {
    const needs = await needService.findAllForAdmin(req.query);
    res.status(200).json({ results: needs.length, data: needs });
  });

  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const need = await needService.findOne(req.params.identifier);
    if (!need) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(200).json({ data: need });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateNeedSchema.parse({ body: req.body, params: req.params });
    const need = await needService.update(validatedData.params.id, validatedData.body);
    if (!need) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(200).json({ message: "نیاز با موفقیت به‌روزرسانی شد.", data: need });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const need = await needService.findOne(id);
    if (!need) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    await needService.delete(id);
    res.status(200).json({ message: "نیاز با موفقیت حذف شد." });
  });

  public toggleUpvote = asyncHandler(async (req: Request, res: Response) => {
    const need = await needService.toggleUpvote(req.params.id, req.user!._id.toString());
    res.status(200).json({ message: "عملیات رأی با موفقیت انجام شد.", data: need });
  });

  public addSupporter = asyncHandler(async (req: Request, res: Response) => {
    await needService.addSupporter(req.params.id, req.user!._id.toString());
    res.status(200).json({ message: "شما با موفقیت به حامیان این طرح پیوستید." });
  });
}

export const needController = new NeedController();
