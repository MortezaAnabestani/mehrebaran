import { useState, useEffect } from "react";
import api from "../../services/api";

const ReportBug = () => {
  const [formData, setFormData] = useState({
    type: "bug",
    priority: "medium",
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
  });

  const [screenshots, setScreenshots] = useState([]);
  const [systemInfo, setSystemInfo] = useState({});
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // جمع‌آوری اطلاعات سیستم
  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      url: window.location.href,
    };
    setSystemInfo(info);

    // جمع‌آوری console logs
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      logs.push({ type: "log", message: args.join(" "), time: new Date().toISOString() });
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      logs.push({ type: "error", message: args.join(" "), time: new Date().toISOString() });
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      logs.push({ type: "warn", message: args.join(" "), time: new Date().toISOString() });
      originalWarn.apply(console, args);
    };

    setConsoleLogs(logs);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScreenshotUpload = (e) => {
    const files = Array.from(e.target.files);
    const newScreenshots = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setScreenshots((prev) => [...prev, ...newScreenshots]);
  };

  const removeScreenshot = (index) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // ایجاد FormData برای ارسال فایل‌ها
      const submitData = new FormData();

      // افزودن فیلدهای اصلی
      submitData.append("type", formData.type);
      submitData.append("priority", formData.priority);
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);

      if (formData.stepsToReproduce) {
        submitData.append("stepsToReproduce", formData.stepsToReproduce);
      }
      if (formData.expectedBehavior) {
        submitData.append("expectedBehavior", formData.expectedBehavior);
      }
      if (formData.actualBehavior) {
        submitData.append("actualBehavior", formData.actualBehavior);
      }

      // افزودن اطلاعات سیستم
      submitData.append("systemInfo", JSON.stringify(systemInfo));

      // افزودن console logs
      if (consoleLogs.length > 0) {
        submitData.append("consoleLogs", JSON.stringify(consoleLogs.slice(-10)));
      }

      // افزودن اسکرین‌شات‌ها
      screenshots.forEach((screenshot) => {
        submitData.append("screenshots", screenshot.file);
      });

      // ارسال به API
      const response = await api.post("/bug-reports", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Bug report submitted:", response.data);

      // نمایش پیام موفقیت
      setShowSuccess(true);

      // ریست فرم
      setFormData({
        type: "bug",
        priority: "medium",
        title: "",
        description: "",
        stepsToReproduce: "",
        expectedBehavior: "",
        actualBehavior: "",
      });
      setScreenshots([]);

      // مخفی کردن پیام موفقیت بعد از 10 ثانیه
      setTimeout(() => setShowSuccess(false), 10000);
    } catch (err) {
      console.error("Error submitting bug report:", err);
      setError(err.response?.data?.message || "خطا در ارسال گزارش. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">گزارش مشکل</h1>
          <p className="text-sm text-slate-600">
            لطفاً مشکل خود را با جزئیات کامل توضیح دهید. گزارش شما در دیتابیس ذخیره و به ایمیل ارسال می‌شود.
          </p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">✅ گزارش با موفقیت ثبت شد!</p>
              <p className="text-xs text-green-700 mt-1">
                گزارش شما در سیستم ثبت شد و به ایمیل anabestani.morteza@gmail.com ارسال خواهد شد.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">خطا</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200">
          {/* Basic Info Section */}
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">اطلاعات اولیه</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">نوع</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="bug">🐛 باگ</option>
                  <option value="feature">✨ درخواست ویژگی</option>
                  <option value="suggestion">💡 پیشنهاد</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">اولویت</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="low">🟢 کم</option>
                  <option value="medium">🟡 متوسط</option>
                  <option value="high">🔴 بالا</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 border-b border-slate-200 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">توضیحات</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                عنوان <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="یک عنوان کوتاه و واضح برای مشکل"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                توضیحات کامل <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="مشکل را با جزئیات کامل توضیح دهید..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Steps to Reproduce */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">مراحل بازتولید مشکل</label>
              <textarea
                name="stepsToReproduce"
                value={formData.stepsToReproduce}
                onChange={handleInputChange}
                rows={4}
                placeholder="1. به صفحه ... بروید&#10;2. روی دکمه ... کلیک کنید&#10;3. ..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Expected vs Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">رفتار مورد انتظار</label>
                <textarea
                  name="expectedBehavior"
                  value={formData.expectedBehavior}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="چه اتفاقی باید می‌افتاد؟"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">رفتار واقعی</label>
                <textarea
                  name="actualBehavior"
                  value={formData.actualBehavior}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="چه اتفاقی افتاد؟"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Screenshots Section */}
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">اسکرین‌شات‌ها</h2>
            <div className="space-y-4">
              <div>
                <label className="block w-full">
                  <div className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-slate-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-slate-600">کلیک کنید یا فایل را بکشید</p>
                      <p className="text-xs text-slate-500">PNG, JPG تا 10MB (حداکثر 5 تصویر)</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Screenshot Previews */}
              {screenshots.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={screenshot.preview}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System Info Section */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">اطلاعات سیستم (خودکار)</h2>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-xs font-mono space-y-1 text-slate-700">
              <div>
                <span className="font-bold">مرورگر:</span> {systemInfo.userAgent?.substring(0, 80)}...
              </div>
              <div>
                <span className="font-bold">پلتفرم:</span> {systemInfo.platform}
              </div>
              <div>
                <span className="font-bold">رزولوشن:</span> {systemInfo.screenResolution}
              </div>
              <div>
                <span className="font-bold">Viewport:</span> {systemInfo.viewport}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-slate-50 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              با کلیک روی دکمه ارسال، گزارش در دیتابیس ذخیره و به ایمیل ارسال می‌شود.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  در حال ارسال...
                </>
              ) : (
                "ارسال گزارش"
              )}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm">💡 نکات مفید</h3>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>گزارش شما به صورت خودکار در دیتابیس ذخیره می‌شود</li>
            <li>یک ایمیل با جزئیات کامل به anabestani.morteza@gmail.com ارسال می‌شود</li>
            <li>اسکرین‌شات‌های واضح کمک زیادی به حل سریع‌تر مشکل می‌کند</li>
            <li>هر چه توضیحات دقیق‌تر باشد، مشکل سریع‌تر برطرف می‌شود</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportBug;
