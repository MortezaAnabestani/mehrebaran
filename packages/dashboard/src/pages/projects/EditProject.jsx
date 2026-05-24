import { Link } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchProjectById, updateProject } from "../../features/projectsSlice";
import SeoPart from "../../components/createContent/SeoPart";
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
        selectedProject.featuredImage?.desktop ? `${selectedProject.featuredImage.desktop}` : ""
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

  // --- UI Components ---
  const Label = ({ children, htmlFor, required }) => (
    <label htmlFor={htmlFor} className="block text-[11px] font-medium text-slate-500 mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const Input = ({ register, name, type = "text", placeholder, error, ...props }) => (
    <div className="w-full">
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        className={`w-full h-9 px-3 text-[12px] bg-white border rounded-md outline-none transition-all duration-200
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-slate-300 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
          } placeholder:text-slate-400 text-slate-800`}
        {...register(name)}
        {...props}
      />
      {error && <p className="text-red-500 text-[10px] mt-1">{error.message}</p>}
    </div>
  );

  const Select = ({ register, name, options, error }) => (
    <div className="w-full">
      <select
        className={`w-full h-9 px-2 text-[12px] bg-white border rounded-md outline-none transition-all duration-200
          ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-slate-300 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
          } text-slate-800`}
        {...register(name)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-[10px] mt-1">{error.message}</p>}
    </div>
  );

  const SectionHeader = ({ title }) => (
    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center">
      <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
    </div>
  );

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#007acc]"></div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
        پروژه یافت نشد
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">ویرایش پروژه</h2>
          <p className="text-[11px] text-slate-500 mt-1">شناسه: {id}</p>
        </div>
        <Link
          to="/dashboard/projects"
          className="px-4 py-2 bg-white border border-slate-300 text-slate-600 text-[12px] font-medium rounded-md hover:bg-slate-50 transition-colors"
        >
          بازگشت به لیست
        </Link>
      </div>

      {/* Alerts */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md mb-4 text-xs flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full ml-2"></span>
          پروژه با موفقیت ویرایش شد. در حال انتقال...
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-xs flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Basic Info Panel */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <SectionHeader title="اطلاعات اصلی" />
            <div className="p-5 grid grid-cols-1 gap-5">
              <div>
                <Label htmlFor="title" required>
                  عنوان پروژه
                </Label>
                <Input
                  register={register}
                  name="title"
                  error={errors.title}
                  placeholder="عنوان کامل پروژه را وارد کنید"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">زیرعنوان</Label>
                <Input register={register} name="subtitle" placeholder="توضیح کوتاه زیر عنوان" />
              </div>

              <div>
                <Label htmlFor="description" required>
                  توضیحات کامل
                </Label>
                <div className="border border-slate-300 rounded-md overflow-hidden min-h-[300px]">
                  <Suspense
                    fallback={<div className="p-4 text-xs text-slate-400">در حال بارگذاری ادیتور...</div>}
                  >
                    <TextEditor value={editorContent} onChange={setEditorContent} />
                  </Suspense>
                </div>
                {errors.description && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">خلاصه (Excerpt)</Label>
                <textarea
                  rows="3"
                  className="w-full p-3 text-[12px] bg-white border border-slate-300 rounded-md outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] text-slate-800 placeholder:text-slate-400"
                  {...register("excerpt")}
                />
              </div>
            </div>
          </div>

          {/* Financial & Volunteer Stats Panel */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <SectionHeader title="آمار و اهداف" />
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Financials */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-2">
                  اهداف مالی
                </h4>
                <div>
                  <Label htmlFor="targetAmount" required>
                    مبلغ هدف (تومان)
                  </Label>
                  <Input type="number" register={register} name="targetAmount" error={errors.targetAmount} />
                </div>
                <div>
                  <Label htmlFor="amountRaised">مبلغ جمع‌آوری شده</Label>
                  <Input type="number" register={register} name="amountRaised" />
                </div>
              </div>

              {/* Volunteers */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-2">
                  اهداف داوطلبانه
                </h4>
                <div>
                  <Label htmlFor="targetVolunteer" required>
                    تعداد داوطلب هدف
                  </Label>
                  <Input
                    type="number"
                    register={register}
                    name="targetVolunteer"
                    error={errors.targetVolunteer}
                  />
                </div>
                <div>
                  <Label htmlFor="collectedVolunteer">داوطلبان جذب شده</Label>
                  <Input type="number" register={register} name="collectedVolunteer" />
                </div>
              </div>
            </div>
          </div>

          {/* SEO Panel */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <SectionHeader title="تنظیمات سئو" />
            <div className="p-5">
              <SeoPart register={register} errors={errors} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Settings */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Publish Action Panel */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
            <SectionHeader title="انتشار" />
            <div className="p-4 space-y-4">
              <div>
                <Label htmlFor="status" required>
                  وضعیت
                </Label>
                <Select
                  register={register}
                  name="status"
                  options={[
                    { value: "draft", label: "پیش‌نویس" },
                    { value: "active", label: "فعال" },
                    { value: "completed", label: "تکمیل شده" },
                  ]}
                />
              </div>

              <div>
                <Label required>تاریخ پایان</Label>
                <div className="border border-slate-300 rounded-md p-1 bg-slate-50 flex justify-center">
                  <Calendar
                    className="red"
                    calendar={persian}
                    locale={persian_fa}
                    value={selectedDate}
                    onChange={setSelectedDate}
                    calendarPosition="bottom-right"
                    style={{ width: "100%", fontSize: "12px", boxShadow: "none" }}
                  />
                </div>
                {selectedDate && (
                  <p className="text-[10px] text-slate-500 mt-2 text-center">
                    {selectedDate.format("YYYY/MM/DD")}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 text-[12px] font-medium rounded-md text-white transition-all
                    ${
                      isSubmitting
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-[#007acc] hover:bg-[#0062a3] shadow-sm hover:shadow"
                    }`}
                >
                  {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </div>
          </div>

          {/* Category Panel */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <SectionHeader title="دسته‌بندی" />
            <div className="p-4">
              <Select
                register={register}
                name="category"
                error={errors.category}
                options={[
                  { value: "", label: "انتخاب کنید..." },
                  { value: "health", label: "بهداشت و سلامت" },
                  { value: "education", label: "آموزش" },
                  { value: "housing", label: "مسکن" },
                  { value: "food", label: "غذا" },
                  { value: "clothing", label: "پوشاک" },
                  { value: "other", label: "سایر" },
                ]}
              />
            </div>
          </div>

          {/* Featured Image Panel */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <SectionHeader title="تصویر شاخص" />
            <div className="p-4">
              <div className="border-2 border-dashed border-slate-300 rounded-md p-4 text-center hover:bg-slate-50 transition-colors relative group">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleCoverImageChange}
                />

                {!previewImage ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <svg
                      className="w-8 h-8 text-slate-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-[11px] text-slate-500 font-medium">برای آپلود کلیک کنید</span>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={
                        previewImage.startsWith("data:")
                          ? previewImage
                          : import.meta.env.VITE_SERVER_PUBLIC_UPLOADS + previewImage
                      }
                      alt="Preview"
                      className="w-full h-auto rounded-md object-cover max-h-[200px]"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                      <span className="text-white text-xs">تغییر تصویر</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
