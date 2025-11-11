import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/red.css";
import useHonorForm from "../../hooks/useHonorForm";
import SeoPart from "../../components/createContent/SeoPart";

const CreateHonor = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    alerts,
    approved,
    setApproved,
    dateOfHonor,
    setDateOfHonor,
    previewImage,
    handleImagePreview,
    loading,
    error,
    setAlerts,
    authors,
    articles,
  } = useHonorForm();

  return (
    <div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-md lg:text-xl font-medium">اضافه‌کردن افتخار جدید</h2>
          <Link
            rel="preconnect"
            to="/dashboard/honors"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 text-sm lg:text-md animate-pulse animate-thrice animate-ease-in-out">
              فهرست افتخارات
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
              <label htmlFor="title" className="block text-xs font-medium text-gray-400">
                عنوان اصلی افتخار
              </label>
              <input
                required
                type="text"
                name="title"
                placeholder="مقام اول مقالۀ ادبی"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="title"
                {...register("title")}
              />
              <p className="text-xs text-red-500">{errors.title?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="subTitle" className="block text-xs font-medium text-gray-400">
                عنوان فرعی
              </label>
              <input
                type="subTitle"
                name="subTitle"
                placeholder="سومین مسابقات ملی نشریات دانگشگاهی"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="subTitle"
                {...register("subTitle")}
              />
              <p className="text-xs text-red-500">{errors.subTitle?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="article" className="block text-xs font-medium text-gray-400">
                مقالۀ منتخب
              </label>
              <select
                required
                name="article"
                id="article"
                className="px3 text-xs py-2 rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
                {...register("article")}
              >
                <option value={null}>انتخاب مقالۀ منتخب</option>
                {articles?.articles?.map((article, index) => (
                  <option key={index} value={article._id}>
                    {`${article.title} ⸎ «${article?.issue?.title}»`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-red-500">{errors.template?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="author" className="block text-xs font-medium text-gray-400">
                نویسندۀ منتخب
              </label>
              <select
                required
                name="author"
                id="author"
                className="px3 text-xs py-2 rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
                {...register("author")}
              >
                <option value={null}>انتخاب نویسندۀ منتخب</option>
                {authors?.authors?.map((author, index) => (
                  <option key={index} value={author._id}>
                    {`${author?.name}`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-red-500">{errors.template?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="birthday" className="block text-xs font-medium text-gray-400">
                انتخاب تاریخ کسب افتخار
              </label>
              <div className="flex lg:justify-start items-center gap-1">
                <div className="relative" onClick={() => setApproved(false)}>
                  <DatePicker
                    onlyMonthPicker
                    name="birthday"
                    id="birthday"
                    locale={persian_fa}
                    calendar={persian}
                    className="red absolute left-[-130px]"
                    format="YYYY/MM"
                    style={{ height: "38px" }}
                    value={dateOfHonor}
                    onChange={setDateOfHonor}
                    calendarPosition="bottom-left"
                  />
                  <p className="text-xs text-red-500">{errors.dateOfHonor?.message}</p>
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
            <div className="lg:col-start-1 lg:col-end-3">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="description" className="block text-xs font-medium text-gray-400">
                  توضیحات افتخار
                </label>
                <textarea
                  required
                  name="description"
                  id="description"
                  rows="10"
                  className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400"
                  {...register("description")}
                />
                <p className="text-xs text-red-500">{errors.description?.message}</p>
              </div>
            </div>
            <div className="w-full lg:w-[300px]">
              <label className="block text-xs font-medium text-gray-400 mb-2">انتخاب عکس</label>
              <div className="bg-slate-100 rounded-md p-2 border lg:max-h-100 lg:max-w-100 border-gray-400 border-dotted">
                <label
                  htmlFor="coverImage"
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
                  {...register("coverImage")}
                  type="file"
                  accept="image/*"
                  name="coverImage"
                  className="hidden"
                  id="coverImage"
                  onChange={handleImagePreview}
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="پیش‌نمایش"
                    className="h-70 max-h-70 w-80 object-cover rounded-md mt-3 border border-red-300"
                  />
                )}
                {errors.coverImage && <p className="error">{errors.coverImage.message}</p>}
              </div>
            </div>
          </div>
          <SeoPart register={register} />
          <div className="mt-4 text-left">
            <button
              type="submit"
              className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
            >
              {loading ? "در حال ارسال..." : "ثبت افتخار جدید"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHonor;
