import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/red.css";
import useEventForm from "../../hooks/useEventForm";
import SeoPart from "../../components/createContent/SeoPart";
import ArticleGallery from "../../components/createContent/ArticleGallery";
const CreateEvent = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    selectedImages,
    handleImageSelection,
    removeImage,
    onSubmit,
    submitSuccess,
    submitError,
    setApproved,
    approved,
    dateOfEvent,
    setDateOfEvent,
    watch,
  } = useEventForm(true);

  return (
    <div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-md lg:text-xl font-medium">اضافه‌کردن رویداد جدید</h2>
          <Link
            rel="preconnect"
            to="/dashboard/events"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 text-sm lg:text-md animate-pulse animate-thrice animate-ease-in-out">
              فهرست رویدادها
            </span>
          </Link>
        </div>
      </div>
      <div className="p-4">
        {submitSuccess && (
          <p className="text-sm p-3 font-semibold text-center border text-green-600 bg-green-50 mb-3 animate-fade-out rounded-sm text-gray-800">
            رویداد با موفقیت ثبت شد
          </p>
        )}
        {submitError && (
          <p className="text-sm p-3 font-semibold text-center border text-red-600 bg-red-50 mb-3 animate-fade-out rounded-sm text-gray-800">
            خطا در ثبت رویداد: {submitError}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mb-3 gap-4">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="title" className="block text-xs font-medium text-gray-400">
                عنوان رویداد
              </label>
              <input
                required
                type="text"
                name="title"
                placeholder="همایش سالانه مجله"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="title"
                {...register("title")}
              />
              <p className="text-xs text-red-500">{errors.title?.message}</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <label htmlFor="date" className="block text-xs font-medium text-gray-400">
                تاریخ برگزاری
              </label>
              <div className="flex lg:justify-start items-center gap-1">
                <div className="relative">
                  <DatePicker
                    {...register("date")}
                    name="date"
                    id="date"
                    locale={persian_fa}
                    calendar={persian}
                    className="red absolute left-[-130px]"
                    format="YYYY/MM/DD"
                    value={dateOfEvent}
                    style={{ height: "38px" }}
                    onChange={setDateOfEvent}
                    calendarPosition="bottom-left"
                  />
                  <p className="text-xs text-red-500">{errors.date?.message}</p>
                </div>
                <div onClick={() => setApproved(true)}>
                  <img
                    src={`/assets/images/dashboard/icons/${approved ? "tick-green.svg" : "tick.svg"}`}
                    alt="teick icon"
                    className="h-8 w-8 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-start-1 lg:col-end-3">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="description" className="block text-xs font-medium text-gray-400">
                  توضیحات رویداد
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
              <ArticleGallery
                register={register}
                watch={watch}
                handleImageSelection={handleImageSelection}
                selectedImages={selectedImages}
                removeImage={removeImage}
                errors={errors}
                editMode={true}
              />
            </div>
          </div>
          <SeoPart register={register} />
          <div className="mt-4 text-left">
            <button
              type="submit"
              className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "در حال ارسال..." : "ویرایش"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
