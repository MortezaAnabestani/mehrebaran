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
    <div className="w-full flex flex-col items-center h-4/10">
      <h1 className="font-bold mb-8 self-start">تنظیمات پروفایل</h1>
      <div className="p-2">
        {alerts && (
          <p
            className={`text-sm p-3 font-semibold text-center border ${
              error ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
            } mb-3 animate-fade-out rounded-sm text-gray-800`}
          >
            {alerts}
          </p>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onMouseDown={() => setAlerts(null)}
        className="relative md:-translate-y-15 p-3 border-6 text-sm border-red-100 shadow-xs shadow-red-800 md:-rotate-2 hover:rotate-0 duration-200 group"
      >
        <span className="absolute right-1 top-1 group-hover:translate-x-10 group-hover:-translate-y-10 group-hover:opacity-0 duration-2000">
          <img loading="lazy" src="/assets/images/dashboard/icons/butterfly.svg" className="w-6" />
        </span>
        <div className="w-full mx-auto flex flex-col gap-3 items-center justify-between">
          <div className="bg-slate-100 rounded-md p-2 border border-gray-400 border-dotted">
            <label
              htmlFor="avatar"
              className="flex flex-row items-center justify-between text-xs font-medium cursor-pointer"
            >
              <span className="block">برای انتخاب عکس جدید کلیک کنید</span>
              <img
                className="w-8 h-8 animate-pulse animate-ease-in-out"
                src="/assets/images/dashboard/icons/portrait.svg"
                alt="image"
              />
            </label>
            <input
              {...register("avatar")}
              type="file"
              accept="image/*"
              name="avatar"
              className="hidden"
              id="avatar"
              onChange={handleImagePreview}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="پیش‌نمایش"
                className="h-50 w-50 object-cover rounded-full mt-3 border-4 border-red-200"
              />
            )}
            {errors.avatar && <p className="error">{errors.avatar.message}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-xs text-gray-400">
              نام:
            </label>
            <input
              className="border py-1 px-3 border-gray-300"
              type="text"
              name="name"
              id="name"
              {...register("name")}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="text-xs text-gray-400">
              نام کاربری:
            </label>
            <input
              className="border py-1 px-3 border-gray-300 text-left"
              type="text"
              name="username"
              {...register("username")}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-xs text-gray-400">
              ایمیل:
            </label>
            <input
              className="border py-1 px-3 border-gray-300 text-left"
              type="text"
              name="email"
              {...register("email")}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-xs text-gray-400">
              تغییر رمز عبور:
            </label>
            <input
              className="border py-1 px-3 border-gray-300 text-left"
              type="text"
              name="password"
              {...register("password")}
            />
          </div>
          <button
            type="submit"
            className="w-full text-sm py-2 bg-green-400 cursor-pointer hover:bg-green-500 duration-200"
          >
            به‌روزرسانی
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
