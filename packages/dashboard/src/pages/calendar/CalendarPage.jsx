import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import {
  fetchTasksByDateRange,
  fetchTodayTasks,
  fetchOverdueTasks,
  fetchTaskStats,
  createTask,
  updateTask,
  deleteTask,
} from "../../features/tasksSlice";
import TaskModal from "./components/TaskModal";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";

// کامپوننت کمکی برای نمایش متریک‌های کوچک
const MetricItem = ({ label, value, colorClass = "text-slate-800" }) => (
  <div className="flex justify-between items-center p-2 border-b border-slate-100 last:border-0">
    <span className="text-[11px] text-slate-500 font-medium">{label}</span>
    <span className={`text-[12px] font-mono font-bold ${colorClass}`}>{value}</span>
  </div>
);

const CalendarPage = () => {
  const dispatch = useDispatch();
  const { calendarTasks, todayTasks, overdueTasks, stats } = useSelector((state) => state.tasks);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateObj, setSelectedDateObj] = useState(null); // برای نگهداری DateObject از calendar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");

  useEffect(() => {
    dispatch(fetchTaskStats());
    dispatch(fetchTodayTasks());
    dispatch(fetchOverdueTasks());
  }, [dispatch]);

  useEffect(() => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    dispatch(
      fetchTasksByDateRange({
        startDate: firstDay.toISOString(),
        endDate: lastDay.toISOString(),
      })
    );
  }, [dispatch]);

  const getTasksForDate = (date) => {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    return calendarTasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === dateObj.getTime();
    });
  };

  const handleCreateTask = () => {
    setModalMode("create");
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setModalMode("edit");
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = async (taskData) => {
    if (modalMode === "create") {
      await dispatch(createTask(taskData));
    } else {
      await dispatch(updateTask({ id: taskToEdit._id, data: taskData }));
    }
    handleCloseModal();

    // رفرش همه داده‌ها
    dispatch(fetchTaskStats());
    dispatch(fetchTodayTasks());
    dispatch(fetchOverdueTasks());

    // رفرش tasks تقویم (ماه جاری)
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    dispatch(
      fetchTasksByDateRange({
        startDate: firstDay.toISOString(),
        endDate: lastDay.toISOString(),
      })
    );
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("آیا از حذف این آیتم اطمینان دارید؟")) {
      await dispatch(deleteTask(taskId));
      dispatch(fetchTaskStats());
      dispatch(fetchTodayTasks());
      dispatch(fetchOverdueTasks());
    }
  };

  const mapDays = ({ date }) => {
    const tasksForThisDay = getTasksForDate(date);
    if (tasksForThisDay.length === 0) return;

    return (
      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-[2px]">
        {tasksForThisDay.slice(0, 3).map((task, idx) => {
          const color =
            task.priority === "critical"
              ? "bg-red-500"
              : task.priority === "high"
              ? "bg-orange-500"
              : "bg-[#007acc]";
          return <div key={idx} className={`w-1 h-1 rounded-sm ${color}`} />;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4" dir="rtl">
      {/* Top Bar: Functional Header */}
      <header className="flex items-center justify-between mb-4 bg-white border border-slate-200 rounded-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center text-[#007acc]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">مدیریت وظایف</h1>
            <p className="text-[11px] text-slate-500 font-mono">SYS.TASK.MANAGER.V2</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${
                viewMode === "calendar"
                  ? "bg-white text-[#007acc] shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              تقویم
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${
                viewMode === "list"
                  ? "bg-white text-[#007acc] shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              لیست
            </button>
          </div>
          <button
            onClick={handleCreateTask}
            className="bg-[#007acc] hover:bg-[#0062a3] text-white text-[12px] font-medium px-4 py-1.5 rounded-md transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            وظیفه جدید
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Sidebar: Stats & Quick Lists */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          {/* Stats Panel */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-700 uppercase">وضعیت کلی</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="p-0">
              <MetricItem label="کل وظایف" value={stats?.total || 0} />
              <MetricItem label="تکمیل شده" value={stats?.completed || 0} colorClass="text-emerald-600" />
              <MetricItem label="در انتظار" value={stats?.pending || 0} colorClass="text-orange-600" />
              <MetricItem label="عقب افتاده" value={stats?.overdue || 0} colorClass="text-red-600" />
            </div>
          </div>

          {/* Today Tasks */}
          <div className="bg-white border border-slate-200 rounded-md flex flex-col h-[calc(50vh-100px)]">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-700 uppercase">امروز</span>
              <span className="bg-blue-100 text-[#007acc] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                {todayTasks.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <TaskList tasks={todayTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} compact />
            </div>
          </div>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div className="bg-white border border-red-200 rounded-md flex flex-col">
              <div className="bg-red-50 px-3 py-2 border-b border-red-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-red-700 uppercase">عقب افتاده</span>
                <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                  {overdueTasks.length}
                </span>
              </div>
              <div className="p-2">
                <TaskList tasks={overdueTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} compact />
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="col-span-12 lg:col-span-9">
          {viewMode === "calendar" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              {/* Calendar Component */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md p-4 flex flex-col items-center justify-start min-h-[500px]">
                <Calendar
                  className="engineering-calendar"
                  calendar={persian}
                  locale={persian_fa}
                  value={selectedDateObj}
                  onChange={(dateObj) => {
                    setSelectedDateObj(dateObj);
                    setSelectedDate(dateObj?.toDate ? dateObj.toDate() : new Date());
                  }}
                  mapDays={mapDays}
                  numberOfMonths={1}
                  weekStartDayIndex={6}
                />
              </div>

              {/* Selected Date Details */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-md flex flex-col">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                  <h3 className="text-[12px] font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#007acc] rounded-sm"></span>
                    {selectedDateObj
                      ? selectedDateObj.format("D MMMM YYYY")
                      : selectedDate.toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                  </h3>
                </div>
                <div className="p-3 flex-1 overflow-y-auto">
                  <TaskList
                    tasks={getTasksForDate(selectedDate)}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                  {getTasksForDate(selectedDate).length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-[11px]">
                      هیچ وظیفه‌ای برای این تاریخ ثبت نشده است.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-md p-4">
              <TaskFilters />
              <div className="mt-4">
                <TaskList tasks={calendarTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              </div>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          mode={modalMode}
          task={taskToEdit}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}

      <style>{`
        .engineering-calendar {
          font-family: inherit;
          box-shadow: none !important;
          border: none !important;
          width: 100% !important;
          background-color: transparent !important;
        }

        .engineering-calendar .rmdp-wrapper {
          border: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
          width: 100% !important;
        }

        .engineering-calendar .rmdp-top-class {
          width: 100% !important;
        }

        .engineering-calendar .rmdp-calendar {
          width: 100% !important;
        }

        .engineering-calendar .rmdp-day-picker {
          width: 100% !important;
          justify-content: center;
        }

        .engineering-calendar .rmdp-day-picker > div {
          width: 100% !important;
        }

        .engineering-calendar .rmdp-header {
          margin-bottom: 1rem;
        }

        .engineering-calendar .rmdp-header-values {
          color: #334155;
          font-weight: 700;
          font-size: 14px;
        }

        .engineering-calendar .rmdp-week-day {
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
        }

        .engineering-calendar .rmdp-day {
          width: 40px;
          height: 40px;
          border-radius: 6px; /* Rounded-md equivalent */
          font-size: 12px;
          color: #334155;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .engineering-calendar .rmdp-day:hover {
          background-color: #f1f5f9 !important;
          border-color: #cbd5e1;
          color: #0f172a !important;
        }

        .engineering-calendar .rmdp-day.rmdp-today span {
          background-color: transparent !important;
          color: #007acc !important;
          font-weight: 900;
          border: 1px solid #007acc;
          border-radius: 6px;
        }

        .engineering-calendar .rmdp-day.rmdp-selected span {
          background-color: #007acc !important;
          color: white !important;
          border-radius: 6px;
          box-shadow: none !important;
        }

        .engineering-calendar .rmdp-arrow {
          border-color: #64748b !important;
          border-width: 2px !important;
        }

        .engineering-calendar .rmdp-arrow-container:hover {
          background-color: #f1f5f9 !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;
