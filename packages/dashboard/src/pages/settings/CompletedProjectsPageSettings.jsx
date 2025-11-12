import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey } from "../../features/settingsSlice";
import { Link } from "react-router-dom";

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

      setSaveMessage({ type: "success", text: "تنظیمات با موفقیت ذخیره شدند!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage({ type: "error", text: err || "خطا در ذخیره تنظیمات" });
    }
  };

  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-medium">تنظیمات صفحه پروژه‌های تکمیل شده</h2>
          <Link
            rel="preconnect"
            to="/dashboard/settings"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            بازگشت به تنظیمات
          </Link>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`mb-4 p-4 rounded-md ${
            saveMessage.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold ml-1">خطا!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">راهنما</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            این تنظیمات برای صفحه <code className="bg-gray-100 px-2 py-1 rounded">/projects/completed</code> استفاده
            می‌شود. در این صفحه، پروژه‌هایی که به عنوان "برجسته در صفحه تکمیل شده" انتخاب شده‌اند نمایش داده
            می‌شوند.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL تصویر پس‌زمینه */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL تصویر پس‌زمینه
              <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="backgroundImage"
              value={formData.backgroundImage}
              onChange={handleChange}
              placeholder="https://example.com/images/background.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              لینک کامل تصویر پس‌زمینه صفحه. برای آپلود تصویر از{" "}
              <Link to="/dashboard/upload-center" className="text-blue-600 hover:underline">
                مرکز آپلود
              </Link>{" "}
              استفاده کنید.
            </p>
            {formData.backgroundImage && (
              <div className="mt-3">
                <img
                  src={formData.backgroundImage}
                  alt="پیش‌نمایش پس‌زمینه"
                  className="w-full max-w-md h-48 object-cover rounded-md border border-gray-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* عنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="باران تویی..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">عنوانی که در بالای صفحه روی عکس پس‌زمینه نمایش داده می‌شود.</p>
          </div>

          {/* توضیحات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="توضیحات کامل در مورد فعالیت‌های انجام شده..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              متن توضیحات که در کادر مشکی زیر عنوان نمایش داده می‌شود. این متن می‌تواند گزارش فعالیت‌های انجام شده
              باشد.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-6 py-3 rounded-md text-white font-medium ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </button>
          </div>
        </form>

        {/* پیش‌نمایش */}
        {formData.backgroundImage && formData.title && formData.description && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">پیش‌نمایش</h3>
            <div
              className="w-full min-h-[400px] rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url('${formData.backgroundImage}')`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="p-10">
                <div className="py-5 px-10 rounded-3xl bg-black max-w-lg">
                  <h1 className="py-2 px-3 bg-orange-500 w-fit font-bold rounded-sm mb-3 text-white">
                    {formData.title}
                  </h1>
                  <p className="text-white text-sm leading-loose">{formData.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedProjectsPageSettings;
