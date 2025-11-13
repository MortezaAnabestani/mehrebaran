import { Request, Response } from "express";
import { volunteerService } from "./volunteer.service";
import {
  registerVolunteerSchema,
  updateVolunteerSchema,
  approveVolunteerSchema,
  rejectVolunteerSchema,
  getVolunteersSchema,
} from "./volunteer.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class VolunteerController {
  // Register as volunteer (requires authentication)
  public register = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = registerVolunteerSchema.parse({ body: req.body });
    const userId = (req as any).user._id; // From auth middleware

    const registration = await volunteerService.register(validatedData.body, userId);

    res.status(201).json({
      message: "ثبت‌نام داوطلبی شما با موفقیت انجام شد و در انتظار تایید است.",
      data: registration,
    });
  });

  // Get registration by ID
  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const registration = await volunteerService.findById(id);

    if (!registration) {
      throw new ApiError(404, "ثبت‌نام داوطلب مورد نظر یافت نشد.");
    }

    res.status(200).json({ data: registration });
  });

  // Get registrations by project
  public getByProject = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = getVolunteersSchema.parse({
      params: req.params,
      query: req.query,
    });

    const registrations = await volunteerService.findByProject(
      validatedData.params.projectId,
      validatedData.query
    );

    res.status(200).json({
      results: registrations.length,
      data: registrations,
    });
  });

  // Get user's volunteer registrations
  public getMyRegistrations = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const registrations = await volunteerService.findByUser(userId);

    res.status(200).json({
      results: registrations.length,
      data: registrations,
    });
  });

  // Admin: Update volunteer registration
  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateVolunteerSchema.parse({
      body: req.body,
      params: req.params,
    });
    const adminId = (req as any).user._id;

    const registration = await volunteerService.update(
      validatedData.params.id,
      validatedData.body,
      adminId
    );

    res.status(200).json({
      message: "ثبت‌نام داوطلب به‌روزرسانی شد.",
      data: registration,
    });
  });

  // Admin: Approve volunteer
  public approve = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = approveVolunteerSchema.parse({
      body: req.body,
      params: req.params,
    });
    const adminId = (req as any).user._id;

    const registration = await volunteerService.approve(
      validatedData.params.id,
      adminId,
      validatedData.body.notes
    );

    res.status(200).json({
      message: "داوطلب تایید شد.",
      data: registration,
    });
  });

  // Admin: Reject volunteer
  public reject = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = rejectVolunteerSchema.parse({
      body: req.body,
      params: req.params,
    });
    const adminId = (req as any).user._id;

    const registration = await volunteerService.reject(
      validatedData.params.id,
      adminId,
      validatedData.body.reason
    );

    res.status(200).json({
      message: "داوطلب رد شد.",
      data: registration,
    });
  });

  // User: Withdraw from volunteering
  public withdraw = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const registration = await volunteerService.withdraw(id, userId);

    res.status(200).json({
      message: "انصراف شما ثبت شد.",
      data: registration,
    });
  });

  // Get volunteer statistics for project
  public getProjectStats = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const stats = await volunteerService.getProjectStats(projectId);

    res.status(200).json({ data: stats });
  });

  // Get active volunteers for project
  public getActiveVolunteers = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const volunteers = await volunteerService.getActiveVolunteers(projectId, limit);

    res.status(200).json({
      results: volunteers.length,
      data: volunteers,
    });
  });

  // Delete registration
  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await volunteerService.delete(id);

    res.status(200).json({ message: "ثبت‌نام داوطلب با موفقیت حذف شد." });
  });
}

export const volunteerController = new VolunteerController();
