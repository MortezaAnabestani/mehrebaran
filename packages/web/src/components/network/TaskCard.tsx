"use client";

import React, { useState } from "react";
import { ITask, taskService } from "@/services/task.service";
import SmartButton from "@/components/ui/SmartButton";

interface TaskCardProps {
  task: ITask;
  needId: string;
  onUpdate?: () => void;
  isDraggable?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, needId, onUpdate, isDraggable = false }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // ترجمه status
  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: "در انتظار",
      in_progress: "در حال انجام",
      review: "در حال بررسی",
      completed: "تکمیل شده",
      blocked: "مسدود شده",
    };
    return labels[status] || status;
  };

  // رنگ status
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: "bg-gray-100 text-gray-700",
      in_progress: "bg-blue-100 text-blue-700",
      review: "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      blocked: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  // ترجمه priority
  const getPriorityLabel = (priority: string): string => {
    const labels: Record<string, string> = {
      low: "کم",
      medium: "متوسط",
      high: "زیاد",
      critical: "بحرانی",
    };
    return labels[priority] || priority;
  };

  // رنگ priority
  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      low: "text-gray-500",
      medium: "text-blue-500",
      high: "text-orange-500",
      critical: "text-red-500",
    };
    return colors[priority] || "text-gray-500";
  };

  // آیکون priority
  const getPriorityIcon = (priority: string): string => {
    const icons: Record<string, string> = {
      low: "⬇️",
      medium: "➡️",
      high: "⬆️",
      critical: "🔥",
    };
    return icons[priority] || "➡️";
  };

  // محاسبه روزهای باقی‌مانده تا deadline
  const getDaysRemaining = (): string | null => {
    if (!task.deadline) return null;
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "منقضی شده";
    if (days === 0) return "امروز";
    if (days === 1) return "فردا";
    return `${days} روز مانده`;
  };

  // تغییر وضعیت تسک
  const handleStatusChange = async (newStatus: typeof task.status) => {
    try {
      setIsUpdating(true);
      await taskService.updateTaskStatus(needId, task._id, newStatus);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Failed to update task status:", error);
      alert(error.message || "خطا در تغییر وضعیت");
    } finally {
      setIsUpdating(false);
    }
  };

  // تکمیل تسک
  const handleCompleteTask = async () => {
    try {
      setIsUpdating(true);
      await taskService.completeTask(needId, task._id);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Failed to complete task:", error);
      alert(error.message || "خطا در تکمیل تسک");
    } finally {
      setIsUpdating(false);
    }
  };

  // محاسبه progress checklist
  const checklistProgress = (): { completed: number; total: number; percentage: number } => {
    if (!task.checklist || task.checklist.length === 0) {
      return { completed: 0, total: 0, percentage: task.progressPercentage || 0 };
    }
    const completed = task.checklist.filter((item) => item.isCompleted).length;
    const total = task.checklist.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const progress = checklistProgress();

  return (
    <div
      className={`bg-white border border-mgray/20 rounded-md p-4 shadow-sm hover:shadow-md transition-all ${
        isDraggable ? "cursor-move" : ""
      } ${task.status === "blocked" ? "opacity-70" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-sm mb-1">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
          )}
        </div>
        <span className={`text-lg ${getPriorityColor(task.priority)}`} title={getPriorityLabel(task.priority)}>
          {getPriorityIcon(task.priority)}
        </span>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(task.status)}`}>
          {getStatusLabel(task.status)}
        </span>
      </div>

      {/* Progress Bar */}
      {task.progressPercentage > 0 && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">پیشرفت:</span>
            <span className="text-xs font-bold text-mblue">{task.progressPercentage}%</span>
          </div>
          <div className="w-full bg-mgray/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-mblue h-full rounded-full transition-all"
              style={{ width: `${task.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Checklist preview */}
      {task.checklist && task.checklist.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>✓</span>
            <span>
              {progress.completed}/{progress.total} مورد
            </span>
          </div>
        </div>
      )}

      {/* Assigned To */}
      {task.assignedTo && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-gray-600">تخصیص:</span>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-mblue text-white flex items-center justify-center text-xs">
              {task.assignedTo.name.charAt(0)}
            </div>
            <span className="text-xs font-bold">{task.assignedTo.name}</span>
          </div>
        </div>
      )}

      {/* Deadline */}
      {task.deadline && (
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="text-gray-600">⏰</span>
          <span
            className={`font-bold ${
              getDaysRemaining() === "منقضی شده" ? "text-red-500" : "text-gray-700"
            }`}
          >
            {getDaysRemaining()}
          </span>
        </div>
      )}

      {/* Blocked indicator */}
      {task.status === "blocked" && task.blockingReason && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          🚫 {task.blockingReason}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-mgray/20">
        {task.status !== "completed" && (
          <>
            {task.status === "pending" && (
              <SmartButton
                variant="mblue"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleStatusChange("in_progress")}
                disabled={isUpdating}
              >
                شروع
              </SmartButton>
            )}
            {task.status === "in_progress" && (
              <>
                <SmartButton
                  variant="morange"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleStatusChange("review")}
                  disabled={isUpdating}
                >
                  بررسی
                </SmartButton>
                <SmartButton
                  variant="mgray"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={handleCompleteTask}
                  disabled={isUpdating}
                >
                  تکمیل
                </SmartButton>
              </>
            )}
            {task.status === "review" && (
              <SmartButton
                variant="mgray"
                size="sm"
                className="flex-1 text-xs"
                onClick={handleCompleteTask}
                disabled={isUpdating}
              >
                ✓ تایید و تکمیل
              </SmartButton>
            )}
          </>
        )}
        {task.status === "completed" && (
          <div className="flex-1 text-center text-xs text-green-600 font-bold">
            ✓ تکمیل شده
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
        {task.estimatedHours && <span>⏱ {task.estimatedHours}h</span>}
        {task.dependencies && task.dependencies.length > 0 && (
          <span>🔗 {task.dependencies.length} وابستگی</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
