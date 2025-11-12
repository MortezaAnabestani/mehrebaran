import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createVideo } from "../../features/videosSlice";
import { fetchSections } from "../../features/sectionsSlice";
import { fetchAuthors } from "../../features/authorsSlice";
import { fetchTags } from "../../features/tagsSlice";

const schema = yup.object().shape({
  title: yup.string().required("عنوان ویدئو اجباری است"),
  subtitle: yup.string(),
  description: yup.string().required("توضیحات ویدئو اجباری است"),
  videoUrl: yup.string().url("آدرس ویدئو باید معتبر باشد").required("آدرس ویدئو اجباری است"),
  metaTitle: yup.string().required("عنوان سئو اجباری است"),
  metaDescription: yup.string(),
  status: yup.string().oneOf(["draft", "published"]).default("draft"),
  category: yup.string(),
  cameraman: yup.string(),
  tags: yup.array(),
  coverImage: yup.mixed().test("fileSize", "حجم تصویر نباید بیشتر از 20MB باشد", (file) => {
    if (!file || file.length === 0) return true;
    return file.length > 0 ? file[0].size <= 20 * 1024 * 1024 : true;
  }).required("تصویر کاور اجباری است"),
});

const CreateVideo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const { sections } = useSelector((state) => state.sections);
  const { authors } = useSelector((state) => state.authors);
  const { tags } = useSelector((state) => state.tags);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "draft",
      title: "",
      subtitle: "",
      description: "",
      videoUrl: "",
      metaTitle: "",
      metaDescription: "",
      category: "",
      cameraman: "",
      tags: [],
    },
  });

  useEffect(() => {
    dispatch(fetchSections());
    dispatch(fetchAuthors({ limit: 1000 }));
    dispatch(fetchTags());
  }, [dispatch]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagSelection = (e) => {
    const tagId = e.target.value;
    if (tagId && !selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.subtitle) formData.append("subtitle", data.subtitle);
      formData.append("description", data.description);
      formData.append("videoUrl", data.videoUrl);
      formData.append("seo[metaTitle]", data.metaTitle);
      if (data.metaDescription) formData.append("seo[metaDescription]", data.metaDescription);
      formData.append("status", data.status);
      if (data.category) formData.append("category", data.category);
      if (data.cameraman) formData.append("cameraman", data.cameraman);

      selectedTags.forEach((tagId) => {
        formData.append("tags[]", tagId);
      });

      if (data.coverImage?.[0]) {
        formData.append("coverImage", data.coverImage[0]);
      }

      await dispatch(createVideo(formData)).unwrap();
      setSubmitSuccess(true);
      setSubmitError(null);

      setTimeout(() => {
        navigate("/dashboard/videos");
      }, 1500);
    } catch (error) {
      setSubmitError(error || "خطایی در ایجاد ویدئو رخ داد");
      setSubmitSuccess(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">ایجاد ویدئوی جدید</h2>
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
          <span className="block sm:inline">ویدئو با موفقیت ایجاد شد. در حال انتقال به صفحه ویدئوها...</span>
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
            <p className="text-xs text-gray-500 mt-1">می‌توانید لینک آپارات، یوتیوب یا فایل مستقیم را وارد کنید</p>
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

          {/* عنوان سئو */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عنوان سئو *</label>
            <input
              type="text"
              {...register("metaTitle")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.metaTitle && <p className="text-red-500 text-xs mt-1">{errors.metaTitle.message}</p>}
          </div>

          {/* توضیحات سئو */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات سئو</label>
            <input
              type="text"
              {...register("metaDescription")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* دسته‌بندی */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
            <select
              {...register("category")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">انتخاب کنید...</option>
              {sections?.sections?.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>

          {/* فیلمبردار */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">فیلمبردار</label>
            <select
              {...register("cameraman")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">انتخاب کنید...</option>
              {authors?.authors?.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          {/* برچسب‌ها */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">برچسب‌ها</label>
            <select
              onChange={handleTagSelection}
              value=""
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">افزودن برچسب...</option>
              {tags?.tags?.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTags.map((tagId) => {
                const tag = tags?.tags?.find((t) => t._id === tagId);
                return (
                  <span
                    key={tagId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag?.name}
                    <button
                      type="button"
                      onClick={() => removeTag(tagId)}
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* تصویر کاور */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">تصویر کاور *</label>
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
            {previewImage && (
              <div className="mt-3">
                <img src={previewImage} alt="پیش‌نمایش" className="max-w-xs rounded-md shadow" />
              </div>
            )}
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
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "در حال ثبت..." : "ثبت ویدئو"}
          </button>
          <Link
            to="/dashboard/videos"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            انصراف
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateVideo;
