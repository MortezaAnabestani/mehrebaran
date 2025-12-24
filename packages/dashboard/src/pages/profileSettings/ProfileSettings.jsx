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
  } = useAdminForm(true);

  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch, setAlerts]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-10 px-4 font-sans text-gray-700">
      {/* Header Title with Embossed Effect */}
      <h1 className="text-xl font-bold text-[#007acc] drop-shadow-sm">تنظیمات پروفایل</h1>

      {/* Alert Section - Neumorphic Style */}
      <div className="w-full max-w-2xl mb-6 min-h-[3rem]">
        {alerts && (
          <div
            className={`px-6 py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300 shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] ${
              error ? "text-red-500 bg-[#e2e6eb]" : "text-[#007acc] bg-[#e0e5ec]"
            }`}
          >
            {alerts}
          </div>
        )}
      </div>

      {/* Main Card - Raised Skeuomorphic Container */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onMouseDown={() => setAlerts(null)}
        className="w-full max-w-xl bg-[#e0e5ec] rounded-3xl p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] border border-white/20"
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Column: Avatar Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
            <div className="relative group">
              {/* Avatar Container with Ring Effect */}
              <div className="w-40 h-40 rounded-full p-2 bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="پیش‌نمایش"
                    className="w-full h-full object-cover rounded-full shadow-md"
                  />
                ) : (
                  <img
                    src="/assets/images/dashboard/icons/portrait.svg"
                    alt="default"
                    className="w-20 h-20 opacity-40"
                  />
                )}
              </div>

              {/* Upload Button Overlay */}
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-[#007acc] text-white p-2 rounded-full shadow-[3px_3px_6px_rgba(0,0,0,0.2)] cursor-pointer hover:bg-[#0062a3] transition-colors active:scale-95"
                title="تغییر عکس"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
            </div>

            <input
              {...register("avatar")}
              type="file"
              accept="image/*"
              id="avatar"
              className="hidden"
              onChange={handleImagePreview}
            />
            <span className="text-xs text-gray-500 font-medium">
              {errors.avatar ? (
                <span className="text-red-500">{errors.avatar.message}</span>
              ) : (
                "تصویر پروفایل خود را انتخاب کنید"
              )}
            </span>
          </div>

          {/* Right Column: Form Inputs */}
          <div className="w-full md:w-2/3 flex flex-col gap-5">
            {/* Input Group Component */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-gray-600 mr-2">
                نام کامل
              </label>
              <input
                className="w-full bg-[#e0e5ec] rounded-xl px-4 py-3 text-gray-700 outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] focus:shadow-[inset_2px_2px_5px_#bebebe,inset_-2px_-2px_5px_#ffffff] focus:ring-2 focus:ring-[#007acc]/20 transition-all"
                type="text"
                id="name"
                placeholder="نام خود را وارد کنید"
                {...register("name")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-bold text-gray-600 mr-2">
                نام کاربری
              </label>
              <input
                className="w-full bg-[#e0e5ec] rounded-xl px-4 py-3 text-gray-700 outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] focus:ring-2 focus:ring-[#007acc]/20 transition-all text-left dir-ltr"
                type="text"
                id="username"
                {...register("username")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-bold text-gray-600 mr-2">
                ایمیل
              </label>
              <input
                className="w-full bg-[#e0e5ec] rounded-xl px-4 py-3 text-gray-700 outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] focus:ring-2 focus:ring-[#007acc]/20 transition-all text-left dir-ltr"
                type="email"
                id="email"
                {...register("email")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-bold text-gray-600 mr-2">
                تغییر رمز عبور
              </label>
              <input
                className="w-full bg-[#e0e5ec] rounded-xl px-4 py-3 text-gray-700 outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] focus:ring-2 focus:ring-[#007acc]/20 transition-all text-left dir-ltr placeholder-gray-400"
                type="password"
                id="password"
                placeholder="********"
                {...register("password")}
              />
            </div>

            {/* Submit Button - Raised & Pressable */}
            <button
              type="submit"
              className="mt-4 w-full py-3 rounded-xl bg-[#007acc] text-white font-bold text-lg shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] hover:bg-[#006bb3] active:shadow-[inset_4px_4px_8px_#004c80,inset_-4px_-4px_8px_#00a8ff] active:translate-y-[2px] transition-all duration-200 ease-in-out"
            >
              به‌روزرسانی اطلاعات
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
