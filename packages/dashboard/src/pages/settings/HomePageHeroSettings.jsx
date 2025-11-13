import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey, clearMessages } from "../../features/settingsSlice";
import styles from "../../styles/admin.module.css";

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

  // بارگذاری تنظیمات فعلی
  useEffect(() => {
    dispatch(getSettingByKey("homePageHero"));
  }, [dispatch]);

  // پر کردن فرم با داده‌های موجود
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

    // بروزرسانی پیش‌نمایش
    if (name === "desktopImage") {
      setPreviewDesktop(value);
    } else if (name === "mobileImage") {
      setPreviewMobile(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = {
      title: formData.title,
      description: formData.description, // تغییر از subtitle به description
      image: {
        desktop: formData.desktopImage,
        mobile: formData.mobileImage,
      },
    };

    dispatch(updateSettingByKey({ key: "homePageHero", value }));
  };

  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-medium">تنظیمات Hero Section صفحه اصلی</h2>
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
        {/* عنوان */}
        <div className={styles.createContent_title}>
          <label className="text-[12px] mb-0" htmlFor="title">
            عنوان
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

        {/* تصویر دسکتاپ */}
        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-0" htmlFor="desktopImage">
            URL تصویر دسکتاپ
          </label>
          <input
            type="url"
            id="desktopImage"
            name="desktopImage"
            value={formData.desktopImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
            required
          />
          {previewDesktop && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-2">پیش‌نمایش تصویر دسکتاپ:</p>
              <img
                src={previewDesktop}
                alt="پیش‌نمایش دسکتاپ"
                className="w-full max-w-2xl h-64 object-cover rounded-md border border-gray-300"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* تصویر موبایل */}
        <div className={`${styles.createContent_title} mb-10`}>
          <label className="text-[12px] mb-0" htmlFor="mobileImage">
            URL تصویر موبایل
          </label>
          <input
            type="url"
            id="mobileImage"
            name="mobileImage"
            value={formData.mobileImage}
            onChange={handleChange}
            placeholder="https://example.com/image-mobile.jpg"
            className="w-full px-4 py-2 border rounded-md border-gray-300 h-10"
            required
          />
          {previewMobile && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-2">پیش‌نمایش تصویر موبایل:</p>
              <img
                src={previewMobile}
                alt="پیش‌نمایش موبایل"
                className="w-64 h-64 object-cover rounded-md border border-gray-300"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* دکمه ذخیره */}
        <div className="mt-6 text-left">
          <button
            type="submit"
            disabled={loading}
            className={`px-3 w-full lg:w-[120px] cursor-pointer py-[6px] ${
              loading ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-700"
            } rounded-md text-white`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                <span>در حال ذخیره...</span>
              </div>
            ) : (
              "ذخیره تنظیمات"
            )}
          </button>
        </div>
      </form>

      {/* راهنما */}
      <div className="bg-blue-50 rounded-md p-4 mt-6 border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-2">💡 راهنما</h3>
        <ul className="list-disc mr-6 space-y-1 text-sm text-gray-700">
          <li>تصاویر باید به صورت URL کامل وارد شوند</li>
          <li>برای آپلود تصویر، از بخش "مرکز فضای ابری" استفاده کنید</li>
          <li>پس از آپلود، URL تصویر را کپی کرده و اینجا وارد کنید</li>
          <li>توصیه می‌شود تصویر دسکتاپ با ابعاد 1920x1080 و تصویر موبایل با ابعاد 768x1024 باشد</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePageHeroSettings;
