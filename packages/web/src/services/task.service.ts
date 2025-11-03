import api from "@/lib/api";

/**
 * Task types
 */
export interface ITask {
  _id: string;
  title: string;
  description?: string;
  assignedTo?: {
    _id: string;
    name: string;
  };
  assignedBy?: {
    _id: string;
    name: string;
  };
  assignedAt?: Date;
  status: "pending" | "in_progress" | "review" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
  deadline?: Date;
  estimatedHours?: number;
  actualHours?: number;
  progressPercentage: number;
  dependencies?: string[];
  blockedBy?: string;
  blockingReason?: string;
  completedAt?: Date;
  checklist?: ITaskChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskChecklistItem {
  title: string;
  isCompleted: boolean;
}

/**
 * Response types
 */
interface GetTasksResponse {
  results: number;
  data: ITask[];
}

/**
 * Request types
 */
export interface GetTasksParams {
  status?: "pending" | "in_progress" | "review" | "completed" | "blocked";
  assignedTo?: string;
  priority?: "low" | "medium" | "high" | "critical";
}

export interface CreateTaskData {
  title: string;
  description?: string;
  assignedTo?: string;
  priority?: "low" | "medium" | "high" | "critical";
  deadline?: string;
  estimatedHours?: number;
  dependencies?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: "pending" | "in_progress" | "review" | "completed" | "blocked";
  priority?: "low" | "medium" | "high" | "critical";
  deadline?: string;
  estimatedHours?: number;
  actualHours?: number;
  progressPercentage?: number;
  blockedBy?: string;
  blockingReason?: string;
  dependencies?: string[];
}

/**
 * Task Service - تمام درخواست‌های مربوط به تسک‌ها
 * توجه: تسک‌ها به یک need وابسته هستند
 */
class TaskService {
  /**
   * دریافت لیست تسک‌های یک need
   */
  public async getTasks(needId: string, params?: GetTasksParams): Promise<GetTasksResponse> {
    try {
      const response = await api.get(`/needs/${needId}/tasks`, { params });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت لیست تسک‌ها");
    }
  }

  /**
   * ایجاد تسک جدید
   */
  public async createTask(needId: string, data: CreateTaskData): Promise<any> {
    try {
      const response = await api.post(`/needs/${needId}/tasks`, data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to create task:", error);
      throw new Error(error.response?.data?.message || "خطا در ایجاد تسک");
    }
  }

  /**
   * ویرایش تسک
   */
  public async updateTask(needId: string, taskId: string, data: UpdateTaskData): Promise<any> {
    try {
      const response = await api.patch(`/needs/${needId}/tasks/${taskId}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to update task:", error);
      throw new Error(error.response?.data?.message || "خطا در ویرایش تسک");
    }
  }

  /**
   * حذف تسک
   */
  public async deleteTask(needId: string, taskId: string): Promise<void> {
    try {
      await api.delete(`/needs/${needId}/tasks/${taskId}`);
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف تسک");
    }
  }

  /**
   * آپدیت چک‌لیست تسک
   */
  public async updateTaskChecklist(
    needId: string,
    taskId: string,
    checklist: ITaskChecklistItem[]
  ): Promise<any> {
    try {
      const response = await api.patch(`/needs/${needId}/tasks/${taskId}/checklist`, { checklist });
      return response.data;
    } catch (error: any) {
      console.error("Failed to update task checklist:", error);
      throw new Error(error.response?.data?.message || "خطا در آپدیت چک‌لیست");
    }
  }

  /**
   * تکمیل تسک
   */
  public async completeTask(needId: string, taskId: string, actualHours?: number): Promise<any> {
    try {
      const response = await api.post(`/needs/${needId}/tasks/${taskId}/complete`, { actualHours });
      return response.data;
    } catch (error: any) {
      console.error("Failed to complete task:", error);
      throw new Error(error.response?.data?.message || "خطا در تکمیل تسک");
    }
  }

  /**
   * تغییر وضعیت تسک
   */
  public async updateTaskStatus(
    needId: string,
    taskId: string,
    status: "pending" | "in_progress" | "review" | "completed" | "blocked"
  ): Promise<any> {
    return this.updateTask(needId, taskId, { status });
  }

  /**
   * تخصیص تسک به کاربر
   */
  public async assignTask(needId: string, taskId: string, assignedTo: string): Promise<any> {
    return this.updateTask(needId, taskId, { assignedTo });
  }
}

export const taskService = new TaskService();
