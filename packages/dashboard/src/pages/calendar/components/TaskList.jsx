import { useState } from "react";

const TaskList = ({ tasks = [], onEdit, onDelete, compact = false }) => {
  // --- Logic Helpers ---

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium":
        return "bg-sky-50 text-sky-700 border-sky-200"; // Using Sky/Blue as secondary
      case "low":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "in_progress":
        return "bg-[#007acc]/10 text-[#007acc] border-[#007acc]/20"; // Brand Color
      case "todo":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "cancelled":
        return "bg-slate-50 text-slate-400 border-slate-200 line-through decoration-slate-400";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: "تکمیل شده",
      in_progress: "در جریان",
      todo: "در انتظار",
      cancelled: "لغو شده",
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      critical: "بحرانی",
      high: "بالا",
      medium: "متوسط",
      low: "پایین",
    };
    return labels[priority] || priority;
  };

  // --- Empty State ---
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-300 rounded-md bg-slate-50/50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 text-slate-400 mb-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
          />
        </svg>
        <p className="text-sm font-medium text-slate-500">هیچ وظیفه‌ای یافت نشد</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="w-full border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm">
      <div className="divide-y divide-slate-100">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="group flex flex-col sm:flex-row sm:items-center gap-3 p-3 hover:bg-slate-50 transition-colors duration-150"
          >
            {/* Left Section: Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h4
                  className={`text-[13px] font-semibold text-slate-700 truncate ${
                    task.status === "completed" || task.status === "cancelled" ? "opacity-60" : ""
                  }`}
                >
                  {task.title}
                </h4>

                {/* Badges - Compact & Technical */}
                <span
                  className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium border ${getStatusStyles(
                    task.status
                  )}`}
                >
                  {getStatusLabel(task.status)}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium border ${getPriorityStyles(
                    task.priority
                  )}`}
                >
                  {getPriorityLabel(task.priority)}
                </span>
              </div>

              {/* Description */}
              {!compact && task.description && (
                <p className="text-[12px] text-slate-500 line-clamp-1 mb-1.5 pl-1 border-l-2 border-slate-200">
                  {task.description}
                </p>
              )}

              {/* Metadata Row */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                {task.dueDate && (
                  <div className="flex items-center gap-1 font-mono">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{new Date(task.dueDate).toLocaleDateString("fa-IR")}</span>
                  </div>
                )}
                {task.category && (
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{task.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded text-slate-400 hover:text-[#007acc] hover:bg-blue-50 transition-colors"
                title="ویرایش"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="حذف"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
