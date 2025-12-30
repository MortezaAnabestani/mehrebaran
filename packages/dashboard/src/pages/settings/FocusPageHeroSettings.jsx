import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey, clearMessages } from "../../features/settingsSlice";

const FocusPageHeroSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, error, successMessage } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    projectsLabel: "",
    projectsValue: "",
    volunteersLabel: "",
    volunteersValue: "",
    beneficiariesLabel: "",
    beneficiariesValue: "",
    dockImages: ["", "", "", ""],
  });

  // بارگذاری تنظیمات
  useEffect(() => {
    dispatch(getSettingByKey("focusPageHero"));
  }, [dispatch]);

  // پر کردن فرم
  useEffect(() => {
    if (settings.focusPageHero) {
      setFormData({
        title: settings.focusPageHero.title || "",
        subtitle: settings.focusPageHero.subtitle || "",
        description: settings.focusPageHero.description || "",
        projectsLabel: settings.focusPageHero.stats?.projects?.label || "",
        projectsValue: settings.focusPageHero.stats?.projects?.value || "",
        volunteersLabel: settings.focusPageHero.stats?.volunteers?.label || "",
        volunteersValue: settings.focusPageHero.stats?.volunteers?.value || "",
        beneficiariesLabel: settings.focusPageHero.stats?.beneficiaries?.label || "",
        beneficiariesValue: settings.focusPageHero.stats?.beneficiaries?.value || "",
        dockImages: settings.focusPageHero.dockImages || ["", "", "", ""],
      });
    }
  }, [settings.focusPageHero]);

  // مدیریت پیام‌ها
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.dockImages];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, dockImages: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, dockImages: [...prev.dockImages, ""] }));
  };

  const removeImageField = (index) => {
    if (formData.dockImages.length > 4) {
      const newImages = formData.dockImages.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, dockImages: newImages }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      stats: {
        projects: { label: formData.projectsLabel, value: formData.projectsValue },
        volunteers: { label: formData.volunteersLabel, value: formData.volunteersValue },
        beneficiaries: { label: formData.beneficiariesLabel, value: formData.beneficiariesValue },
      },
      dockImages: formData.dockImages.filter((img) => img.trim() !== ""),
    };
    dispatch(updateSettingByKey({ key: "focusPageHero", value }));
  };

  // کامپوننت‌های کمکی برای استایل یکپارچه
  const Label = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-[11px] font-medium text-slate-500 mb-1.5">
      {children}
    </label>
  );

  const Input = ({ ...props }) => (
    <input
      {...props}
      className="w-full h-9 px-3 text-[12px] text-slate-700 border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all placeholder-slate-400"
    />
  );

  const SectionHeader = ({ title }) => (
    <div className="pb-2 mb-4 border-b border-slate-100">
      <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#007acc] rounded-full"></span>
        {title}
      </h3>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto font-sans">
      {/* هدر صفحه */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-slate-800">تنظیمات Hero Section</h1>
          <p className="text-[12px] text-slate-500 mt-1">مدیریت محتوای بخش اصلی صفحه حوزه‌های فعالیت</p>
        </div>
        {/* دکمه ذخیره اصلی */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 text-[12px] font-medium text-white rounded-md transition-colors ${
            loading ? "bg-slate-400 cursor-not-allowed" : "bg-[#007acc] hover:bg-[#0062a3]"
          }`}
        >
          {loading ? "در حال پردازش..." : "ذخیره تغییرات"}
        </button>
      </div>

      {/* نمایش پیام‌ها */}
      {(successMessage || error) && (
        <div
          className={`mb-4 p-3 rounded-md border text-[12px] ${
            successMessage
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <span className="font-bold ml-1">{successMessage ? "موفقیت:" : "خطا:"}</span>
          {successMessage || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
        {/* ستون چپ: اطلاعات اصلی و آمار */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* پنل اطلاعات عمومی */}
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <SectionHeader title="اطلاعات عمومی" />
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <Label htmlFor="title">عنوان اصلی</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <Label htmlFor="subtitle">زیرعنوان</Label>
                <Input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-12">
                <Label htmlFor="description">توضیحات</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 text-[12px] text-slate-700 border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all placeholder-slate-400 resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* پنل آمارها */}
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <SectionHeader title="آمار و ارقام (Stats)" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* آمار پروژه‌ها */}
              <div className="bg-slate-50 border border-slate-100 rounded-md p-3">
                <div className="mb-3 pb-2 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                  پروژه‌ها
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="projectsLabel">برچسب</Label>
                    <Input
                      name="projectsLabel"
                      value={formData.projectsLabel}
                      onChange={handleChange}
                      placeholder="مثال: پروژه موفق"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectsValue">مقدار</Label>
                    <Input
                      name="projectsValue"
                      value={formData.projectsValue}
                      onChange={handleChange}
                      placeholder="مثال: +150"
                    />
                  </div>
                </div>
              </div>

              {/* آمار داوطلبان */}
              <div className="bg-slate-50 border border-slate-100 rounded-md p-3">
                <div className="mb-3 pb-2 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                  داوطلبان
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="volunteersLabel">برچسب</Label>
                    <Input name="volunteersLabel" value={formData.volunteersLabel} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="volunteersValue">مقدار</Label>
                    <Input name="volunteersValue" value={formData.volunteersValue} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* آمار ذینفعان */}
              <div className="bg-slate-50 border border-slate-100 rounded-md p-3">
                <div className="mb-3 pb-2 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                  ذینفعان
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="beneficiariesLabel">برچسب</Label>
                    <Input
                      name="beneficiariesLabel"
                      value={formData.beneficiariesLabel}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="beneficiariesValue">مقدار</Label>
                    <Input
                      name="beneficiariesValue"
                      value={formData.beneficiariesValue}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ستون راست: تصاویر */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white border border-slate-200 rounded-md p-5 sticky top-4">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#007acc] rounded-full"></span>
                تصاویر Dock
              </h3>
              <button
                type="button"
                onClick={addImageField}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors"
              >
                + افزودن
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {formData.dockImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative bg-slate-50 border border-slate-200 rounded-md p-2 flex gap-2 items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-200 rounded overflow-hidden border border-slate-300">
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[8px]">
                        Empty
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full h-7 px-2 text-[11px] bg-white border border-slate-300 rounded focus:border-[#007acc] focus:outline-none"
                      placeholder={`URL تصویر ${index + 1}`}
                    />
                  </div>
                  {formData.dockImages.length > 4 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="حذف"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 text-center">حداقل ۴ تصویر الزامی است.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FocusPageHeroSettings;
