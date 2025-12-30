import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SeoPart from "../createContent/SeoPart";
import TagPart from "../createContent/TagPart";

const VideoForm = ({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  isEdit = false,
  tags,
  selectedTags,
  setSelectedTags,
  handleTagSelection,
  removeTag,
  previewImage,
  videoUrl,
  submitSuccess,
  submitError,
  handleCoverImageChange,
}) => {
  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">
            {isEdit ? "ویرایش ویدئو" : "ایجاد ویدئوی جدید"}
          </h2>
          <Link
            rel="preconnect"
            to="/dashboard/videos"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
              فهرست ویدئوها
            </span>
          </Link>
        </div>
      </div>

      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold ml-1">موفقیت!</strong>
          <span className="block sm:inline">
            ویدئو با موفقیت {isEdit ? "به‌روزرسانی" : "ایجاد"} شد. در حال انتقال به صفحه ویدئوها...
          </span>
        </div>
      )}

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold ml-1">خطا!</strong>
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* عنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عنوان ویدئو *</label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* زیرعنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">زیرعنوان</label>
            <input
              type="text"
              {...register("subtitle")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* آدرس ویدئو */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">آدرس ویدئو (URL) *</label>
            <input
              type="url"
              {...register("videoUrl")}
              placeholder="https://example.com/video.mp4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.videoUrl && <p className="text-red-500 text-xs mt-1">{errors.videoUrl.message}</p>}
            <p className="text-xs text-gray-500 mt-1">
              می‌توانید لینک آپارات، یوتیوب یا فایل مستقیم را وارد کنید
            </p>
          </div>

          {/* توضیحات */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات *</label>
            <textarea
              {...register("description")}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* فیلمبردار */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">فیلمبردار</label>
            <input
              type="text"
              {...register("cameraman")}
              placeholder="نام فیلمبردار را وارد کنید"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* وضعیت */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت *</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشرشده</option>
            </select>
          </div>

          {/* تصویر کاور */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصویر کاور {!isEdit && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("coverImage")}
              onChange={(e) => {
                register("coverImage").onChange(e);
                handleCoverImageChange(e);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>}
            {isEdit && <p className="text-xs text-gray-500 mt-1">اگر تصویر جدیدی انتخاب نکنید، تصویر فعلی حفظ می‌شود</p>}
          </div>
        </div>

        {/* برچسب‌ها */}
        <div className="md:col-span-2">
          <TagPart
            tags={Array.isArray(tags) ? tags : (tags?.data || tags?.tags || [])}
            handleTagSelection={handleTagSelection}
            removeTag={removeTag}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>

        {/* پیش‌نمایش ویدئو و کاور */}
        {(videoUrl || previewImage) && (
          <div className="mt-8 border-t-4 border-blue-100 pt-6">
            <h3 className="text-sm text-blue-400 mb-4">پیش‌نمایش</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previewImage && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">تصویر کاور</label>
                  <img src={previewImage} alt="پیش‌نمایش کاور" className="w-full rounded-md shadow-md" />
                </div>
              )}
              {videoUrl && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">ویدئو</label>
                  <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                    {(() => {
                      // تشخیص نوع ویدئو
                      if (videoUrl.includes('aparat.com')) {
                        // آپارات
                        const aparatMatch = videoUrl.match(/aparat\.com\/v\/([^\/\?]+)/);
                        const videoId = aparatMatch ? aparatMatch[1] : '';
                        return (
                          <iframe
                            src={`https://www.aparat.com/video/video/embed/videohash/${videoId}/vt/frame`}
                            className="w-full h-full"
                            allowFullScreen
                            allow="autoplay"
                          />
                        );
                      } else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                        // یوتیوب
                        let videoId = '';
                        if (videoUrl.includes('youtu.be/')) {
                          videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
                        } else if (videoUrl.includes('youtube.com/watch')) {
                          const urlParams = new URLSearchParams(videoUrl.split('?')[1]);
                          videoId = urlParams.get('v');
                        } else if (videoUrl.includes('youtube.com/embed/')) {
                          videoId = videoUrl.split('embed/')[1]?.split('?')[0];
                        }
                        return (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        );
                      } else {
                        // فایل مستقیم
                        return (
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-full"
                            poster={previewImage}
                          >
                            مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.
                          </video>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* بخش سئو */}
        <div className="mt-8">
          <SeoPart register={register} />
          {errors.metaTitle && <p className="text-red-500 text-xs mt-1">{errors.metaTitle.message}</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? `در حال ${isEdit ? "به‌روزرسانی" : "ثبت"}...` : isEdit ? "به‌روزرسانی ویدئو" : "ثبت ویدئو"}
          </button>
          <Link to="/dashboard/videos" className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
            انصراف
          </Link>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;
