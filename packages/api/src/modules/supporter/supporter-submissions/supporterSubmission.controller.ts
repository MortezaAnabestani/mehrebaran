import { Request, Response } from "express";
import { supporterSubmissionService } from "./supporterSubmission.service";
import { createSubmissionSchema, updateSubmissionStatusSchema } from "./supporterSubmission.validation";
import asyncHandler from "../../../core/utils/asyncHandler";
import ApiError from "../../../core/utils/apiError";

class SupporterSubmissionController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const { body } = createSubmissionSchema.parse({ body: req.body, params: req.params });
    const submitter = req.user!._id;

    const submissionData = {
      ...body,
      need: needId,
      submitter,
    };

    const submission = await supporterSubmissionService.create(submissionData);
    res
      .status(201)
      .json({ message: "تصویر شما با موفقیت ارسال شد و پس از تایید نمایش داده خواهد شد.", data: submission });
  });

  public getByNeed = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const submissions = await supporterSubmissionService.findByNeed(needId);
    res.status(200).json({ data: submissions });
  });

  public getAllForAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const submissions = await supporterSubmissionService.findAllForAdmin(needId);
    res.status(200).json({ data: submissions });
  });

  public updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    const { body } = updateSubmissionStatusSchema.parse({ body: req.body, params: req.params });

    const submission = await supporterSubmissionService.updateStatus(submissionId, body.status);
    if (!submission) {
      throw new ApiError(404, "تصویر ارسالی یافت نشد.");
    }
    res.status(200).json({ message: "وضعیت تصویر با موفقیت به‌روزرسانی شد.", data: submission });
  });
}

export const supporterSubmissionController = new SupporterSubmissionController();
