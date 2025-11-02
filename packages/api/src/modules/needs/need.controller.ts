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

  // View Counter
  public incrementView = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await needService.incrementViews(id);
    res.status(200).json({ message: "بازدید با موفقیت ثبت شد." });
  });

  // Need Updates CRUD
  public createUpdate = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createNeedUpdateSchema.parse({ body: req.body, params: req.params });
    const need = await needService.addUpdate(validatedData.params.id, validatedData.body);
    if (!need) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(201).json({ message: "به‌روزرسانی با موفقیت ثبت شد.", data: need });
  });

  public getUpdates = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = await needService.getUpdates(id);
    if (!updates) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(200).json({ results: updates.length, data: updates });
  });

  public updateUpdate = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateNeedUpdateSchema.parse({ body: req.body, params: req.params });
    const need = await needService.updateUpdate(
      validatedData.params.id,
      validatedData.params.updateId,
      validatedData.body
    );
    if (!need) throw new ApiError(404, "نیاز یا به‌روزرسانی مورد نظر یافت نشد.");
    res.status(200).json({ message: "به‌روزرسانی با موفقیت ویرایش شد.", data: need });
  });

  public deleteUpdate = asyncHandler(async (req: Request, res: Response) => {
    const { id, updateId } = req.params;
    const need = await needService.deleteUpdate(id, updateId);
    if (!need) throw new ApiError(404, "نیاز یا به‌روزرسانی مورد نظر یافت نشد.");
    res.status(200).json({ message: "به‌روزرسانی با موفقیت حذف شد.", data: need });
  });

  // Geo-search
  public getNearby = asyncHandler(async (req: Request, res: Response) => {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      throw new ApiError(400, "موقعیت جغرافیایی (lat و lng) الزامی است.");
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusInKm = radius ? parseFloat(radius as string) : 50;

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new ApiError(400, "مقادیر lat و lng معتبر نیستند.");
    }

    const needs = await needService.findNearby(longitude, latitude, radiusInKm, req.query);
    res.status(200).json({ results: needs.length, data: needs });
  });

  // Special feeds
  public getTrending = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const needs = await needService.findTrending(limit);
    res.status(200).json({ results: needs.length, data: needs });
  });

  public getPopular = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const needs = await needService.findPopular(limit);
    res.status(200).json({ results: needs.length, data: needs });
  });

  public getUrgent = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const needs = await needService.findUrgent(limit);
    res.status(200).json({ results: needs.length, data: needs });
  });
}

export const needController = new NeedController();
