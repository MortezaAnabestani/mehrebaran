import { Request, Response } from "express";
import { taskService } from "./task.service";
import { createTaskSchema, updateTaskSchema, getTasksQuerySchema } from "./task.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class TaskController {
  /**
   * ایجاد task جدید
   */
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createTaskSchema.parse({ body: req.body });
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "کاربر احراز هویت نشده است.");
    }

    const task = await taskService.create(validatedData.body, userId.toString());
    res.status(201).json({ message: "وظیفه با موفقیت ایجاد شد.", data: task });
  });

  /**
   * دریافت همه tasks با فیلتر
   */
  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "کاربر احراز هویت نشده است.");
    }

    const validatedQuery = getTasksQuerySchema.parse({ query: req.query });
    const result = await taskService.findAll({
      createdBy: userId.toString(),
      ...validatedQuery.query,
    });

    res.status(200).json({ data: result.tasks, pagination: result.pagination });
  });

  /**
   * دریافت tasks بر اساس محدوده تاریخ (برای تقویم)
   */
  public getByDateRange = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { startDate, endDate } = req.query;

    if (!userId) {
      throw new ApiError(401, "کاربر احراز هویت نشده است.");
    }

    if (!startDate || !endDate) {
      throw new ApiError(400, "تاریخ شروع و پایان الزامی است.");
    }

    const tasks = await taskService.findByDateRange(
      userId.toString(),
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.status(200).json({ data: tasks });
  });

  /**
   * دریافت tasks امروز
   */
  public getTodayTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "کاربر احراز هویت نشده است.");
    }

    const tasks = await taskService.findTodayTasks(userId.toString());
    res.status(200).json({ data: tasks });
  });

  /**
   * دریافت tasks سررسید گذشته
   */
  public getOverdueTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "کاربر احراز هویت نشده است.");
    }

    const tasks = await taskService.findOverdueTasks(userId.toString());
    res.status(200).json({ data: tasks });
  });

  /**
   * دریافت یک task بر اساس ID
   */
  public getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const task = await taskService.findById(id);

    if (!task) {
      throw new ApiError(404, "وظیفه یافت نشد.");
    }

    res.status(200).json({ data: task });
  });

  /**
   * به‌روزرسانی task
   */
  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateTaskSchema.parse({ body: req.body, params: req.params });
    const task = await taskService.update(validatedData.params.id, validatedData.body);

    if (!task) {
      throw new ApiError(404, "وظیفه یافت نشد.");
    }

    res.status(200).json({ message: "وظیفه با موفقیت به‌روزرسانی شد.", data: task });
  });

  /**
   * حذف task
   */
  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const task = await taskService.findById(id);

    if (!task) {
      throw new ApiError(404, "وظیفه یافت نشد.");
    }

    await taskService.delete(id);
    res.status(200).json({ message: "وظیفه با موفقیت حذف شد." });
  });

  /**
   * دریافت آمار tasks
   */
  public getStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "کاربر احراز هویت نشده است.");
    }

    const stats = await taskService.getStats(userId.toString());
    res.status(200).json({ data: stats });
  });
}

export const taskController = new TaskController();
