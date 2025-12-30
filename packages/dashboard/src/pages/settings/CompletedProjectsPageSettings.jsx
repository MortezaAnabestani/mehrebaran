import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey } from "../../features/settingsSlice";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Save,
  Info,
  Image as ImageIcon,
  Type,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const CompletedProjectsPageSettings = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    backgroundImage: "",
    title: "",
    description: "",
  });

  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await dispatch(getSettingByKey("completedProjectsPage")).unwrap();
        if (result) {
          setFormData({
            backgroundImage: result.backgroundImage || "",
            title: result.title || "",
            description: result.description || "",
          });
        }
      } catch (err) {
        console.error("خطا در بارگذاری تنظیمات:", err);
      }
    };

    fetchSettings();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveMessage(null);

    try {
      await dispatch(
        updateSettingByKey({
          key: "completedProjectsPage",
          value: formData,
        })
      ).unwrap();

      setSaveMessage({ type: "success", text: "تنظیمات ذخیره شد" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage({ type: "error", text: err || "خطا در ذخیره" });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 border border-slate-100 rounded-md">
            <FileText className="w-5 h-5 text-[#007acc]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">تنظیمات صفحه پروژه‌های تکمیل شده</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">مدیریت محتوای نمایشی صفحه /projects/completed</p>
          </div>
        </div>
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 text-[12px] font-medium rounded-md transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>بازگشت</span>
        </Link>
      </div>

      {/* Messages */}
      {saveMessage && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-md border text-[12px] font-medium ${
            saveMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {saveMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {saveMessage.text}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-[12px] font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column: Form */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          {/* Info Box */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-md p-3 flex gap-3">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-700 leading-5">
              این تنظیمات هدر اصلی صفحه پروژه‌های تکمیل شده را کنترل می‌کند. پروژه‌هایی که تیک "برجسته" دارند
              در ادامه این صفحه لیست می‌شوند.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-md p-5 space-y-5">
            {/* Background Image Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  تصویر پس‌زمینه
                  <span className="text-rose-500">*</span>
                </label>
                <Link to="/dashboard/upload-center" className="text-[10px] text-[#007acc] hover:underline">
                  آپلود سنتر
                </Link>
              </div>
              <input
                type="url"
                name="backgroundImage"
                value={formData.backgroundImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full h-9 px-3 text-[12px] border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]/20 transition-all placeholder:text-slate-400 dir-ltr text-left"
                required
              />
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" />
                عنوان صفحه
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="مثال: باران تویی..."
                className="w-full h-9 px-3 text-[12px] border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]/20 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                توضیحات تکمیلی
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="توضیحات فعالیت‌ها..."
                className="w-full p-3 text-[12px] border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]/20 transition-all placeholder:text-slate-400 resize-none leading-relaxed"
                required
              />
              <p className="text-[10px] text-slate-400">این متن در باکس مشکی روی تصویر نمایش داده می‌شود.</p>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-[12px] font-medium text-white transition-all ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#007acc] hover:bg-[#006bb3] shadow-sm hover:shadow"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>در حال پردازش...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>ذخیره تغییرات</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Preview */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden sticky top-4">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-[12px] font-bold text-slate-700">پیش‌نمایش زنده</h3>
            </div>

            <div className="p-4 bg-slate-100 min-h-[300px] flex items-center justify-center">
              {formData.backgroundImage ? (
                <div
                  className="w-full aspect-[4/3] rounded-lg overflow-hidden relative shadow-sm border border-slate-200 bg-white"
                  style={{
                    backgroundImage: `url('${formData.backgroundImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-6 right-6 left-6">
                    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-5 max-w-[90%] border border-white/10">
                      {formData.title && (
                        <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm w-fit mb-2">
                          {formData.title}
                        </div>
                      )}
                      <p className="text-white text-[10px] leading-5 line-clamp-4">
                        {formData.description || "متن توضیحات اینجا نمایش داده می‌شود..."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageIcon className="w-8 h-8 opacity-20" />
                  <span className="text-[11px]">تصویری انتخاب نشده است</span>
                </div>
              )}
            </div>

            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
              <p className="text-[10px] text-slate-400 text-center">
                نمایش حدودی است و ممکن است در صفحه اصلی متفاوت باشد.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedProjectsPageSettings;
