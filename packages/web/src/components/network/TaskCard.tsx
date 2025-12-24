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

  // --- Helper Functions ---

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; className: string; dotColor: string }> = {
      pending: {
        label: "در انتظار",
        className: "bg-gray-50 text-gray-600 border-gray-200",
        dotColor: "bg-gray-400",
      },
      in_progress: {
        label: "در حال انجام",
        className: "bg-blue-50 text-[#007acc] border-blue-200",
        dotColor: "bg-[#007acc]",
      },
      review: {
        label: "بررسی",
        className: "bg-purple-50 text-purple-600 border-purple-200",
        dotColor: "bg-purple-500",
      },
      completed: {
        label: "تکمیل شده",
        className: "bg-green-50 text-green-600 border-green-200",
        dotColor: "bg-green-500",
      },
      blocked: {
        label: "مسدود",
        className: "bg-red-50 text-red-600 border-red-200",
        dotColor: "bg-red-500",
      },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority: string) => {
    const configs: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      low: {
        label: "کم",
        color: "text-gray-400",
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        ),
      },
      medium: {
        label: "متوسط",
        color: "text-[#007acc]",
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        ),
      },
      high: {
        label: "زیاد",
        color: "text-orange-500",
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        ),
      },
      critical: {
        label: "بحرانی",
        color: "text-red-500",
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        ),
      },
    };
    return configs[priority] || configs.medium;
  };

  const getDaysRemaining = (): { text: string; colorClass: string } | null => {
    if (!task.deadline) return null;
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: "منقضی شده", colorClass: "text-red-600 font-bold" };
    if (days === 0) return { text: "امروز", colorClass: "text-orange-600 font-bold" };
    if (days === 1) return { text: "فردا", colorClass: "text-[#007acc] font-medium" };
    return { text: `${days} روز مانده`, colorClass: "text-gray-500" };
  };

  // --- Actions ---

  const handleStatusChange = async (newStatus: typeof task.status) => {
    try {
      setIsUpdating(true);
      await taskService.updateTaskStatus(needId, task._id, newStatus);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteTask = async () => {
    try {
      setIsUpdating(true);
      await taskService.completeTask(needId, task._id);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Render Helpers ---

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const deadlineInfo = getDaysRemaining();

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
      className={`
        group relative w-full bg-white rounded-2xl p-5 transition-all duration-300 ease-out
        border border-gray-100
        ${isDraggable ? "cursor-move active:scale-[0.98]" : ""}
        ${
          task.status === "blocked"
            ? "opacity-80 bg-red-50/30"
            : "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] shadow-[0_2px_8px_rgb(0,0,0,0.04)]"
        }
      `}
    >
      {/* Decorative Top Gradient Line */}
      <div
        className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent ${
          task.status === "completed" ? "via-green-400" : "via-[#007acc]"
        } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Header: Status & Priority */}
      <div className="flex items-center justify-between mb-3">
        <div
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium shadow-sm ${statusConfig.className}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} animate-pulse`} />
          {statusConfig.label}
        </div>

        <div className="flex items-center gap-1" title={`اولویت: ${priorityConfig.label}`}>
          <span className={`p-1 rounded-md bg-gray-50 ${priorityConfig.color}`}>{priorityConfig.icon}</span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-4">
        <h4 className="font-bold text-gray-800 text-base leading-tight mb-1.5 group-hover:text-[#007acc] transition-colors">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{task.description}</p>
        )}
      </div>

      {/* Progress Bar (Skeuomorphic Style) */}
      {(task.progressPercentage > 0 || (task.checklist && task.checklist.length > 0)) && (
        <div className="mb-4">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">پیشرفت</span>
            <span className="text-xs font-bold text-[#007acc]">{progress.percentage}%</span>
          </div>
          {/* Track: Inner Shadow for depth */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 shadow-inner overflow-hidden border border-gray-200/50">
            {/* Fill: Gradient & Glossy */}
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{
                width: `${progress.percentage}%`,
                background: `linear-gradient(90deg, #007acc 0%, #40a9ff 100%)`,
              }}
            >
              {/* Shine effect */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" />
            </div>
          </div>
        </div>
      )}

      {/* Meta Data Row */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100/80 mt-2">
        {/* Left: Assignee & Checklist */}
        <div className="flex items-center gap-3">
          {task.assignedTo ? (
            <div className="flex items-center gap-1.5 bg-gray-50 pr-1 pl-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#007acc] to-blue-400 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                {task.assignedTo.name.charAt(0)}
              </div>
              <span className="text-[10px] font-medium text-gray-600 truncate max-w-[60px]">
                {task.assignedTo.name}
              </span>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-300">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}

          {task.checklist && task.checklist.length > 0 && (
            <div className="flex items-center gap-1 text-gray-400" title="چک‌لیست">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span className="text-[10px] font-medium">
                {progress.completed}/{progress.total}
              </span>
            </div>
          )}
        </div>

        {/* Right: Deadline */}
        {deadlineInfo && (
          <div
            className={`flex items-center gap-1 text-[10px] ${deadlineInfo.colorClass} bg-white/50 px-2 py-1 rounded-md`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{deadlineInfo.text}</span>
          </div>
        )}
      </div>

      {/* Blocked Reason */}
      {task.status === "blocked" && task.blockingReason && (
        <div className="mt-3 p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
          <span className="text-red-500 mt-0.5">🚫</span>
          <p className="text-xs text-red-700 leading-tight">{task.blockingReason}</p>
        </div>
      )}

      {/* Action Buttons (Hover Reveal or Always Visible based on preference, here Always Visible but subtle) */}
      {task.status !== "completed" && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
          {task.status === "pending" && (
            <SmartButton
              variant="mblue"
              size="sm"
              className="w-full text-xs py-1.5 shadow-md shadow-blue-200/50 hover:shadow-blue-300/60 transition-shadow"
              onClick={() => handleStatusChange("in_progress")}
              disabled={isUpdating}
            >
              شروع کار
            </SmartButton>
          )}
          {task.status === "in_progress" && (
            <>
              <SmartButton
                variant="outline"
                size="sm"
                className="flex-1 text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => handleStatusChange("review")}
                disabled={isUpdating}
              >
                بررسی
              </SmartButton>
              <SmartButton
                variant="mblue"
                size="sm"
                className="flex-1 text-xs shadow-md shadow-blue-200/50"
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
              className="w-full text-xs bg-gray-800 text-white hover:bg-gray-900 shadow-lg shadow-gray-300/50"
              onClick={handleCompleteTask}
              disabled={isUpdating}
            >
              تایید نهایی
            </SmartButton>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
