import { Link } from "react-router-dom";
import useSectionForm from "../../hooks/useSectionForm";

const EditSection = () => {
  const { register, handleSubmit, onSubmit, errors, alerts, loading, selectedSection } = useSectionForm();
  return (
    <div className="ml-3">
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">ویرایش دسته/بخش</h2>
          <Link
            rel="preconnect"
            to="/dashboard/sections"
            className="px-3 py-[6px] text-md bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 text-xs lg:text-lg animate-ease-in-out">فهرست دسته‌بندی‌ها</span>
          </Link>
        </div>
      </div>
      <div className="mt-4">
        <div className="bg-linear-to-r from-gray-200 via-red-500 to-red-700 rounded-sm">
          <img
            className="w-50 h-30 mx-auto hover:translate-1.5 duration-300 "
            name="title"
            src={`/assets/images/site/sections/${selectedSection?.title}.svg`}
            alt={selectedSection?.title}
          />
        </div>
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          {loading && <p className="text-center text-sm text-gray-500">درحال بارگذاری اطلاعات...</p>}
          {alerts && <p className="text-green-600 text-sm mb-3">{alerts}</p>}
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mb-3 gap-4">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="title" className="block text-xs font-medium text-gray-400">
                عنوان دسته/بخش
              </label>
              <input
                readOnly
                type="text"
                name="title"
                className="px-3 cursor-not-allowed bg-gray-200 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="title"
                {...register("title")}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="template" className="block text-xs font-medium text-gray-400">
                قالب
              </label>
              <input
                readOnly
                type="text"
                name="template"
                className="px-3 bg-gray-200 cursor-not-allowed py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="template"
                {...register("template")}
              />
            </div>
            <div className="lg:col-start-1 lg:col-end-3">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="description" className="block text-xs font-medium text-gray-400">
                  دربارۀ دسته/بخش
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="10"
                  className="px-3 py-2 text-sm text-justify rounded-md outline-0 border border-gray-300 focus:border-gray-400"
                  {...register("description")}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 text-left">
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
            >
              {loading ? "در حال ارسال..." : "به‌روزرسانی"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSection;
