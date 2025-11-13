import { Link } from "react-router-dom";
import useAdminForm from "../../hooks/useAdminForm";
import { useEffect } from "react";
import { resetStatus } from "../../features/adminsSlice";
import { useDispatch } from "react-redux";

const EditAdmin = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    alerts,
    previewImage,
    handleImagePreview,
    loading,
    error,
    setAlerts,
  } = useAdminForm(true);

  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch, setAlerts]);

  return (
    <div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">ویرایش مدیر تارنما</h2>
          <Link
            rel="preconnect"
            to="/dashboard/admins"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
              فهرست مدیران تارنما
            </span>
          </Link>
        </div>
      </div>
      <div className="p-4 ">
        {alerts && (
          <p
            className={`text-sm p-3 font-semibold text-center border ${
              error ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
            } mb-3 animate-fade-out rounded-sm text-gray-800`}
          >
            {alerts}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} onMouseDown={() => setAlerts(null)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mb-3 gap-4">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="block text-xs font-medium text-gray-400">
                نام مدیر تارنما
              </label>
              <input
                required
                type="text"
                name="name"
                placeholder="هوشنگ مرادی کرمانی"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="name"
                {...register("name")}
              />
              <p className="text-xs text-red-500">{errors.name?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="email" className="block text-xs font-medium text-gray-400">
                ایمیل
              </label>
              <input
                type="email"
                name="email"
                placeholder="dolatabadi@gmail.com"
                className="px-3 py-2 text-sm rounded-md ltr outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="email"
                {...register("email")}
              />
              <p className="text-xs text-red-500">{errors.email?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="username" className="block text-xs font-medium text-gray-600">
                نام کاربری (ورود مدیر تارنما با نام کاربری صورت می‌گیرد)
              </label>
              <input
                type="username"
                name="username"
                placeholder="@username"
                className="px-3 py-2 text-sm rounded-md ltr outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="username"
                {...register("username")}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="role" className="block text-xs font-medium text-gray-600">
                سطح دسترسی
              </label>
              <select
                required
                name="role"
                id="role"
                className="px3 text-sm py-2 rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
                {...register("role")}
              >
                <option value={""}>سطح دسترسی</option>
                <option value={"admin"}>ادمین (سطح دسترسی محدود)</option>
                <option value={"manager"}>مدیر (سطح دسترسی نامحدود)</option>
              </select>
              <p className="text-xs text-red-500">{errors.favoriteTemplate?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="password" className="block text-xs font-medium text-gray-400">
                در صورتی که می‌خواهید رمز عبور تغییر کند، رمز جدید را این‌جا بنویسید
              </label>
              <input
                type="password"
                name="password"
                placeholder="pass@yu69"
                className="px-3 py-2 text-sm ltr rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="password"
                {...register("password")}
              />
              <p className="text-xs text-red-500">{errors.mobile?.message}</p>
            </div>
            <div className="w-full lg:w-[300px]">
              <label className="block text-xs font-medium text-gray-400 mb-2">انتخاب عکس</label>
              <div className="bg-slate-100 rounded-md p-2 border lg:max-h-100 lg:max-w-100 border-gray-400 border-dotted">
                <label
                  htmlFor="avatar"
                  className="flex flex-row items-center justify-between text-xs font-medium cursor-pointer"
                >
                  <span className="block">برای انتخاب عکس کلیک کنید</span>
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
                    className="h-70 max-h-70 w-80 object-cover rounded-md mt-3 border border-red-300"
                  />
                )}
                {errors.avatar && <p className="error">{errors.avatar.message}</p>}
              </div>
            </div>
          </div>
          <div className="mt-4 text-left">
            <button
              type="submit"
              className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
            >
              {loading ? "در حال ارسال..." : "ویرایش اطلاعات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;
