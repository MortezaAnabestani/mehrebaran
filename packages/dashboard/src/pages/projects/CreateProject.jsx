import { Link } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createProject } from "../../features/projectsSlice";
import Loading from "../../components/Loading";
import SeoPart from "../../components/createContent/SeoPart";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import "react-multi-date-picker/styles/colors/red.css";

// Lazy load editor
const TextEditor = lazy(() => import("../../components/textEditor/TextEditor"));

// استایل‌های مشترک برای رعایت یکپارچگی طراحی
const inputClass =
  "w-full bg-slate-50 border border-slate-300 text-[13px] rounded-md px-3 h-9 focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] transition-all outline-none placeholder:text-slate-400 text-slate-700";
const labelClass = "block text-[12px] font-medium text-slate-600 mb-1.5";
const sectionClass = "bg-white border border-slate-200 rounded-md p-4 shadow-sm";
const sectionHeaderClass =
  "text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2";

// Schema validation
const projectSchema = yup.object().shape({
  title: yup.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد").max(200).required("عنوان پروژه اجباری است"),
  subtitle: yup.string().max(300),
  description: yup
    .string()
    .min(50, "توضیحات باید حداقل ۵۰ کاراکتر باشد")
    .required("توضیحات پروژه اجباری است"),
  excerpt: yup.string().max(500),
  category: yup.string().required("دسته‌بندی اجباری است"),
  status: yup.string().oneOf(["draft", "active", "completed"]).default("draft"),
  targetAmount: yup.number().min(0).required("مبلغ هدف اجباری است"),
  amountRaised: yup.number().min(0).default(0),
  targetVolunteer: yup.number().min(0).required("تعداد داوطلب هدف اجباری است"),
  collectedVolunteer: yup.number().min(0).default(0),
  coverImage: yup.mixed().required("تصویر شاخص اجباری است"),
  metaTitle: yup.string().max(60),
  metaDescription: yup.string().max(160),
});

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
      setValue("coverImage", file); // Ensure react-hook-form knows about the file
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

      await dispatch(createProject(formData)).unwrap();
      setSubmitSuccess(true);
      setTimeout(() => navigate("/dashboard/projects"), 2000);
    } catch (error) {
      setSubmitError(error || "خطایی در ایجاد پروژه رخ داده است");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">ایجاد پروژه جدید</h2>
          <p className="text-[11px] text-slate-500 mt-1">اطلاعات پروژه را با دقت وارد کنید</p>
        </div>
        <Link
          to="/dashboard/projects"
          className="px-4 py-2 bg-white border border-slate-300 rounded-md text-[12px] font-medium text-slate-600 hover:bg-slate-50 hover:text-[#007acc] transition-colors"
        >
          بازگشت به لیست
        </Link>
      </div>

      {/* Alerts */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md mb-6 text-[13px] flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full ml-2"></span>
          <strong>موفقیت:</strong>
          <span className="mr-1">پروژه با موفقیت ایجاد شد. در حال انتقال...</span>
        </div>
      )}

      {submitError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md mb-6 text-[13px] flex items-center">
          <span className="w-2 h-2 bg-rose-500 rounded-full ml-2"></span>
          <strong>خطا:</strong>
          <span className="mr-1">{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4 lg:gap-6">
        {/* LEFT COLUMN: Main Content (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Basic Info */}
          <div className={sectionClass}>
            <div className={sectionHeaderClass}>اطلاعات پایه</div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="title" className={labelClass}>
                  عنوان پروژه <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  className={inputClass}
                  placeholder="عنوان اصلی پروژه"
                  {...register("title")}
                />
                {errors.title && <p className="text-rose-500 text-[11px] mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="subtitle" className={labelClass}>
                  زیرعنوان
                </label>
                <input
                  type="text"
                  id="subtitle"
                  className={inputClass}
                  placeholder="توضیح کوتاه زیر عنوان"
                  {...register("subtitle")}
                />
                {errors.subtitle && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.subtitle.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description Editor */}
          <div className={sectionClass}>
            <div className={sectionHeaderClass}>
              توضیحات کامل <span className="text-rose-500">*</span>
            </div>
            <Suspense fallback={<Loading />}>
              <div className="prose-sm">
                <TextEditor value={editorContent} onChange={setEditorContent} />
              </div>
            </Suspense>
            {errors.description && (
              <p className="text-rose-500 text-[11px] mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Excerpt */}
          <div className={sectionClass}>
            <div className={sectionHeaderClass}>خلاصه (Excerpt)</div>
            <textarea
              rows="3"
              className={`${inputClass} h-auto py-2`}
              placeholder="متنی کوتاه برای نمایش در کارت‌ها"
              {...register("excerpt")}
            />
          </div>

          {/* SEO Section */}
          <div className={sectionClass}>
            <div className={sectionHeaderClass}>تنظیمات سئو (SEO)</div>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
              <SeoPart register={register} errors={errors} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings & Sidebar (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Publish Actions */}
          <div className={sectionClass}>
            <div className={sectionHeaderClass}>انتشار و وضعیت</div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  وضعیت <span className="text-rose-500">*</span>
                </label>
                <select className={inputClass} {...register("status")}>
                  <option value="draft">پیش‌نویس</option>
                  <option value="active">فعال</option>
                  <option value="completed">تکمیل شده</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  دسته‌بندی <span className="text-rose-500">*</span>
                </label>
                <select className={inputClass} {...register("category")}>
                  <option value="">انتخاب کنید...</option>
                  <option value="health">بهداشت و سلامت</option>
                  <option value="education">آموزش</option>
                  <option value="housing">مسکن</option>
                  <option value="food">غذا</option>
                  <option value="clothing">پوشاک</option>
                  <option value="other">سایر</option>
                </select>
                {errors.category && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.category.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-md text-[13px] font-medium text-white transition-all shadow-sm ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#007acc] hover:bg-[#0062a3] active:translate-y-[1px]"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    در حال پردازش...
                  </span>
                ) : (
                  "ذخیره و ایجاد پروژه"
                )}
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div className={sectionClass}>
            <div className={sectionHeaderClass}>زمان‌بندی</div>
            <label className={labelClass}>
              تاریخ پایان پروژه <span className="text-rose-500">*</span>
            </label>
            <div className="flex justify-center bg-slate-50 border border-slate-200 rounded-md p-2">
              <Calendar
                className="red"
                calendar={persian}
                locale={persian_fa}
                value={selectedDate}
                onChange={setSelectedDate}
                calendarPosition="bottom-right"
                style={{ width: "100%", fontSize: "12px" }}
              />
            </div>
            {selectedDate ? (
              <p className="text-[11px] text-slate-500 mt-2 text-center bg-slate-100 py-1 rounded">
                {selectedDate.format("YYYY/MM/DD")}
              </p>
            ) : (
              submitError && (
                <p className="text-rose-500 text-[11px] mt-1 text-center">انتخاب تاریخ الزامی است</p>
              )
            )}
          </div>

          {/* Image Upload */}
          <div className={sectionClass}>
            <div className={sectionHeaderClass}>
              تصویر شاخص <span className="text-rose-500">*</span>
            </div>
            <div className="relative group">
              <label
                htmlFor="coverImage"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-md cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-[#007acc] transition-all"
              >
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <div className="flex flex-col items-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-2 text-slate-400 group-hover:text-[#007acc]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="text-[11px] text-slate-500">کلیک برای آپلود تصویر</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="coverImage"
                  className="hidden"
                  onChange={handleCoverImageChange}
                />
              </label>
            </div>
            {errors.coverImage && (
              <p className="text-rose-500 text-[11px] mt-1">{errors.coverImage.message}</p>
            )}
          </div>

          {/* Targets */}
          <div className={sectionClass}>
            <div className={sectionHeaderClass}>اهداف و آمار</div>

            <div className="space-y-4">
              {/* Financial */}
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <h4 className="text-[12px] font-bold text-slate-700 mb-2">مالی (تومان)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">هدف</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="0"
                      {...register("targetAmount")}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">جمع‌شده</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="0"
                      {...register("amountRaised")}
                    />
                  </div>
                </div>
                {errors.targetAmount && (
                  <p className="text-rose-500 text-[10px] mt-1">{errors.targetAmount.message}</p>
                )}
              </div>

              {/* Volunteer */}
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <h4 className="text-[12px] font-bold text-slate-700 mb-2">داوطلبان (نفر)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">هدف</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="0"
                      {...register("targetVolunteer")}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">جذب‌شده</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="0"
                      {...register("collectedVolunteer")}
                    />
                  </div>
                </div>
                {errors.targetVolunteer && (
                  <p className="text-rose-500 text-[10px] mt-1">{errors.targetVolunteer.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
