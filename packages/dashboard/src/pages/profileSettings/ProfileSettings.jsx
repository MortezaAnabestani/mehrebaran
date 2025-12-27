import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useAdminForm from "../../hooks/useAdminForm";
import { resetStatus } from "../../features/adminsSlice";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    alerts,
    previewImage,
    handleImagePreview,
    error,
    setAlerts,
  } = useAdminForm(true, true); // isEdit=true, isProfile=true

  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch, setAlerts]);

  console.log("previewImage: " + previewImage);

  return (
    <div className="w-full min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800">تنظیمات حساب کاربری</h1>
            <p className="text-[11px] text-slate-500 mt-1">اطلاعات پروفایل و امنیتی خود را مدیریت کنید.</p>
          </div>
          {/* Status Badge (Optional Visual Element) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-medium text-slate-600">وضعیت: فعال</span>
          </div>
        </div>

        {/* Alert Section - Functional Style */}
        {alerts && (
          <div
            className={`mb-6 px-4 py-3 rounded-md border text-xs font-medium flex items-center gap-2 ${
              error ? "bg-red-50 border-red-200 text-red-700" : "bg-blue-50 border-blue-200 text-[#007acc]"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${error ? "bg-red-500" : "bg-[#007acc]"}`}></span>
            {alerts}
          </div>
        )}

        {/* Main Form Container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          onMouseDown={() => setAlerts(null)}
          className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden"
        >
          {/* Section Header */}
          <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200 flex items-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              اطلاعات عمومی
            </span>
          </div>

          <div className="p-6 grid grid-cols-12 gap-8">
            {/* Left Column: Avatar (Engineering Style) */}
            <div className="col-span-12 md:col-span-3 flex flex-col gap-4 border-b md:border-b-0 md:border-l border-slate-100 pb-6 md:pb-0 md:pl-6">
              <span className="text-xs font-semibold text-slate-700">تصویر پروفایل</span>

              <div className="relative group w-full aspect-square max-w-[160px] bg-slate-100 rounded-md border border-slate-200 overflow-hidden flex items-center justify-center self-center md:self-start">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-[10px]">بدون تصویر</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full max-w-[160px] self-center md:self-start">
                <label
                  htmlFor="avatar"
                  className="flex items-center justify-center w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer shadow-sm"
                >
                  انتخاب فایل...
                </label>
                <input
                  {...register("avatar")}
                  type="file"
                  accept="image/*"
                  id="avatar"
                  className="hidden"
                  onChange={handleImagePreview}
                />
                {errors.avatar && (
                  <span className="text-[10px] text-red-500 text-center md:text-right">
                    {errors.avatar.message}
                  </span>
                )}
                <p className="text-[10px] text-slate-400 text-center md:text-right leading-tight">
                  فرمت‌های مجاز: JPG, PNG <br /> حداکثر حجم: 2MB
                </p>
              </div>
            </div>

            {/* Right Column: Inputs */}
            <div className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 content-start">
              {/* Full Name */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="name" className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  نام کامل
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all"
                  placeholder="نام و نام خانوادگی"
                  {...register("name")}
                />
              </div>

              {/* Username */}
              <div className="col-span-1">
                <label htmlFor="username" className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  نام کاربری
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all text-left dir-ltr font-mono"
                  {...register("username")}
                />
              </div>

              {/* Email */}
              <div className="col-span-1">
                <label htmlFor="email" className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  آدرس ایمیل
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all text-left dir-ltr font-mono"
                  {...register("email")}
                />
              </div>

              {/* Password */}
              <div className="col-span-1 md:col-span-2 pt-2 border-t border-slate-100 mt-2">
                <label htmlFor="password" className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  تغییر رمز عبور <span className="text-slate-400 font-normal">(اختیاری)</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    dir="ltr"
                    placeholder="••••••••"
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all text-left font-mono"
                    {...register("password")}
                  />
                  <div className="absolute text-left inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              onClick={() => window.history.back()}
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-medium text-white bg-[#007acc] rounded-md hover:bg-[#0062a3] focus:ring-2 focus:ring-offset-2 focus:ring-[#007acc] transition-all shadow-sm"
            >
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
