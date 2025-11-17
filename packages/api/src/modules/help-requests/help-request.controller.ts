import { Request, Response } from "express";
import { helpRequestService } from "./help-request.service";
import {
  createHelpRequestSchema,
  updateHelpRequestStatusSchema,
  deleteHelpRequestSchema,
} from "./help-request.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { uploadService } from "../upload/upload.service";

class HelpRequestController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    // Validate
    const validatedData = createHelpRequestSchema.parse({ body: req.body });

    const helpRequestData: any = { ...validatedData.body };

    // Add media files if uploaded
    if (req.processedFiles && Array.isArray(req.processedFiles)) {
      helpRequestData.media = req.processedFiles;
    }

    const helpRequest = await helpRequestService.create(helpRequestData);

    res.status(201).json({
      message: "درخواست کمک شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.",
      data: helpRequest,
    });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const { status, search, page, limit } = req.query;

    const filters = {
      status: status as string,
      search: search as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    };

    const { helpRequests, total } = await helpRequestService.findAll(filters);

    res.status(200).json({
      results: helpRequests.length,
      total,
      data: helpRequests,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  });

  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const helpRequest = await helpRequestService.findOne(req.params.id);

    if (!helpRequest) {
      throw new ApiError(404, "درخواست کمک یافت نشد");
    }

    res.status(200).json({ data: helpRequest });
  });

  public updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateHelpRequestStatusSchema.parse({
      body: req.body,
      params: req.params,
    });

    const userId = req.user!._id.toString();

    const helpRequest = await helpRequestService.updateStatus(
      validatedData.params.id,
      validatedData.body.status,
      validatedData.body.adminNotes,
      userId
    );

    res.status(200).json({
      message: "وضعیت درخواست کمک به‌روزرسانی شد",
      data: helpRequest,
    });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = deleteHelpRequestSchema.parse({ params: req.params });

    // Get help request first to delete media files
    const helpRequest = await helpRequestService.findOne(validatedData.params.id);

    if (!helpRequest) {
      throw new ApiError(404, "درخواست کمک یافت نشد");
    }

    // Delete media files if exist
    if (helpRequest.media && helpRequest.media.length > 0) {
      await uploadService.deleteImage(helpRequest.media);
    }

    await helpRequestService.delete(validatedData.params.id);

    res.status(200).json({ message: "درخواست کمک با موفقیت حذف شد" });
  });

  public getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await helpRequestService.getStats();
    res.status(200).json({ data: stats });
  });
}

export const helpRequestController = new HelpRequestController();
