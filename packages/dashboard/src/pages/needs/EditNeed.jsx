import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  PaperClipIcon,
  DocumentIcon,
  PhotoIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import useNeedForm from "../../hooks/useNeedForm";

// Helper function to get full URL for attachments
const getAttachmentUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const apiUrl = import.meta.env.VITE_SERVER_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
  const baseUrl = apiUrl.replace('/api/v1', '');
  return `${baseUrl}${url}`;
};

const EditNeed = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    loading,
    submitSuccess,
    submitError,
    setValue,
    watch,
    selectedNeed,
    categories,
    users,
    loadingData,
  } = useNeedForm(true);

  const status = watch("status");
  const urgencyLevel = watch("urgencyLevel");
  const category = watch("category");
  const user = watch("user");

  // Loading State - Minimal Engineering Style
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#007acc] rounded-full animate-spin"></div>
        <span className="text-[12px] font-mono text-slate-500">LOADING DATA...</span>
      </div>
    );
  }

  // Reusable Input Component for Consistency
  const FormInput = React.forwardRef(({ label, error, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <input
        ref={ref}
        className={`
          w-full h-9 px-3 rounded-md border bg-white text-[13px] text-slate-900
          placeholder:text-slate-400 transition-all outline-none
          focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-300"}
        `}
        {...props}
      />
      {error && <span className="text-[11px] text-red-500 font-medium">{error.message}</span>}
    </div>
  ));

  // Reusable Select Component
  const FormSelect = React.forwardRef(({ label, error, children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full h-9 pl-3 pr-8 rounded-md border bg-white text-[13px] text-slate-900
            appearance-none outline-none transition-all
            focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]
            ${error ? "border-red-500" : "border-slate-300"}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      {error && <span className="text-[11px] text-red-500 font-medium">{error.message}</span>}
    </div>
  ));

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/needs"
            className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-200 text-slate-500 hover:border-[#007acc] hover:text-[#007acc] transition-colors"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-[16px] font-bold text-slate-800 leading-tight">ویرایش نیاز</h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>ID: {selectedNeed?.id || "---"}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>EDIT MODE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard/needs">
            <button className="px-4 py-2 text-[12px] font-medium text-slate-600 hover:text-slate-900 transition-colors">
              انصراف
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-[#007acc] hover:bg-[#0062a3] text-white text-[12px] font-medium rounded-md shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <span>ذخیره تغییرات</span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Alerts */}
        {submitSuccess && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-3 text-emerald-700">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="text-[13px] font-medium">نیاز با موفقیت ویرایش و ذخیره شد.</span>
          </div>
        )}
        {submitError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-3 text-red-700">
            <XCircleIcon className="w-5 h-5" />
            <span className="text-[13px] font-medium">{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          {/* Left Column: Main Info (8 cols) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* General Information Panel */}
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  اطلاعات پایه
                </span>
              </div>
              <div className="p-5 space-y-5">
                <FormInput
                  label="عنوان نیاز *"
                  placeholder="مثال: نیاز به تعمیر سقف مدرسه..."
                  {...register("title")}
                  error={errors.title}
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    توضیحات کامل *
                  </label>
                  <textarea
                    rows={8}
                    className={`
                      w-full p-3 rounded-md border bg-white text-[13px] text-slate-900 
                      placeholder:text-slate-400 transition-all outline-none resize-y
                      focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]
                      ${errors.description ? "border-red-500" : "border-slate-300"}
                    `}
                    {...register("description")}
                  />
                  {errors.description && (
                    <span className="text-[11px] text-red-500 font-medium">{errors.description.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Location Panel */}
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-slate-500" />
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  موقعیت مکانی
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="استان" {...register("location.province")} />
                <FormInput label="شهر" {...register("location.city")} />
                <FormInput
                  label="نام مکان"
                  placeholder="مثال: مدرسه شهید رجایی"
                  {...register("location.locationName")}
                />
                <div className="md:col-span-2">
                  <FormInput label="آدرس دقیق" {...register("location.address")} />
                </div>
              </div>
            </div>

            {/* Attachments Panel */}
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                <PaperClipIcon className="w-4 h-4 text-slate-500" />
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  مستندات و فایل‌ها
                </span>
              </div>
              <div className="p-5">
                {/* Existing Files */}
                {selectedNeed?.attachments && selectedNeed.attachments.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[12px] font-medium text-slate-700 mb-3">فایل‌های موجود:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedNeed.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="group relative border border-slate-200 rounded-md overflow-hidden bg-slate-50 hover:border-[#007acc] transition-colors"
                        >
                          {attachment.fileType === "image" ? (
                            <div className="aspect-video w-full overflow-hidden">
                              <img
                                src={getAttachmentUrl(attachment.url)}
                                alt={attachment.fileName}
                                className="w-full h-full object-cover"
                                onError={() => {
                                  console.error('Failed to load image:', attachment.url);
                                }}
                              />
                            </div>
                          ) : (
                            <div className="aspect-video w-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <DocumentIcon className="w-8 h-8" />
                            </div>
                          )}
                          <div className="p-2 bg-white border-t border-slate-100">
                            <p className="text-[10px] text-slate-600 truncate">
                              {attachment.fileName || "فایل ضمیمه"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New */}
                <div className="border-2 border-dashed border-slate-300 rounded-md p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setValue("attachments", e.target.files)}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#007acc] flex items-center justify-center mb-3">
                    <PhotoIcon className="w-5 h-5" />
                  </div>
                  <p className="text-[13px] font-medium text-slate-700">
                    برای آپلود کلیک کنید یا فایل را اینجا رها کنید
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">تصویر، ویدیو یا PDF (حداکثر ۲۰ مگابایت)</p>
                </div>
                {errors.attachments && (
                  <p className="text-[11px] text-red-500 mt-2">{errors.attachments.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Meta Data (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Status & Classification Panel */}
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden sticky top-24">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  تنظیمات وضعیت
                </span>
              </div>
              <div className="p-5 space-y-5">
                <FormSelect
                  label="وضعیت فعلی"
                  value={status}
                  onChange={(e) => setValue("status", e.target.value)}
                >
                  <option value="draft">پیش‌نویس (Draft)</option>
                  <option value="pending">در انتظار (Pending)</option>
                  <option value="under_review">در حال بررسی (Review)</option>
                  <option value="approved">تایید شده (Approved)</option>
                  <option value="in_progress">در حال انجام (In Progress)</option>
                  <option value="completed">تکمیل شده (Completed)</option>
                  <option value="rejected">رد شده (Rejected)</option>
                  <option value="archived">آرشیو شده (Archived)</option>
                </FormSelect>

                <div className="h-px bg-slate-100 w-full"></div>

                <FormSelect
                  label="کاربر (صاحب نیاز) *"
                  value={user}
                  onChange={(e) => setValue("user", e.target.value)}
                  error={errors.user}
                  disabled={loadingData}
                >
                  <option value="">انتخاب کنید...</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullName || u.username} {u.email && `(${u.email})`}
                    </option>
                  ))}
                </FormSelect>

                <FormSelect
                  label="دسته‌بندی *"
                  value={category}
                  onChange={(e) => setValue("category", e.target.value)}
                  error={errors.category}
                  disabled={loadingData}
                >
                  <option value="">انتخاب کنید...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </FormSelect>

                <FormSelect
                  label="سطح فوریت"
                  value={urgencyLevel}
                  onChange={(e) => setValue("urgencyLevel", e.target.value)}
                >
                  <option value="low">کم (Low)</option>
                  <option value="medium">متوسط (Medium)</option>
                  <option value="high">زیاد (High)</option>
                  <option value="critical">بحرانی (Critical)</option>
                </FormSelect>

                <div className="bg-blue-50/50 border border-blue-100 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="w-4 h-4 text-[#007acc]" />
                    <span className="text-[11px] font-bold text-[#007acc]">تخمین زمانی</span>
                  </div>
                  <input
                    className="w-full h-8 px-2 bg-white border border-blue-200 rounded text-[12px] text-slate-700 focus:outline-none focus:border-[#007acc]"
                    placeholder="مثال: 2 هفته"
                    {...register("estimatedDuration")}
                  />
                </div>
              </div>

              {/* Meta Info Footer */}
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>CREATED:</span>
                  <span>
                    {selectedNeed?.createdAt
                      ? new Date(selectedNeed.createdAt).toLocaleDateString("fa-IR")
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1">
                  <span>UPDATED:</span>
                  <span>
                    {selectedNeed?.updatedAt
                      ? new Date(selectedNeed.updatedAt).toLocaleDateString("fa-IR")
                      : "NOW"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditNeed;
