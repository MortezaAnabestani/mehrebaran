import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey, clearMessages } from "../../features/settingsSlice";
import styles from "../../styles/admin.module.css";

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

  // بارگذاری تنظیمات فعلی
  useEffect(() => {
    dispatch(getSettingByKey("focusPageHero"));
  }, [dispatch]);

  // پر کردن فرم با داده‌های موجود
  useEffect(() => {
    if (settings.focusPageHero) {
      const data = {
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
      };
      setFormData(data);
    }
  }, [settings.focusPageHero]);

  // پاک کردن پیام‌ها پس از 3 ثانیه
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.dockImages];
    newImages[index] = value;
    setFormData((prev) => ({
      ...prev,
      dockImages: newImages,
    }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      dockImages: [...prev.dockImages, ""],
    }));
  };

  const removeImageField = (index) => {
    if (formData.dockImages.length > 4) {
      const newImages = formData.dockImages.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        dockImages: newImages,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      stats: {
        projects: {
          label: formData.projectsLabel,
          value: formData.projectsValue,
        },
        volunteers: {
          label: formData.volunteersLabel,
          value: formData.volunteersValue,
        },
        beneficiaries: {
          label: formData.beneficiariesLabel,
          value: formData.beneficiariesValue,
        },
      },
      dockImages: formData.dockImages.filter((img) => img.trim() !== ""),
    };

    dispatch(updateSettingByKey({ key: "focusPageHero", value }));
  };

  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-medium">تنظیمات Hero Section صفحه حوزه‌های فعالیت</h2>
        </div>
      </div>

      {/* پیام‌ها */}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold ml-1">موفقیت!</strong>
          <span className="block sm:inline">{successMessage}</span>
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

      <form onSubmit={handleSubmit}>
        {/* عنوان اصلی */}
        <div className={styles.createContent_title}>
          <label className="text-[12px] mb-0" htmlFor="title">
            عنوان اصلی
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
            required
          />
        </div>

        {/* زیرعنوان */}
        <div className={styles.createContent_title}>
          <label className="text-[12px] mb-0" htmlFor="subtitle">
            زیرعنوان
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
            required
          />
        </div>

        {/* توضیحات */}
        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-0" htmlFor="description">
            توضیحات
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:border-gray-500 outline-none transition"
            rows={4}
            required
          />
        </div>

        {/* آمار - پروژه‌ها */}
        <h3 className="text-lg font-semibold mb-4 mt-8">آمارها</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={styles.createContent_title}>
            <label className="text-[12px] mb-0" htmlFor="projectsLabel">
              برچسب پروژه‌ها
            </label>
            <input
              type="text"
              id="projectsLabel"
              name="projectsLabel"
              value={formData.projectsLabel}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
              required
            />
          </div>
          <div className={styles.createContent_title}>
            <label className="text-[12px] mb-0" htmlFor="projectsValue">
              مقدار پروژه‌ها
            </label>
            <input
              type="text"
              id="projectsValue"
              name="projectsValue"
              value={formData.projectsValue}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
              required
            />
          </div>
        </div>

        {/* آمار - داوطلبان */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={styles.createContent_title}>
            <label className="text-[12px] mb-0" htmlFor="volunteersLabel">
              برچسب داوطلبان
            </label>
            <input
              type="text"
              id="volunteersLabel"
              name="volunteersLabel"
              value={formData.volunteersLabel}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
              required
            />
          </div>
          <div className={styles.createContent_title}>
            <label className="text-[12px] mb-0" htmlFor="volunteersValue">
              مقدار داوطلبان
            </label>
            <input
              type="text"
              id="volunteersValue"
              name="volunteersValue"
              value={formData.volunteersValue}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
              required
            />
          </div>
        </div>

        {/* آمار - ذینفعان */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={styles.createContent_title}>
            <label className="text-[12px] mb-0" htmlFor="beneficiariesLabel">
              برچسب ذینفعان
            </label>
            <input
              type="text"
              id="beneficiariesLabel"
              name="beneficiariesLabel"
              value={formData.beneficiariesLabel}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
              required
            />
          </div>
          <div className={styles.createContent_title}>
            <label className="text-[12px] mb-0" htmlFor="beneficiariesValue">
              مقدار ذینفعان
            </label>
            <input
              type="text"
              id="beneficiariesValue"
              name="beneficiariesValue"
              value={formData.beneficiariesValue}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
              required
            />
          </div>
        </div>

        {/* تصاویر AppleWatchDock */}
        <h3 className="text-lg font-semibold mb-4 mt-8">تصاویر AppleWatchDock</h3>
        <p className="text-sm text-gray-600 mb-4">حداقل ۴ تصویر برای AppleWatchDock لازم است</p>

        {formData.dockImages.map((image, index) => (
          <div key={index} className="flex gap-2 mb-4">
            <div className="flex-1">
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
                placeholder={`URL تصویر ${index + 1}`}
                required
              />
            </div>
            {formData.dockImages.length > 4 && (
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                حذف
              </button>
            )}
            {image && (
              <div className="w-12 h-12 border rounded-md overflow-hidden">
                <img
                  src={image}
                  alt={`پیش‌نمایش ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addImageField}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          افزودن تصویر
        </button>

        {/* دکمه ذخیره */}
        <div className="mt-10">
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-3 rounded-md text-white font-medium ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FocusPageHeroSettings;
