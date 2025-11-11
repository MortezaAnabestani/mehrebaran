import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/red.css";
import useAuthorForm from "../../hooks/useAuthorForm";
import { useEffect } from "react";
import { resetStatus } from "../../features/authorsSlice";
import { useDispatch } from "react-redux";
import SeoPart from "../../components/createContent/SeoPart";

const CreateAuthor = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setAlerts,
    alerts,
    approved,
    setApproved,
    dateOfBirth,
    setDateOfBirth,
    previewImage,
    handleImagePreview,
    loading,
    error,
    faults,
    setFaults,
  } = useAuthorForm();

  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch, setAlerts]);

  return (
    <div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">اضافه‌کردن نویسنده</h2>
          <Link
            rel="preconnect"
            to="/dashboard/authors"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
              مجمع نویسندگان
            </span>
          </Link>
        </div>
      </div>
      <div className="p-4 ">
        {(alerts || faults) && (
          <p
            className={`text-sm p-3 font-semibold text-center border ${
              faults ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
            } mb-3 animate-fade-out rounded-sm text-gray-800`}
          >
            {alerts || faults}
          </p>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          onMouseMove={
            alerts
              ? () => setTimeout(() => setAlerts(null), 5000)
              : faults
              ? () => setTimeout(() => setFaults(null), 5000)
              : null
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mb-3 gap-4">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="block text-xs font-medium text-gray-400">
                نام نویسنده
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
              <label htmlFor="birthday" className="block text-xs font-medium text-gray-400">
                سال تولد
              </label>
              <div className="flex lg:justify-start items-center gap-1">
                <div className="relative" onClick={() => setApproved(false)}>
                  <DatePicker
                    name="birthday"
                    id="birthday"
                    locale={persian_fa}
                    calendar={persian}
                    className="red absolute left-[-130px]"
                    format="YYYY/MM/DD"
                    value={dateOfBirth}
                    style={{ height: "38px" }}
                    onChange={setDateOfBirth}
                    calendarPosition="bottom-left"
                  />
                  <p className="text-xs text-red-500">{errors.birthday?.message}</p>
                </div>
                <div onClick={() => setApproved(true)}>
                  <img
                    src={`/assets/images/dashboard/icons/${approved ? "tick-green.svg" : "tick.svg"}`}
                    alt="teick icon"
                    className="h-8 w-8 cursor-pointer"
                  />
                </div>
                {!approved ? <p className="text-xs text-gray-500 animate-pulse">تاریخ را تأیید کنید</p> : ""}
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="instagramId" className="block text-xs font-medium text-gray-600">
                آیدی اینستاگرام
              </label>
              <input
                type="instagramId"
                name="instagramId"
                placeholder="@username"
                className="px-3 py-2 text-sm rounded-md ltr outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="instagramId"
                {...register("instagramId")}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="favoriteTemplate" className="block text-xs font-medium text-gray-600">
                زمینۀ فعالیت
              </label>
              <select
                required
                name="favoriteTemplate"
                id="favoriteTemplate"
                className="px3 text-sm py-2 rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
                {...register("favoriteTemplate")}
              >
                <option value={""}>انتخاب زمینه</option>
                <option value={"poetic"}>جستارنویسی</option>
                <option value={"scientific"}>علمی-پژوهشی</option>
              </select>
              <p className="text-xs text-red-500">{errors.favoriteTemplate?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="mobile" className="block text-xs font-medium text-gray-400">
                تلفن همراه
              </label>
              <input
                required
                type="text"
                name="mobile"
                placeholder="09151234567"
                className="px-3 py-2 text-sm ltr rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="mobile"
                {...register("mobile")}
              />
              <p className="text-xs text-red-500">{errors.mobile?.message}</p>
            </div>
            <div className="lg:col-start-1 lg:col-end-3">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="bio" className="block text-xs font-medium text-gray-400">
                  دربارۀ نویسنده
                </label>
                <textarea
                  required
                  name="bio"
                  id="bio"
                  rows="10"
                  className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400"
                  {...register("bio")}
                />
                <p className="text-xs text-red-500">{errors.bio?.message}</p>
              </div>
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
                  {...register("avatar", { required: true })}
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
                {errors.avatar && <p>لطفاً یک تصویر انتخاب کنید</p>}
              </div>
              {/* {!previewImage && (
                <p className="error text-xs text-red-600 mt-2 font-bold animate-pulse">
                  * انتخاب عکس ضروری است
                </p>
              )} */}
            </div>
          </div>
          <SeoPart register={register} />
          <div className="mt-4 text-left">
            <button
              type="submit"
              className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
            >
              {loading ? "در حال ارسال..." : "ثبت نویسنده"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuthor;
