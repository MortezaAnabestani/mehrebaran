import { Request, Response } from "express";
import { needService } from "./need.service";
import {
  createNeedSchema,
  updateNeedSchema,
  createNeedUpdateSchema,
  updateNeedUpdateSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  completeMilestoneSchema,
  createBudgetItemSchema,
  updateBudgetItemSchema,
  addFundsToBudgetItemSchema,
  createVerificationRequestSchema,
  reviewVerificationRequestSchema,
  createTaskSchema,
  updateTaskSchema,
  updateTaskChecklistSchema,
  updateSupporterDetailSchema,
  addContributionSchema,
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
<<<<<<< HEAD
=======

  // Supporter Details
  public getSupporterDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.query;
    const supporterDetails = await needService.getSupporterDetails(id, userId as string);
    if (!supporterDetails) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(200).json({ results: supporterDetails.length, data: supporterDetails });
  });

  public updateSupporterDetail = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateSupporterDetailSchema.parse({ body: req.body, params: req.params });
    const need = await needService.updateSupporterDetail(
      validatedData.params.id,
      validatedData.params.userId,
      validatedData.body
    );
    if (!need) throw new ApiError(404, "نیاز یا حامی مورد نظر یافت نشد.");
    res.status(200).json({ message: "اطلاعات حامی با موفقیت به‌روزرسانی شد.", data: need });
  });

  public addContribution = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = addContributionSchema.parse({ body: req.body, params: req.params });
    const need = await needService.addContribution(
      validatedData.params.id,
      validatedData.params.userId,
      validatedData.body
    );
    if (!need) throw new ApiError(404, "نیاز یا حامی مورد نظر یافت نشد.");
    res.status(201).json({ message: "مشارکت با موفقیت ثبت شد.", data: need });
  });

  public removeSupporterDetail = asyncHandler(async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    const { reason } = req.body;
    const need = await needService.removeSupporterDetail(id, userId, reason);
    if (!need) throw new ApiError(404, "نیاز یا حامی مورد نظر یافت نشد.");
    res.status(200).json({ message: "حامی با موفقیت حذف شد.", data: need });
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

  // Milestones CRUD
  public getMilestones = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const milestones = await needService.getMilestones(id);
    if (!milestones) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(200).json({ results: milestones.length, data: milestones });
  });

  public createMilestone = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createMilestoneSchema.parse({ body: req.body, params: req.params });

    // Convert date strings to Date objects
    const milestoneData = {
      ...validatedData.body,
      targetDate: typeof validatedData.body.targetDate === 'string'
        ? new Date(validatedData.body.targetDate)
        : validatedData.body.targetDate,
    };

    const need = await needService.addMilestone(validatedData.params.id, milestoneData);
    if (!need) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(201).json({ message: "مایلستون با موفقیت ثبت شد.", data: need });
  });

  public updateMilestone = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateMilestoneSchema.parse({ body: req.body, params: req.params });

    // Convert date strings to Date objects
    const updateData: any = { ...validatedData.body };
    if (updateData.targetDate && typeof updateData.targetDate === 'string') {
      updateData.targetDate = new Date(updateData.targetDate);
    }
    if (updateData.completionDate && typeof updateData.completionDate === 'string') {
      updateData.completionDate = new Date(updateData.completionDate);
    }

    const need = await needService.updateMilestone(
      validatedData.params.id,
      validatedData.params.milestoneId,
      updateData
    );
    if (!need) throw new ApiError(404, "نیاز یا مایلستون مورد نظر یافت نشد.");
    res.status(200).json({ message: "مایلستون با موفقیت به‌روزرسانی شد.", data: need });
  });

  public deleteMilestone = asyncHandler(async (req: Request, res: Response) => {
    const { id, milestoneId } = req.params;
    const need = await needService.deleteMilestone(id, milestoneId);
    if (!need) throw new ApiError(404, "نیاز یا مایلستون مورد نظر یافت نشد.");
    res.status(200).json({ message: "مایلستون با موفقیت حذف شد.", data: need });
  });

  public completeMilestone = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = completeMilestoneSchema.parse({ body: req.body, params: req.params });
    const need = await needService.completeMilestone(
      validatedData.params.id,
      validatedData.params.milestoneId,
      validatedData.body.evidence
    );
    if (!need) throw new ApiError(404, "نیاز یا مایلستون مورد نظر یافت نشد.");
    res.status(200).json({ message: "مایلستون با موفقیت تکمیل شد.", data: need });
  });

  // Budget Items CRUD
  public getBudgetItems = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const budgetItems = await needService.getBudgetItems(id);
    if (!budgetItems) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(200).json({ results: budgetItems.length, data: budgetItems });
  });

  public createBudgetItem = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createBudgetItemSchema.parse({ body: req.body, params: req.params });
    const need = await needService.addBudgetItem(validatedData.params.id, validatedData.body);
    if (!need) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(201).json({ message: "قلم بودجه با موفقیت ثبت شد.", data: need });
  });

  public updateBudgetItem = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateBudgetItemSchema.parse({ body: req.body, params: req.params });
    const need = await needService.updateBudgetItem(
      validatedData.params.id,
      validatedData.params.budgetItemId,
      validatedData.body
    );
    if (!need) throw new ApiError(404, "نیاز یا قلم بودجه مورد نظر یافت نشد.");
    res.status(200).json({ message: "قلم بودجه با موفقیت به‌روزرسانی شد.", data: need });
  });

  public deleteBudgetItem = asyncHandler(async (req: Request, res: Response) => {
    const { id, budgetItemId } = req.params;
    const need = await needService.deleteBudgetItem(id, budgetItemId);
    if (!need) throw new ApiError(404, "نیاز یا قلم بودجه مورد نظر یافت نشد.");
    res.status(200).json({ message: "قلم بودجه با موفقیت حذف شد.", data: need });
  });

  public addFundsToBudgetItem = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = addFundsToBudgetItemSchema.parse({ body: req.body, params: req.params });
    const need = await needService.addFundsToBudgetItem(
      validatedData.params.id,
      validatedData.params.budgetItemId,
      validatedData.body.amount
    );
    if (!need) throw new ApiError(404, "نیاز یا قلم بودجه مورد نظر یافت نشد.");
    res.status(200).json({ message: "مبلغ با موفقیت به قلم بودجه اضافه شد.", data: need });
  });

  // Verification Requests CRUD
  public getVerificationRequests = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.query;
    const verifications = await needService.getVerificationRequests(id, status as string);
    if (!verifications) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(200).json({ results: verifications.length, data: verifications });
  });

  public createVerificationRequest = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createVerificationRequestSchema.parse({ body: req.body, params: req.params });
    const need = await needService.createVerificationRequest(
      validatedData.params.id,
      req.user!._id.toString(),
      validatedData.body
    );
    if (!need) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(201).json({ message: "درخواست تایید با موفقیت ثبت شد.", data: need });
  });

  public reviewVerificationRequest = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = reviewVerificationRequestSchema.parse({ body: req.body, params: req.params });
    const need = await needService.reviewVerificationRequest(
      validatedData.params.id,
      validatedData.params.verificationId,
      req.user!._id.toString(),
      validatedData.body
    );
    if (!need) throw new ApiError(404, "نیاز یا درخواست تایید مورد نظر یافت نشد.");
    res.status(200).json({ message: "درخواست تایید با موفقیت بررسی شد.", data: need });
  });

  public deleteVerificationRequest = asyncHandler(async (req: Request, res: Response) => {
    const { id, verificationId } = req.params;
    const need = await needService.deleteVerificationRequest(id, verificationId);
    if (!need) throw new ApiError(404, "نیاز یا درخواست تایید مورد نظر یافت نشد.");
    res.status(200).json({ message: "درخواست تایید با موفقیت حذف شد.", data: need });
  });

  // Task Management CRUD
  public getTasks = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, assignedTo, priority } = req.query;
    const tasks = await needService.getTasks(id, {
      status: status as string,
      assignedTo: assignedTo as string,
      priority: priority as string,
    });
    if (!tasks) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(200).json({ results: tasks.length, data: tasks });
  });

  public createTask = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createTaskSchema.parse({ body: req.body, params: req.params });

    // Convert date if provided
    const taskData: any = { ...validatedData.body };
    if (taskData.deadline && typeof taskData.deadline === 'string') {
      taskData.deadline = new Date(taskData.deadline);
    }

    const need = await needService.createTask(validatedData.params.id, req.user!._id.toString(), taskData);
    if (!need) throw new ApiError(404, "نیاز مورد نظر یافت نشد.");
    res.status(201).json({ message: "تسک با موفقیت ثبت شد.", data: need });
  });

  public updateTask = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateTaskSchema.parse({ body: req.body, params: req.params });

    // Convert date if provided
    const taskData: any = { ...validatedData.body };
    if (taskData.deadline && typeof taskData.deadline === 'string') {
      taskData.deadline = new Date(taskData.deadline);
    }

    const need = await needService.updateTask(validatedData.params.id, validatedData.params.taskId, taskData);
    if (!need) throw new ApiError(404, "نیاز یا تسک مورد نظر یافت نشد.");
    res.status(200).json({ message: "تسک با موفقیت به‌روزرسانی شد.", data: need });
  });

  public deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const need = await needService.deleteTask(id, taskId);
    if (!need) throw new ApiError(404, "نیاز یا تسک مورد نظر یافت نشد.");
    res.status(200).json({ message: "تسک با موفقیت حذف شد.", data: need });
  });

  public updateTaskChecklist = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateTaskChecklistSchema.parse({ body: req.body, params: req.params });
    const need = await needService.updateTaskChecklist(
      validatedData.params.id,
      validatedData.params.taskId,
      validatedData.body.checklist
    );
    if (!need) throw new ApiError(404, "نیاز یا تسک مورد نظر یافت نشد.");
    res.status(200).json({ message: "چک‌لیست با موفقیت به‌روزرسانی شد.", data: need });
  });

  public completeTask = asyncHandler(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const { actualHours } = req.body;
    const need = await needService.completeTask(id, taskId, actualHours);
    if (!need) throw new ApiError(404, "نیاز یا تسک مورد نظر یافت نشد.");
    res.status(200).json({ message: "تسک با موفقیت تکمیل شد.", data: need });
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
>>>>>>> claude/review-repository-011CUioMnpKhKErWDFn7uG1L
}

export const needController = new NeedController();
