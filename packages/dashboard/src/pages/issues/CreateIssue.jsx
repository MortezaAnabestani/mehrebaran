import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/red.css";
import useIssueForm from "../../hooks/useIssueForm";

const CreateIssue = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setAlerts,
    alerts,
    approved,
    setApproved,
    release,
    setRelease,
    previewImage,
    handleImagePreview,
    loading,
    error,
    selectedAuthors,
    templates,
    authors,
    authorHandler,
    removeAuthor,
    faults,
    setFaults,
  } = useIssueForm();
  return (
    <div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-md lg:text-xl font-medium">اضافه‌کردن شمارۀ جدید</h2>
          <Link
            rel="preconnect"
            to="/dashboard/issues"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 text-sm lg:text-md animate-pulse animate-thrice animate-ease-in-out">
              فهرست شماره‌ها
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
              <label htmlFor="title" className="block text-xs font-medium text-gray-400">
                عنوان اصلی شماره
              </label>
              <input
                required
                type="text"
                name="title"
                placeholder="جایی که تاریکی می‌تابد"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="title"
                {...register("title")}
              />
              <p className="text-xs text-red-500">{errors.title?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="titleEn" className="block text-xs font-medium text-gray-400">
                عنوان اصلی شماره (انگلیسی)
              </label>
              <input
                required
                type="text"
                name="titleEn"
                placeholder="Where Darkness Shines"
                className="px-3 py-2 ltr text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="titleEn"
                {...register("titleEn")}
              />
              <p className="text-xs text-red-500">{errors.titleEn?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="subTitle" className="block text-xs font-medium text-gray-400">
                عنوان فرعی
              </label>
              <input
                required
                type="subTitle"
                name="subTitle"
                placeholder="دربارۀ زیست شبانه"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="subTitle"
                {...register("subTitle")}
              />
              <p className="text-xs text-red-500">{errors.subTitle?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="subTitleEn" className="block text-xs font-medium text-gray-400">
                عنوان فرعی (انگلیسی)
              </label>
              <input
                required
                type="subTitleEn"
                name="subTitleEn"
                placeholder="About Nocturnal Life"
                className="px-3 py-2 ltr text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="subTitleEn"
                {...register("subTitleEn")}
              />
              <p className="text-xs text-red-500">{errors.subTitleEn?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="issueNumber" className="block text-xs font-medium text-gray-400">
                شمارۀ نشر
              </label>
              <input
                required
                type="issueNumber"
                name="issueNumber"
                placeholder="۱۰۷ و ۱۰۸"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="issueNumber"
                {...register("issueNumber")}
              />
              <p className="text-xs text-red-500">{errors.issueNumber?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="template" className="block text-xs font-medium text-gray-400">
                قالب شماره
              </label>
              <select
                required
                name="template"
                id="template"
                className="px3 text-sm py-2 rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
                {...register("template")}
              >
                <option value={""}>انتخاب قالب</option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-red-500">{errors.template?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="author" className="block text-xs font-medium text-gray-400">
                نویسندگان
              </label>
              <select
                onChange={(e) => authorHandler(e.target.value)}
                required
                name="author"
                id="author"
                className="px3 text-sm py-2 rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
              >
                <option value={""}>انتخاب نویسنده</option>
                {authors?.authors?.map((author) => (
                  <option key={author._id} value={author._id}>
                    {author.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-red-500">{errors.template?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="birthday" className="block text-xs font-medium text-gray-400">
                انتخاب ماه و سال نشر
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
                    value={release}
                    onChange={setRelease}
                    calendarPosition="bottom-left"
                    required
                  />
                  <p className="text-xs text-red-500">{errors.releaseDate?.message}</p>
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
              <label htmlFor="authors" className="block text-xs font-medium text-gray-400">
                با آثاری از
              </label>
              <div
                name="authors"
                className="mt-3 flex flex-wrap gap-2 p-3 rounded-md outline-0 border border-gray-300 focus:border-gray-400"
              >
                {selectedAuthors.map((author) => (
                  <div key={author._id} className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-md">
                    <img
                      src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${author.avatar}`}
                      alt={author?.name}
                      className="h-8 w-8 rounded-full object-cover border border-red-300"
                    />
                    <span className="text-sm text-gray-700">{author.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAuthor(author._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <img
                        src="/assets/images/dashboard/icons/close.svg"
                        alt="close icon"
                        className="h-5 w-5 cursor-pointer"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-start-1 lg:col-end-3">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="description" className="block text-xs font-medium text-gray-400">
                  توضیحات شماره
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
              <input type="hidden" {...register("authors")} />
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
          <div className="mt-4 text-left">
            <button
              type="submit"
              className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
            >
              {loading ? "در حال ارسال..." : "ثبت شمارۀ جدید"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssue;
