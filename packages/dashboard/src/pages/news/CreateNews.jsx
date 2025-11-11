import { Link } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import TitleAndSubtitle from "../../components/createContent/TitleAndSubtitle";
import TagPart from "../../components/createContent/TagPart";
import styles from "../../styles/admin.module.css";
import useNewsForm from "../../hooks/useNewsForm";
import Loading from "../../components/Loading";
import SeoPart from "../../components/createContent/SeoPart";

const TextEditor = lazy(() => import("../../components/textEditor/TextEditor"));

const CreateNews = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    previewImage,
    handleFeaturedImageChange,
    handleTagSelection,
    removeTag,
    selectedTags,
    selectedImages,
    handleImageSelection,
    removeImage,
    selectedRelatedNews,
    handleRelatedNewsSelection,
    removeRelatedNews,
    setSelectedTags,
    tags,
    loading,
    error,
    submitSuccess,
    submitError,
    isSubmitting,
    allNews,
    setValue,
    editorContent,
    setEditorContent,
    authors,
    categories,
    watch,
  } = useNewsForm();

  useEffect(() => {
    if (editorContent) {
      setValue("content", editorContent);
    }
  }, [editorContent, setValue]);

  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">ایجاد خبر جدید</h2>
          <Link
            rel="preconnect"
            to="/dashboard/news"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
              فهرست اخبار
            </span>
          </Link>
        </div>
      </div>

      {submitSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold ml-1">موفقیت!</strong>
          <span className="block sm:inline">خبر با موفقیت ایجاد شد. در حال انتقال به صفحه اخبار...</span>
        </div>
      )}

      {submitError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold ml-1">خطا!</strong>
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold ml-1">خطا!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Category, Author, and Status */}
        <div className={`${styles.createContent_title} mb-10`}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="text-[12px] mb-2 block" htmlFor="category">
                دسته‌بندی <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                {...register("category")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div className="flex-1">
              <label className="text-[12px] mb-2 block" htmlFor="author">
                نویسنده <span className="text-red-500">*</span>
              </label>
              <select
                id="author"
                {...register("author")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="">انتخاب نویسنده</option>
                {authors?.map((author) => (
                  <option key={author._id} value={author._id}>
                    {author.name}
                  </option>
                ))}
              </select>
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
            </div>

            <div className="flex-1">
              <label className="text-[12px] mb-2 block" htmlFor="status">
                وضعیت
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="draft">پیش‌نویس</option>
                <option value="published">منتشر شده</option>
                <option value="archived">بایگانی</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>
          </div>
        </div>

        {/* Title and Subtitle */}
        <TitleAndSubtitle register={register} watch={watch} errors={errors} />

        {/* Excerpt */}
        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-2 block" htmlFor="excerpt">
            خلاصه خبر <span className="text-red-500">*</span>
          </label>
          <textarea
            id="excerpt"
            {...register("excerpt")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="خلاصه‌ای از محتوای خبر را بنویسید..."
          />
          {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt.message}</p>}
        </div>

        {/* Content Editor */}
        <Suspense fallback={<Loading />}>
          <div className={`${styles.createContent_title} mb-10`}>
            <label className="text-[12px] mb-2 block" htmlFor="bodytext">
              بدنۀ متن <span className="text-red-500">*</span>
            </label>
            <TextEditor value={editorContent} onChange={setEditorContent} />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
          </div>

          {/* Tags */}
          <TagPart
            register={register}
            tags={tags}
            handleTagSelection={handleTagSelection}
            removeTag={removeTag}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            errors={errors}
          />

          {/* Related News */}
          <div className={`${styles.createContent_title} mb-10`}>
            <label className="text-[12px] mb-2 block">اخبار مرتبط</label>
            <select
              onChange={(e) => handleRelatedNewsSelection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value=""
            >
              <option value="">انتخاب خبر مرتبط</option>
              {allNews
                ?.filter((news) => !selectedRelatedNews.includes(news._id))
                .map((news) => (
                  <option key={news._id} value={news._id}>
                    {news.title}
                  </option>
                ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedRelatedNews.map((newsId) => {
                const news = allNews.find((n) => n._id === newsId);
                return (
                  <span
                    key={newsId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {news?.title}
                    <button
                      type="button"
                      onClick={() => removeRelatedNews(newsId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Featured Image */}
          <div className="w-full lg:w-[300px] mb-5">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              تصویر شاخص <span className="text-red-500">*</span>
            </label>
            <div className="bg-slate-100 rounded-md p-2 border lg:max-h-100 lg:max-w-100 border-gray-400 border-dotted">
              <label
                htmlFor="featuredImage"
                className="flex flex-row items-center justify-between text-xs font-medium cursor-pointer"
              >
                <span className="block">برای انتخاب تصویر کلیک کنید</span>
                <img
                  className="w-8 h-8 animate-pulse animate-ease-in-out"
                  src="/assets/images/dashboard/icons/portrait.svg"
                  alt="image"
                />
              </label>
              <input
                type="file"
                accept="image/*"
                name="featuredImage"
                className="hidden"
                id="featuredImage"
                {...register("featuredImage")}
                onChange={handleFeaturedImageChange}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="پیش‌نمایش"
                  className="h-70 max-h-70 w-80 object-cover rounded-md mt-3 border border-blue-300"
                />
              )}
              {errors.featuredImage && (
                <p className="text-red-500 text-xs mt-1">{errors.featuredImage.message}</p>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="w-full mb-10">
            <label className="block text-xs font-medium text-gray-400 mb-2">گالری تصاویر (اختیاری)</label>
            <div className="bg-slate-100 rounded-md p-2 border border-gray-400 border-dotted">
              <label
                htmlFor="gallery"
                className="flex flex-row items-center justify-between text-xs font-medium cursor-pointer"
              >
                <span className="block">برای انتخاب تصاویر کلیک کنید</span>
                <img
                  className="w-8 h-8 animate-pulse animate-ease-in-out"
                  src="/assets/images/dashboard/icons/portrait.svg"
                  alt="gallery"
                />
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                name="gallery"
                className="hidden"
                id="gallery"
                onChange={handleImageSelection}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={`گالری ${index + 1}`}
                      className="w-full h-40 object-cover rounded-md border border-blue-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {errors.gallery && <p className="text-red-500 text-xs mt-1">{errors.gallery.message}</p>}
            </div>
          </div>
        </Suspense>

        {/* SEO Part */}
        <SeoPart register={register} errors={errors} />

        {/* Submit Button */}
        <div className="mt-6 text-left">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-3 w-full lg:w-[120px] cursor-pointer py-[6px] ${
              isSubmitting ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-700"
            } rounded-md text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                <span>در حال ارسال...</span>
              </div>
            ) : (
              "ایجاد خبر"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNews;
