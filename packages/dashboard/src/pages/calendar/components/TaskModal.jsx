import { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

const TaskModal = ({ isOpen, mode, task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
    status: "todo",
    dueDate: "",
    tags: "",
    notes: "",
  });

  const [selectedDateObj, setSelectedDateObj] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && task) {
      const dueDateStr = task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "";
      setFormData({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "general",
        priority: task.priority || "medium",
        status: task.status || "todo",
        dueDate: dueDateStr,
        tags: task.tags?.join(", ") || "",
        notes: task.notes || "",
      });
      // تبدیل تاریخ میلادی به شمسی
      if (dueDateStr) {
        setSelectedDateObj(new DateObject(new Date(dueDateStr)).convert(persian, persian_fa));
      } else {
        setSelectedDateObj(null);
      }
    } else {
      setFormData({
        title: "",
        description: "",
        category: "general",
        priority: "medium",
        status: "todo",
        dueDate: "",
        tags: "",
        notes: "",
      });
      setSelectedDateObj(null);
    }
  }, [mode, task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "عنوان الزامی است";
    }
    if (formData.title.length > 200) {
      newErrors.title = "حداکثر 200 کاراکتر";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const taskData = {
      title: formData.title.trim(),
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
    };

    // فقط فیلدهای اختیاری را اضافه کن اگر مقدار داشتند
    if (formData.description?.trim()) {
      taskData.description = formData.description.trim();
    }

    if (formData.dueDate) {
      // تبدیل تاریخ به فرمت ISO
      taskData.dueDate = new Date(formData.dueDate).toISOString();
    }

    if (formData.tags?.trim()) {
      taskData.tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    if (formData.notes?.trim()) {
      taskData.notes = formData.notes.trim();
    }

    onSave(taskData);
  };

  if (!isOpen) return null;

  // استایل‌های پایه برای ورودی‌ها جهت یکپارچگی
  const inputBaseClass =
    "w-full h-9 px-3 text-xs bg-white border border-slate-300 rounded-md focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] outline-none transition-all placeholder:text-slate-400 text-slate-700";

  const labelBaseClass = "block text-[11px] font-medium text-slate-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header: Functional & Minimal */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${mode === "create" ? "bg-emerald-500" : "bg-amber-500"}`}
            ></div>
            <h2 className="text-sm font-semibold text-slate-800">
              {mode === "create" ? "ایجاد وظیفه جدید" : "ویرایش مشخصات وظیفه"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body: High Density Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <form id="task-form" onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
            {/* Title - Full Width */}
            <div className="col-span-12">
              <label className={labelBaseClass}>
                عنوان وظیفه <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`${inputBaseClass} ${
                  errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="عنوان را وارد کنید..."
                autoFocus
              />
              {errors.title && <p className="mt-1 text-[10px] text-red-500">{errors.title}</p>}
            </div>

            {/* Row 2: Category, Priority, Status */}
            <div className="col-span-12 md:col-span-4">
              <label className={labelBaseClass}>دسته‌بندی</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputBaseClass}
              >
                <option value="general">عمومی</option>
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
                <option value="bug">باگ</option>
                <option value="feature">قابلیت جدید</option>
                <option value="meeting">جلسه</option>
                <option value="review">بررسی</option>
              </select>
            </div>

            <div className="col-span-12 md:col-span-4">
              <label className={labelBaseClass}>اولویت</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={inputBaseClass}
              >
                <option value="low">پایین</option>
                <option value="medium">متوسط</option>
                <option value="high">بالا</option>
                <option value="critical">بحرانی</option>
              </select>
            </div>

            <div className="col-span-12 md:col-span-4">
              <label className={labelBaseClass}>وضعیت</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputBaseClass}
              >
                <option value="todo">انجام نشده</option>
                <option value="in_progress">در حال انجام</option>
                <option value="completed">انجام شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
            </div>

            {/* Row 3: Due Date & Tags */}
            <div className="col-span-12 md:col-span-6">
              <label className={labelBaseClass}>تاریخ سررسید</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={selectedDateObj}
                onChange={(date) => {
                  setSelectedDateObj(date);
                  const gregorianDate = date?.toDate ? date.toDate().toISOString().split("T")[0] : "";
                  setFormData((prev) => ({ ...prev, dueDate: gregorianDate }));
                }}
                format="YYYY/MM/DD"
                placeholder="انتخاب تاریخ..."
                containerClassName="w-full"
                inputClass={inputBaseClass}
                calendarPosition="bottom-center"
                portalTarget={document.body}
                zIndex={9999}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className={labelBaseClass}>برچسب‌ها</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className={inputBaseClass}
                placeholder="مثال: مهم, فوری (با کاما جدا کنید)"
              />
            </div>

            {/* Description */}
            <div className="col-span-12">
              <label className={labelBaseClass}>توضیحات</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-md focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] outline-none transition-all placeholder:text-slate-400 text-slate-700 resize-none"
                placeholder="توضیحات تکمیلی..."
              />
            </div>

            {/* Notes */}
            <div className="col-span-12">
              <label className={labelBaseClass}>یادداشت‌های داخلی</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] outline-none transition-all placeholder:text-slate-400 text-slate-600 resize-none"
                placeholder="یادداشت‌های محرمانه یا فنی..."
              />
            </div>
          </form>
        </div>

        {/* Footer: Actions */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 rounded-b-lg flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            انصراف
          </button>
          <button
            type="submit"
            form="task-form"
            className="px-4 py-2 text-xs font-medium text-white bg-[#007acc] border border-transparent rounded-md hover:bg-[#0062a3] focus:ring-2 focus:ring-offset-2 focus:ring-[#007acc] transition-all shadow-sm"
          >
            {mode === "create" ? "ثبت وظیفه" : "ذخیره تغییرات"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
