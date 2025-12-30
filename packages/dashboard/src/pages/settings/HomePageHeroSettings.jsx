import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey, clearMessages } from "../../features/settingsSlice";
import { Save, Image, Smartphone, Monitor, Info, AlertCircle, CheckCircle } from "lucide-react";

const HomePageHeroSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, error, successMessage } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    desktopImage: "",
    mobileImage: "",
  });

  const [previewDesktop, setPreviewDesktop] = useState("");
  const [previewMobile, setPreviewMobile] = useState("");

  // بارگذاری تنظیمات اولیه
  useEffect(() => {
    dispatch(getSettingByKey("homePageHero"));
  }, [dispatch]);

  // همگام‌سازی فرم با داده‌های دریافتی
  useEffect(() => {
    if (settings.homePageHero) {
      const data = {
        title: settings.homePageHero.title || "",
        description: settings.homePageHero.description || settings.homePageHero.subtitle || "",
        desktopImage: settings.homePageHero.image?.desktop || "",
        mobileImage: settings.homePageHero.image?.mobile || "",
      };
      setFormData(data);
      setPreviewDesktop(data.desktopImage);
      setPreviewMobile(data.mobileImage);
    }
  }, [settings.homePageHero]);

  // مدیریت پیام‌های سیستم
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "desktopImage") setPreviewDesktop(value);
    if (name === "mobileImage") setPreviewMobile(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = {
      title: formData.title,
      description: formData.description,
      image: {
        desktop: formData.desktopImage,
        mobile: formData.mobileImage,
      },
    };
    dispatch(updateSettingByKey({ key: "homePageHero", value }));
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-md shadow-sm">
      {/* Header Section */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-4 bg-[#007acc] rounded-sm"></span>
          <h2 className="text-[13px] font-bold text-slate-700">تنظیمات Hero Section</h2>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">KEY: homePageHero</div>
      </div>

      {/* Alerts Section */}
      {(successMessage || error) && (
        <div
          className={`px-4 py-2 text-[12px] flex items-center gap-2 border-b ${
            successMessage
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-rose-50 text-rose-700 border-rose-100"
          }`}
        >
          {successMessage ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span className="font-medium">{successMessage || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-0">
        <div className="grid grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-100">
          {/* Left Column: Content Inputs */}
          <div className="col-span-12 lg:col-span-7 p-5 space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="title"
                className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider"
              >
                عنوان اصلی
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-9 px-3 text-[13px] text-slate-700 border border-slate-300 rounded-md focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] outline-none transition-all placeholder:text-slate-300"
                placeholder="مثال: جشنواره فروش ویژه"
                required
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="description"
                className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider"
              >
                توضیحات تکمیلی
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 text-[13px] text-slate-700 border border-slate-300 rounded-md focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] outline-none transition-all placeholder:text-slate-300 resize-none"
                placeholder="توضیحات کوتاه زیر عنوان..."
                required
              />
            </div>

            {/* Guide Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-md p-3 flex gap-3 items-start">
              <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h4 className="text-[12px] font-bold text-blue-700">راهنمای تصاویر</h4>
                <ul className="text-[11px] text-blue-600/80 space-y-1 list-disc list-inside">
                  <li>تصویر دسکتاپ: ۱۹۲۰x۱۰۸۰ پیکسل (نسبت ۱۶:۹)</li>
                  <li>تصویر موبایل: ۷۶۸x۱۰۲۴ پیکسل (نسبت ۳:۴)</li>
                  <li>از لینک مستقیم (Direct URL) استفاده کنید.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Image Management */}
          <div className="col-span-12 lg:col-span-5 p-5 bg-slate-50/30 space-y-6">
            {/* Desktop Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                  <Monitor size={14} className="text-slate-400" />
                  تصویر دسکتاپ
                </label>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Desktop</span>
              </div>
              <input
                type="url"
                name="desktopImage"
                value={formData.desktopImage}
                onChange={handleChange}
                className="w-full h-8 px-2 text-[11px] font-mono text-slate-600 border border-slate-300 rounded bg-white focus:border-[#007acc] outline-none"
                placeholder="https://..."
              />
              <div className="relative w-full aspect-video bg-slate-100 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center group">
                {previewDesktop ? (
                  <img
                    src={previewDesktop}
                    alt="Desktop Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="text-slate-300 flex flex-col items-center gap-1">
                    <Image size={24} />
                    <span className="text-[10px]">پیش‌نمایش خالی</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Image */}
            <div className="space-y-2 pt-4 border-t border-slate-200/60">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                  <Smartphone size={14} className="text-slate-400" />
                  تصویر موبایل
                </label>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Mobile</span>
              </div>
              <input
                type="url"
                name="mobileImage"
                value={formData.mobileImage}
                onChange={handleChange}
                className="w-full h-8 px-2 text-[11px] font-mono text-slate-600 border border-slate-300 rounded bg-white focus:border-[#007acc] outline-none"
                placeholder="https://..."
              />
              <div className="flex justify-center">
                <div className="relative w-32 aspect-[3/4] bg-slate-100 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center">
                  {previewMobile ? (
                    <img
                      src={previewMobile}
                      alt="Mobile Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-1">
                      <Image size={20} />
                      <span className="text-[10px]">خالی</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => dispatch(getSettingByKey("homePageHero"))}
            className="px-4 py-2 text-[12px] font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors"
          >
            بازنشانی
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2 text-[12px] font-medium text-white rounded-md transition-all shadow-sm ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-[#007acc] hover:bg-[#0062a3] active:translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>در حال پردازش...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>ذخیره تغییرات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePageHeroSettings;
