import { lazy } from "react";
import { Link } from "react-router-dom";
import useGalleryForm from "../../hooks/useGalleryForm";
import SeoPart from "../../components/createContent/SeoPart";

// بارگذاری تنبل کامپوننت گالری
const ArticleGallery = lazy(() => import("../../components/createContent/ArticleGallery"));

const CreateGallery = () => {
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
  } = useGalleryForm();

  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      {/* Header Section: Functional & Compact */}
      <div className="bg-white border border-slate-200 rounded-t-md border-b-0">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 rounded-t-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#007acc] rounded-full animate-pulse"></div>
            <h2 className="text-sm font-bold text-slate-700 font-mono tracking-tight">NEW_GALLERY_ENTRY</h2>
          </div>
          <Link
            rel="preconnect"
            to="/dashboard/galleries"
            className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:border-[#007acc] text-slate-600 hover:text-[#007acc] rounded-md transition-all duration-200"
          >
            <span className="text-[11px] font-medium">بازگشت به لیست</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-slate-200 rounded-b-md p-4">
        {/* Status Messages: Technical Style */}
        {submitSuccess && (
          <div className="mb-4 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-mono rounded-md flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            STATUS: SUCCESS - GALLERY_CREATED
          </div>
        )}
        {submitError && (
          <div className="mb-4 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-[12px] font-mono rounded-md flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            ERROR: {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="grid grid-cols-12 gap-4">
            {/* Title Input */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
              >
                عنوان گالری <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                id="title"
                placeholder="مثال: همایش سالانه توسعه‌دهندگان..."
                className="w-full h-9 px-3 text-[13px] text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]/20 transition-all placeholder:text-slate-400"
                {...register("title")}
              />
              {errors.title && (
                <span className="text-[10px] text-rose-500 font-mono">{errors.title.message}</span>
              )}
            </div>

            {/* Details Input */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-1.5">
              <label
                htmlFor="details"
                className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
              >
                جزئیات مختصر <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                id="details"
                rows="1"
                className="w-full min-h-[36px] px-3 py-2 text-[13px] text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]/20 transition-all resize-none"
                {...register("details")}
              />
              {errors.details && (
                <span className="text-[10px] text-rose-500 font-mono">{errors.details.message}</span>
              )}
            </div>

            {/* Description Input */}
            <div className="col-span-12 flex flex-col gap-1.5">
              <label
                htmlFor="description"
                className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
              >
                توضیحات کامل
              </label>
              <textarea
                required
                id="description"
                rows="6"
                className="w-full px-3 py-2 text-[13px] text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]/20 transition-all"
                {...register("description")}
              />
              {errors.description && (
                <span className="text-[10px] text-rose-500 font-mono">{errors.description.message}</span>
              )}
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-2"></div>

          {/* Section 2: Media & SEO */}
          <div className="grid grid-cols-12 gap-6">
            {/* Gallery Component Wrapper */}
            <div className="col-span-12 lg:col-span-8 border border-slate-200 rounded-md p-3 bg-slate-50/30">
              <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase">مدیریت تصاویر</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-sm font-mono">
                  MEDIA_ASSETS
                </span>
              </div>
              <ArticleGallery
                register={register}
                watch={watch}
                handleImageSelection={handleImageSelection}
                selectedImages={selectedImages}
                removeImage={removeImage}
                errors={errors}
              />
            </div>

            {/* SEO Component Wrapper */}
            <div className="col-span-12 lg:col-span-4 border border-slate-200 rounded-md p-3 bg-slate-50/30 h-fit">
              <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase">تنظیمات سئو</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-sm font-mono">
                  SEO_CONFIG
                </span>
              </div>
              <SeoPart register={register} />
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-[12px] font-medium text-white transition-all shadow-sm
                ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#007acc] hover:bg-[#0062a3] active:scale-[0.98]"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="font-mono">PROCESSING...</span>
                </>
              ) : (
                <>
                  <span>ثبت نهایی گالری</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGallery;
