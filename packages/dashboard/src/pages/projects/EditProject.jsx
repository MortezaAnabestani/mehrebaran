import { Link } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchProjectById, updateProject } from "../../features/projectsSlice";
import Loading from "../../components/Loading";
import SeoPart from "../../components/createContent/SeoPart";
import styles from "../../styles/admin.module.css";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import "react-multi-date-picker/styles/colors/red.css";

const TextEditor = lazy(() => import("../../components/textEditor/TextEditor"));

// Schema validation
const projectSchema = yup.object().shape({
  title: yup.string().min(3).max(200).required("عنوان پروژه اجباری است"),
  subtitle: yup.string().max(300),
  description: yup.string().min(50).required("توضیحات پروژه اجباری است"),
  excerpt: yup.string().max(500),
  category: yup.string().required("دسته‌بندی اجباری است"),
  status: yup.string().oneOf(["draft", "active", "completed"]).default("draft"),
  targetAmount: yup.number().min(0).required("مبلغ هدف اجباری است"),
  amountRaised: yup.number().min(0).default(0),
  targetVolunteer: yup.number().min(0).required("تعداد داوطلب هدف اجباری است"),
  collectedVolunteer: yup.number().min(0).default(0),
  metaTitle: yup.string().max(60),
  metaDescription: yup.string().max(160),
});

const EditProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProject, loading: fetchLoading } = useSelector((state) => state.projects);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(projectSchema),
  });

  const [editorContent, setEditorContent] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // بارگذاری پروژه
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  // پر کردن فرم با داده‌های پروژه
  useEffect(() => {
    if (selectedProject) {
      setEditorContent(selectedProject.description || "");
      setPreviewImage(
        selectedProject.featuredImage?.desktop
          ? `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${selectedProject.featuredImage.desktop}`
          : ""
      );

      // تبدیل deadline به تاریخ شمسی
      if (selectedProject.deadline) {
        const date = new DateObject(new Date(selectedProject.deadline));
        date.convert(persian, persian_fa);
        setSelectedDate(date);
      }

      reset({
        title: selectedProject.title || "",
        subtitle: selectedProject.subtitle || "",
        description: selectedProject.description || "",
        excerpt: selectedProject.excerpt || "",
        category: selectedProject.category?._id || selectedProject.category || "",
        status: selectedProject.status || "draft",
        targetAmount: selectedProject.targetAmount || 0,
        amountRaised: selectedProject.amountRaised || 0,
        targetVolunteer: selectedProject.targetVolunteer || 0,
        collectedVolunteer: selectedProject.collectedVolunteer || 0,
        metaTitle: selectedProject.seo?.metaTitle || "",
        metaDescription: selectedProject.seo?.metaDescription || "",
      });
    }
  }, [selectedProject, reset]);

  useEffect(() => {
    if (editorContent) setValue("description", editorContent);
  }, [editorContent, setValue]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!selectedDate) {
        setSubmitError("لطفاً تاریخ پایان را انتخاب کنید");
        setIsSubmitting(false);
        return;
      }

      const gregorianDate = new DateObject(selectedDate).convert(persian, "en").toDate();
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle || "");
      formData.append("description", data.description);
      formData.append("excerpt", data.excerpt || "");
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("targetAmount", data.targetAmount);
      formData.append("amountRaised", data.amountRaised || 0);
      formData.append("targetVolunteer", data.targetVolunteer);
      formData.append("collectedVolunteer", data.collectedVolunteer || 0);
      formData.append("deadline", gregorianDate.toISOString());
      formData.append("metaTitle", data.metaTitle || "");
      formData.append("metaDescription", data.metaDescription || "");

      if (imageFile) formData.append("featuredImage", imageFile);

      await dispatch(updateProject({ id, projectData: formData })).unwrap();
      setSubmitSuccess(true);
      setTimeout(() => navigate("/dashboard/projects"), 2000);
    } catch (error) {
      setSubmitError(error || "خطایی در ویرایش پروژه رخ داده است");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="p-6 bg-white rounded-md">
        <h3 className="text-lg font-bold text-red-500">پروژه یافت نشد</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">ویرایش پروژه</h2>
          <Link
            rel="preconnect"
            to="/dashboard/projects"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-pulse">فهرست پروژه‌ها</span>
          </Link>
        </div>
      </div>

      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold ml-1">موفقیت!</strong>
          <span>پروژه با موفقیت ویرایش شد. در حال انتقال...</span>
        </div>
      )}

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold ml-1">خطا!</strong>
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-2 block" htmlFor="title">
            عنوان پروژه *
          </label>
          <input
            type="text"
            id="title"
            className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10 w-full"
            {...register("title")}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-2 block" htmlFor="subtitle">
            زیرعنوان
          </label>
          <input
            type="text"
            id="subtitle"
            className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10 w-full"
            {...register("subtitle")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className={styles.createContent_title}>
            <label className="text-[12px] mb-2 block">دسته‌بندی *</label>
            <select
              className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10 w-full"
              {...register("category")}
            >
              <option value="">انتخاب دسته‌بندی</option>
              <option value="health">بهداشت و سلامت</option>
              <option value="education">آموزش</option>
              <option value="housing">مسکن</option>
              <option value="food">غذا</option>
              <option value="clothing">پوشاک</option>
              <option value="other">سایر</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div className={styles.createContent_title}>
            <label className="text-[12px] mb-2 block">وضعیت *</label>
            <select
              className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10 w-full"
              {...register("status")}
            >
              <option value="draft">پیش‌نویس</option>
              <option value="active">فعال</option>
              <option value="completed">تکمیل شده</option>
            </select>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <div className={`${styles.createContent_title} mb-10`}>
            <label className="text-[12px] mb-2 block">توضیحات کامل پروژه *</label>
            <TextEditor value={editorContent} onChange={setEditorContent} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
        </Suspense>

        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-2 block">خلاصه (Excerpt)</label>
          <textarea
            rows="4"
            className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 w-full"
            {...register("excerpt")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-700">اهداف مالی</h3>
            <div className={styles.createContent_title}>
              <label className="text-[12px] mb-2 block">مبلغ هدف (تومان) *</label>
              <input
                type="number"
                className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10 w-full"
                {...register("targetAmount")}
              />
              {errors.targetAmount && (
                <p className="text-red-500 text-xs mt-1">{errors.targetAmount.message}</p>
              )}
            </div>
            <div className={styles.createContent_title}>
              <label className="text-[12px] mb-2 block">مبلغ جمع‌آوری شده (تومان)</label>
              <input
                type="number"
                className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10 w-full"
                {...register("amountRaised")}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-700">اهداف داوطلب</h3>
            <div className={styles.createContent_title}>
              <label className="text-[12px] mb-2 block">تعداد داوطلب هدف *</label>
              <input
                type="number"
                className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10 w-full"
                {...register("targetVolunteer")}
              />
              {errors.targetVolunteer && (
                <p className="text-red-500 text-xs mt-1">{errors.targetVolunteer.message}</p>
              )}
            </div>
            <div className={styles.createContent_title}>
              <label className="text-[12px] mb-2 block">تعداد داوطلب جمع‌آوری شده</label>
              <input
                type="number"
                className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10 w-full"
                {...register("collectedVolunteer")}
              />
            </div>
          </div>
        </div>

        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-2 block">تاریخ پایان پروژه *</label>
          <div className="border border-gray-300 rounded-md p-4 inline-block">
            <Calendar
              className="red"
              calendar={persian}
              locale={persian_fa}
              value={selectedDate}
              onChange={setSelectedDate}
              calendarPosition="bottom-right"
            />
          </div>
          {selectedDate && (
            <p className="text-xs text-gray-600 mt-2">
              تاریخ انتخاب شده: {selectedDate.format("YYYY/MM/DD")}
            </p>
          )}
        </div>

        <div className="w-full lg:w-[300px] mb-10">
          <label className="block text-xs font-medium text-gray-400 mb-2">
            تصویر شاخص {!previewImage && "*"}
          </label>
          <div className="bg-slate-100 rounded-md p-2 border border-gray-400 border-dotted">
            <label
              htmlFor="coverImage"
              className="flex flex-row items-center justify-between text-xs font-medium cursor-pointer"
            >
              <span>برای تغییر عکس کلیک کنید</span>
              <img
                className="w-8 h-8 animate-pulse"
                src="/assets/images/dashboard/icons/portrait.svg"
                alt="image"
              />
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="coverImage"
              onChange={handleCoverImageChange}
            />
            {previewImage && (
              <img
                src={import.meta.env.VITE_SERVER_PUBLIC_UPLOADS + previewImage}
                alt="پیش‌نمایش"
                className="h-70 w-80 object-cover rounded-md mt-3 border border-red-300"
              />
            )}
          </div>
        </div>

        <SeoPart register={register} errors={errors} />

        <div className="mt-6 text-left">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-3 w-full lg:w-[120px] py-[6px] ${
              isSubmitting ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-700"
            } rounded-md text-white cursor-pointer`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                <span>در حال ارسال...</span>
              </div>
            ) : (
              "ذخیره تغییرات"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
