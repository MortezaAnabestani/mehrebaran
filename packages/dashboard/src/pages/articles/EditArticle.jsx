import { useEffect } from "react";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import TemplateType from "../../components/createContent/TemplateType";
import TitleAndSubtitle from "../../components/createContent/TitleAndSubtitle";
import TagPart from "../../components/createContent/TagPart";
import styles from "../../styles/admin.module.css";
import useArticleForm from "../../hooks/useArticleForm";
import Loading from "../../components/Loading";
import Quotation from "../../components/createContent/Quotation";
import SeoPart from "../../components/createContent/SeoPart";

const TextEditor = lazy(() => import("../../components/textEditor/TextEditor"));
const RelatedArticles = lazy(() => import("../../components/createContent/RelatedArticles"));
const ArticleGallery = lazy(() => import("../../components/createContent/ArticleGallery"));

const EditArticle = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    previewImage,
    handleCoverImageChange,
    handleTagSelection,
    removeTag,
    selectedTags,
    selectedImages,
    handleImageSelection,
    removeImage,

    selectedRelatedArticles,
    handleRelatedArticleSelection,
    removeRelatedArticle,
    setSelectedTags,
    tags,
    loading,
    error,
    submitSuccess,
    submitError,
    isSubmitting,
    articles,
    setValue,
    editorContent,
    setEditorContent,
    sections,
    authors,
    watch,
    templates,
    getValues,
    control,
  } = useArticleForm(true);

  useEffect(() => {
    if (editorContent) {
      setValue("content", editorContent);
    }
  }, [editorContent, setValue]);

  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">ویرایش محتوا</h2>
          <Link
            rel="preconnect"
            to="/dashboard/articles"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
              فهرست محتواها
            </span>
          </Link>
        </div>
      </div>

      {loading && (
        <div
          className="bg-blue-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500 mr-2"></div>
            <span>در حال بارگذاری اطلاعات مقاله...</span>
          </div>
        </div>
      )}

      {submitSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold ml-1">موفقیت!</strong>
          <span className="block sm:inline">مقاله با موفقیت ویرایش شد. در حال انتقال به صفحه مقالات...</span>
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
        <TemplateType
          register={register}
          templates={templates}
          sections={sections}
          watch={watch}
          authors={authors}
          errors={errors}
          getValues={getValues}
          control={control}
          setValue={setValue}
        />
        <TitleAndSubtitle register={register} watch={watch} errors={errors} />
        <Quotation register={register} watch={watch} errors={errors} />
        <Suspense fallback={<Loading />}>
          <div className={`${styles.createContent_title} mb-10`}>
            <label className="text-[12px] mb-0" htmlFor="bodytext">
              بدنۀ متن
            </label>
            <TextEditor value={editorContent} onChange={setEditorContent} />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
          </div>
          <TagPart
            register={register}
            tags={tags}
            handleTagSelection={handleTagSelection}
            removeTag={removeTag}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            errors={errors}
          />
          <div className={`${styles.createContent_title} mb-10`}>
            <RelatedArticles
              selectedRelatedArticles={selectedRelatedArticles}
              handleRelatedArticleSelection={handleRelatedArticleSelection}
              removeRelatedArticle={removeRelatedArticle}
              articles={articles}
              errors={errors}
            />
          </div>
          <div className="w-full lg:w-[300px] mb-5">
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
                type="file"
                accept="image/*"
                name="coverImage"
                className="hidden"
                id="coverImage"
                {...register("coverImage")}
                onChange={handleCoverImageChange}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="پیش‌نمایش"
                  className="h-70 max-h-70 w-80 object-cover rounded-md mt-3 border border-red-300"
                />
              )}
              {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>}
            </div>
          </div>
          <ArticleGallery
            register={register}
            watch={watch}
            handleImageSelection={handleImageSelection}
            selectedImages={selectedImages}
            removeImage={removeImage}
            errors={errors}
          />
        </Suspense>
        <SeoPart register={register} errors={errors} />
        <div className="mt-6 text-left">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-3 w-full lg:w-[120px] py-[6px] ${
              isSubmitting ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-700 cursor-pointer"
            } rounded-md text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                <span>در حال ارسال...</span>
              </div>
            ) : (
              "ویرایش محتوا"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
