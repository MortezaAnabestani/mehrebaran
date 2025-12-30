import { useDispatch, useSelector } from "react-redux";
import { setFilters, clearFilters } from "../../../features/tasksSlice";

const TaskFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.tasks);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  // استایل مشترک برای ورودی‌ها جهت حفظ یکپارچگی
  const selectClass =
    "w-full h-9 pl-2 pr-8 text-[12px] bg-white border border-slate-300 rounded-md text-slate-700 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] outline-none appearance-none transition-all font-mono shadow-sm";
  const labelClass = "block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider font-mono";
  const arrowIcon = (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <div className="w-full border border-slate-200 bg-slate-50/50 rounded-md mb-4 shadow-sm">
      {/* Header Section: Compact & Technical */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white rounded-t-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-4 h-4 bg-blue-100 rounded-[3px] border border-blue-200">
            <svg className="w-2.5 h-2.5 text-[#007acc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
          <h3 className="text-[12px] font-semibold text-slate-700 font-mono uppercase tracking-tight">
            تنظیمات فیلتر
          </h3>
        </div>

        <button
          onClick={() => dispatch(clearFilters())}
          className="group flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded transition-all"
        >
          <svg
            className="w-3 h-3 transition-transform group-hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>پاکسازی</span>
        </button>
      </div>

      {/* Controls Grid: 12-Column System */}
      <div className="p-3 grid grid-cols-12 gap-3">
        {/* Status Filter */}
        <div className="col-span-12 sm:col-span-6 md:col-span-4">
          <label className={labelClass}>وضعیت</label>
          <div className="relative">
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value || null)}
              className={selectClass}
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="todo">انجام نشده [TODO]</option>
              <option value="in_progress">در حال انجام [WIP]</option>
              <option value="completed">تکمیل شده [DONE]</option>
              <option value="cancelled">لغو شده [VOID]</option>
            </select>
            {arrowIcon}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="col-span-12 sm:col-span-6 md:col-span-4">
          <label className={labelClass}>اولویت </label>
          <div className="relative">
            <select
              value={filters.priority || ""}
              onChange={(e) => handleFilterChange("priority", e.target.value || null)}
              className={selectClass}
            >
              <option value="">همه اولویت‌ها</option>
              <option value="low">پایین (LOW)</option>
              <option value="medium">متوسط (MED)</option>
              <option value="high">بالا (HIGH)</option>
              <option value="critical">بحرانی (CRIT)</option>
            </select>
            {arrowIcon}
          </div>
        </div>

        {/* Category Filter */}
        <div className="col-span-12 md:col-span-4">
          <label className={labelClass}>دسته‌بندی </label>
          <div className="relative">
            <select
              value={filters.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value || null)}
              className={selectClass}
            >
              <option value="">همه دسته‌ها</option>
              <option value="article">مقاله</option>
              <option value="video">ویدیو</option>
              <option value="gallery">گالری</option>
              <option value="project">پروژه</option>
              <option value="news">خبر</option>
              <option value="volunteer">داوطلب</option>
              <option value="donation">کمک مالی</option>
              <option value="need">نیاز</option>
              <option value="comment">نظر</option>
              <option value="user">کاربر</option>
              <option value="general">عمومی</option>
              <option value="bug">باگ</option>
              <option value="feature">قابلیت جدید</option>
              <option value="meeting">جلسه</option>
              <option value="review">بررسی</option>
            </select>
            {arrowIcon}
          </div>
        </div>
      </div>

      {/* Footer Status Bar (Optional for Engineering Look) */}
      <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 rounded-b-md flex justify-end">
        <span className="text-[10px] text-slate-400 font-mono">
          فیلترهای فعال: {Object.keys(filters).length}
        </span>
      </div>
    </div>
  );
};

export default TaskFilters;
