import { TaskModel } from "./task.model";
import { ICreateTodoTaskDTO, IUpdateTodoTaskDTO, TodoTaskStatus } from "common-types";

class TaskService {
  /**
   * ایجاد یک task جدید
   */
  public async create(data: ICreateTodoTaskDTO, createdBy: string) {
    const task = await TaskModel.create({
      ...data,
      createdBy,
    });
    return task.populate("createdBy assignedTo", "name email avatar");
  }

  /**
   * دریافت همه tasks با فیلتر و صفحه‌بندی
   */
  public async findAll(filters: {
    createdBy?: string;
    assignedTo?: string;
    status?: TodoTaskStatus;
    category?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 50, startDate, endDate, ...restFilters } = filters;
    const skip = (page - 1) * limit;

    const query: any = { ...restFilters };

    // فیلتر بر اساس محدوده تاریخ
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const [tasks, total] = await Promise.all([
      TaskModel.find(query)
        .populate("createdBy assignedTo", "name email avatar")
        .sort({ dueDate: 1, priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TaskModel.countDocuments(query),
    ]);

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * دریافت tasks بر اساس تاریخ (برای نمایش در تقویم)
   */
  public async findByDateRange(userId: string, startDate: Date, endDate: Date) {
    return TaskModel.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
      dueDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("createdBy assignedTo", "name email avatar")
      .sort({ dueDate: 1 })
      .lean();
  }

  /**
   * دریافت tasks امروز
   */
  public async findTodayTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return TaskModel.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
      dueDate: {
        $gte: today,
        $lt: tomorrow,
      },
      status: { $ne: TodoTaskStatus.COMPLETED },
    })
      .populate("createdBy assignedTo", "name email avatar")
      .sort({ priority: -1 })
      .lean();
  }

  /**
   * دریافت tasks سررسید گذشته
   */
  public async findOverdueTasks(userId: string) {
    const now = new Date();

    return TaskModel.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
      dueDate: { $lt: now },
      status: { $ne: TodoTaskStatus.COMPLETED },
    })
      .populate("createdBy assignedTo", "name email avatar")
      .sort({ dueDate: 1 })
      .lean();
  }

  /**
   * دریافت یک task بر اساس ID
   */
  public async findById(id: string) {
    return TaskModel.findById(id).populate("createdBy assignedTo", "name email avatar").lean();
  }

  /**
   * به‌روزرسانی یک task
   */
  public async update(id: string, data: IUpdateTodoTaskDTO) {
    // اگر وضعیت به completed تغییر کرد، تاریخ تکمیل را ثبت کن
    const updateData: any = { ...data };
    if (data.status === TodoTaskStatus.COMPLETED && !updateData.completedAt) {
      updateData.completedAt = new Date();
    } else if (data.status && data.status !== TodoTaskStatus.COMPLETED) {
      updateData.completedAt = null;
    }

    return TaskModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate("createdBy assignedTo", "name email avatar")
      .lean();
  }

  /**
   * حذف یک task
   */
  public async delete(id: string) {
    return TaskModel.findByIdAndDelete(id);
  }

  /**
   * دریافت آمار tasks
   */
  public async getStats(userId: string) {
    const query = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    };

    const [total, completed, inProgress, todo, overdue] = await Promise.all([
      TaskModel.countDocuments(query),
      TaskModel.countDocuments({ ...query, status: TodoTaskStatus.COMPLETED }),
      TaskModel.countDocuments({ ...query, status: TodoTaskStatus.IN_PROGRESS }),
      TaskModel.countDocuments({ ...query, status: TodoTaskStatus.TODO }),
      TaskModel.countDocuments({
        ...query,
        dueDate: { $lt: new Date() },
        status: { $ne: TodoTaskStatus.COMPLETED },
      }),
    ]);

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      cancelled: total - completed - inProgress - todo,
    };
  }
}

export const taskService = new TaskService();
