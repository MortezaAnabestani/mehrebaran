import { Link } from "react-router-dom";
import useEducationForm from "../../hooks/useEducationForm";
import { useEffect } from "react";
import { resetStatus } from "../../features/educationsSlice";
import { useDispatch } from "react-redux";
import SeoPart from "../../components/createContent/SeoPart";

const CreateEducation = () => {
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
    watch,
  } = useEducationForm();

  const watchTitle = watch("title");
  const watchDetail = watch("details");

  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch, setAlerts]);

  return (
    <div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">اضافه‌کردن آموزش جدید</h2>
          <Link
            rel="preconnect"
            to="/dashboard/educations"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
              فهرست آموزش‌ها
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
                عنوان محتوای آموزشی
              </label>
              <input
                required
                type="text"
                name="title"
                placeholder="یادگیری هنر خطاطی در سه مرحله"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="title"
                {...register("title")}
              />
              <p className="text-xs text-red-500">{errors.title?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="details" className="block text-xs font-medium text-gray-400">
                جزئیات برجسته
              </label>
              <input
                type="details"
                name="details"
                placeholder="ده جلسه || استاد: غلامحسين اميرخانى || رسته: نستعلیق"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="details"
                {...register("details")}
              />
              <p className="text-xs text-red-500">{errors.details?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="videoUrl" className="block text-xs font-medium text-gray-600">
                آدرس ویدئو
              </label>
              <input
                type="videoUrl"
                name="videoUrl"
                placeholder="https://..."
                className="px-3 py-2  text-sm rounded-md ltr outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="videoUrl"
                {...register("videoUrl")}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="order" className="block text-xs font-medium text-gray-400">
                درجۀ اولویت (یک، بالاترین)
              </label>
              <select
                required
                name="order"
                id="order"
                className="px3 text-sm py-2 font-bold text-center rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
                {...register("order")}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
                  <option key={index} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <p className="text-xs text-red-500">{errors?.videoUrl?.message}</p>
            </div>
            <div className="lg:col-start-1 lg:col-end-3">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="description" className="block text-xs font-medium text-gray-400">
                  توضیحات
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
          </div>
          <div className="w-full lg:w-[600px] mx-auto mb-5">
            <label className="block text-xs font-medium text-gray-400 mb-2">انتخاب کاور ویدئو</label>
            <div className="bg-slate-100 rounded-md p-2 border lg:max-h-100 lg:max-w-600 border-gray-400 border-dotted">
              <label
                htmlFor="coverImage"
                className="flex flex-row items-center justify-between text-xs font-medium cursor-pointer"
              >
                <span className="block">برای انتخاب عکس کاور فیلم کلیک کنید</span>
                <img
                  className="w-8 h-8 animate-pulse animate-ease-in-out"
                  src="/assets/images/dashboard/icons/gallery.svg"
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
                <div className="relative bg-red-400">
                  <img
                    src={previewImage}
                    alt="پیش‌نمایش"
                    className="h-70 max-h-70 w-full opacity-70 object-cover blur-[1px] rounded-md mt-3 border border-red-300"
                  />
                  <img
                    src="/assets/images/dashboard/icons/play.svg"
                    alt="play icon icon"
                    className="w-17 h-17 absolute right-[40%] lg:right-[46%] cursor-pointer shadow-gray-500  top-[32%] z-10"
                  />
                  <p className="absolute bg-red-500 z-10 bottom-7 right-0 h-7 w-full py-[6px] pr-3 text-white font-semibold text-xs">
                    {watchTitle && watchTitle}
                  </p>
                  <p className="absolute bg-black z-10 bottom-0 right-0 h-7 w-full py-[6px] pr-3 text-white font-normal text-xs">
                    {watchDetail && watchDetail}
                  </p>
                </div>
              )}
              {errors.coverImage && <p className="error">{errors.coverImage.message}</p>}
            </div>
          </div>
          <SeoPart register={register} />
          <div className="mt-4 text-left">
            <button
              type="submit"
              className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
            >
              {loading ? "در حال ارسال..." : "ایجاد محتوای آموزشی"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEducation;
