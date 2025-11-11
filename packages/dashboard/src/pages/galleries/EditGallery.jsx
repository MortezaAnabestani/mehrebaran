import { Link } from "react-router-dom";
import { lazy } from "react";
import useGalleryForm from "../../hooks/useGalleryForm";
import SeoPart from "../../components/createContent/SeoPart";
const ArticleGallery = lazy(() => import("../../components/createContent/ArticleGallery"));
const EditGallery = () => {
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
    watch,
  } = useGalleryForm(true);

  return (
    <div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-md lg:text-xl font-medium">اضافه‌کردن گالری جدید</h2>
          <Link
            rel="preconnect"
            to="/dashboard/galleries"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 text-sm lg:text-md animate-pulse animate-thrice animate-ease-in-out">
              فهرست گالری‌ها
            </span>
          </Link>
        </div>
      </div>
      <div className="p-4">
        {submitSuccess && (
          <p className="text-sm p-3 font-semibold text-center border text-green-600 bg-green-50 mb-3 animate-fade-out rounded-sm text-gray-800">
            گالری با موفقیت ثبت شد
          </p>
        )}
        {submitError && (
          <p className="text-sm p-3 font-semibold text-center border text-red-600 bg-red-50 mb-3 animate-fade-out rounded-sm text-gray-800">
            خطا در ثبت گالری : {submitError}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mb-3 gap-4">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="title" className="block text-xs font-medium text-gray-400">
                عنوان گالری
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
            <div className="lg:col-start-1 lg:col-end-3">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="details" className="block text-xs font-medium text-gray-400">
                  توضیحات گالری
                </label>
                <textarea
                  required
                  name="details"
                  id="details"
                  rows="3"
                  className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400"
                  {...register("details")}
                />
                <p className="text-xs text-red-500">{errors.details?.message}</p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="description" className="block text-xs font-medium text-gray-400">
                  توضیحات گالری
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

export default EditGallery;
