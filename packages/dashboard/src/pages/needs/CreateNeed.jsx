import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowUpIcon,
  MapPinIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import useNeedForm from "../../hooks/useNeedForm";

const CreateNeed = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    submitSuccess,
    submitError,
    setValue,
    watch,
    categories,
    users,
    loadingData,
  } = useNeedForm(false);

  const status = watch("status");
  const urgencyLevel = watch("urgencyLevel");
  const category = watch("category");
  const user = watch("user");
  const attachments = watch("attachments");

  // استایل‌های مشترک برای ورودی‌ها جهت حفظ یکپارچگی سیستم طراحی
  const inputBaseClass =
    "w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400";
  const labelBaseClass = "block text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-wide";
  const sectionTitleClass =
    "text-[14px] font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2 mb-4";

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/needs"
            className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800">ایجاد نیاز جدید</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">فرم ثبت درخواست و نیازمندی‌های سیستم</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to="/dashboard/needs">
            <button
              type="button"
              className="px-4 py-2 text-[12px] font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              انصراف
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-[12px] font-medium text-white cursor-pointer bg-[#3B80C3] border border-[#3B80C3]/30 rounded-md hover:bg-[#3B80C3]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? "در حال پردازش..." : "ثبت نهایی نیاز"}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {submitSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-emerald-700 text-[13px]">
          <CheckCircleIcon className="w-5 h-5" />
          <span>نیاز با موفقیت در سیستم ثبت گردید.</span>
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-[13px]">
          <XCircleIcon className="w-5 h-5" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
        {/* Left Column: Main Content (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* General Info Card */}
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <h3 className={sectionTitleClass}>
              <InformationCircleIcon className="w-4 h-4 text-slate-400" />
              اطلاعات پایه
            </h3>

            <div className="space-y-4">
              <div>
                <label className={labelBaseClass}>
                  عنوان نیاز <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className={inputBaseClass}
                  placeholder="مثال: نیاز به تعمیرات سقف مدرسه..."
                />
                {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className={labelBaseClass}>
                  توضیحات تکمیلی <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={8}
                  className={`${inputBaseClass} resize-none`}
                  placeholder="شرح کامل نیاز و جزئیات مربوطه..."
                />
                {errors.description && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <h3 className={sectionTitleClass}>
              <MapPinIcon className="w-4 h-4 text-slate-400" />
              موقعیت مکانی
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelBaseClass}>آدرس دقیق</label>
                <input type="text" {...register("location.address")} className={inputBaseClass} />
              </div>
              <div>
                <label className={labelBaseClass}>نام مکان</label>
                <input type="text" {...register("location.locationName")} className={inputBaseClass} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelBaseClass}>استان</label>
                  <input type="text" {...register("location.province")} className={inputBaseClass} />
                </div>
                <div>
                  <label className={labelBaseClass}>شهر</label>
                  <input type="text" {...register("location.city")} className={inputBaseClass} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Meta Data & Settings (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Classification Card */}
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <h3 className={sectionTitleClass}>طبقه‌بندی و وضعیت</h3>

            <div className="space-y-4">
              <div>
                <label className={labelBaseClass}>
                  کاربر (صاحب نیاز) <span className="text-red-500">*</span>
                </label>
                <select
                  value={user}
                  onChange={(e) => setValue("user", e.target.value)}
                  className={inputBaseClass}
                  disabled={loadingData}
                >
                  <option value="">انتخاب کنید...</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullName || u.username} {u.email && `(${u.email})`}
                    </option>
                  ))}
                </select>
                {errors.user && <p className="text-[11px] text-red-500 mt-1">{errors.user.message}</p>}
              </div>

              <div>
                <label className={labelBaseClass}>
                  دسته‌بندی <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setValue("category", e.target.value)}
                  className={inputBaseClass}
                  disabled={loadingData}
                >
                  <option value="">انتخاب کنید...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBaseClass}>وضعیت</label>
                  <select
                    value={status}
                    onChange={(e) => setValue("status", e.target.value)}
                    className={inputBaseClass}
                  >
                    <option value="draft">پیش‌نویس</option>
                    <option value="pending">در انتظار</option>
                    <option value="under_review">بررسی</option>
                    <option value="approved">تایید شده</option>
                    <option value="in_progress">جاری</option>
                  </select>
                </div>

                <div>
                  <label className={labelBaseClass}>فوریت</label>
                  <select
                    value={urgencyLevel}
                    onChange={(e) => setValue("urgencyLevel", e.target.value)}
                    className={inputBaseClass}
                  >
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">زیاد</option>
                    <option value="critical">بحرانی</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelBaseClass}>مدت زمان تخمینی</label>
                <input
                  type="text"
                  {...register("estimatedDuration")}
                  className={inputBaseClass}
                  placeholder="مثال: 2 هفته"
                />
              </div>
            </div>
          </div>

          {/* Attachments Card */}
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <h3 className={sectionTitleClass}>
              <DocumentArrowUpIcon className="w-4 h-4 text-slate-400" />
              پیوست‌ها
            </h3>

            <div className="mt-2 space-y-3">
              {/* نمایش فایل‌های انتخاب شده */}
              {attachments && attachments.length > 0 && (
                <div className="space-y-2">
                  {Array.from(attachments).map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <DocumentArrowUpIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-[12px] text-blue-800 font-medium">{file.name}</span>
                        <span className="text-[10px] text-blue-600">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <DocumentArrowUpIcon className="w-8 h-8 mb-2 text-slate-400" />
                  <p className="mb-1 text-[11px] text-slate-500">
                    <span className="font-semibold">کلیک کنید</span> یا فایل را اینجا رها کنید
                  </p>
                  <p className="text-[10px] text-slate-400">PDF, DOC, JPG (حداکثر 20MB)</p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setValue("attachments", e.target.files)}
                  accept="image/*,video/*,application/pdf,application/msword"
                  className="hidden"
                />
              </label>
              {errors.attachments && (
                <p className="text-[11px] text-red-500 mt-2">{errors.attachments.message}</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateNeed;
