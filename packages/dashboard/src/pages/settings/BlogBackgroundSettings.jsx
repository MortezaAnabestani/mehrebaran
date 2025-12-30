import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey, clearMessages } from "../../features/settingsSlice";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import { CheckCircle, AlertTriangle, Info, Loader2, Lightbulb, Image as ImageIcon } from "lucide-react";

const BlogBackgroundSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, error, successMessage } = useSelector((state) => state.settings);

  const [imageUrl, setImageUrl] = useState("");

  // بارگذاری تنظیمات فعلی
  useEffect(() => {
    dispatch(getSettingByKey("blogBackground"));
  }, [dispatch]);

  // پر کردن فرم با داده‌های موجود
  useEffect(() => {
    if (settings.blogBackground) {
      setImageUrl(settings.blogBackground.image || "");
    }
  }, [settings.blogBackground]);

  // مدیریت تایمر پیام‌ها
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = { image: imageUrl };
    dispatch(updateSettingByKey({ key: "blogBackground", value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* هدر صفحه با تایپوگرافی M3 */}
      <div className="mb-8">
        <Typography variant="h3" color="blue-gray" className="font-bold tracking-tight text-[#1a1c1e]">
          تنظیمات بصری بلاگ
        </Typography>
        <Typography variant="paragraph" className="text-gray-600 mt-2 text-lg">
          مدیریت تصویر پس‌زمینه و نمای بصری بخش مقالات
        </Typography>
      </div>

      {/* کانتینر اصلی - Surface با Elevation */}
      <Card className="rounded-3xl shadow-lg bg-white overflow-hidden border border-gray-100">
        <CardBody className="p-8">
          {/* بخش پیام‌های سیستم (Alerts) */}
          <div className="space-y-4 mb-8">
            {successMessage && (
              <div className="flex items-center p-4 bg-green-50 text-green-800 rounded-2xl border border-green-100 animate-fade-in">
                <CheckCircle className="w-6 h-6 ml-3 text-green-600" />
                <Typography className="font-medium">{successMessage}</Typography>
              </div>
            )}
            {error && (
              <div className="flex items-center p-4 bg-red-50 text-red-800 rounded-2xl border border-red-100 animate-fade-in">
                <AlertTriangle className="w-6 h-6 ml-3 text-red-600" />
                <Typography className="font-medium">{error}</Typography>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* ورودی URL */}
            <div className="relative text-left">
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                size="md"
                icon={<ImageIcon className="w-5 h-5 text-gray-400" />}
                containerProps={{
                  className: "min-w-0 ltr border border-black",
                }}
              />
              <Typography variant="small" className="mt-2 text-gray-500 text-right rtl">
                لینک مستقیم تصویر را وارد کنید (مثال: https://domain.com/image.jpg)
              </Typography>
            </div>

            {/* بخش پیش‌نمایش - Card داخل Card */}
            {imageUrl && (
              <div className="space-y-3 animate-fade-in-up">
                <Typography variant="h6" color="blue-gray" className="font-medium">
                  پیش‌نمایش زنده
                </Typography>

                {/* کانتینر تصویر با گوشه‌های گرد M3 */}
                <div className="relative w-full h-72 rounded-3xl overflow-hidden shadow-md group">
                  <img
                    src={imageUrl}
                    alt="پیش‌نمایش"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />

                  {/* Overlay گرادینت و محتوا */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#007acc]/90 to-[#007acc]/40 flex flex-col items-center justify-center text-center p-6 backdrop-blur-[2px]">
                    <div className="transform transition-all duration-500 translate-y-0">
                      <Typography variant="h3" className="text-white font-bold mb-3 drop-shadow-md">
                        مجلۀ مهر باران
                      </Typography>
                      <div className="w-16 h-1 bg-white/50 mx-auto rounded-full mb-4"></div>
                      <Typography variant="lead" className="text-white/90 font-light">
                        نمایی از فعالیت‌های داوطلبانه و فرهنگی
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-blue-gray-500 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Info className="w-5 h-5 text-[#007acc] shrink-0" />
                  <span>
                    لایه آبی رنگ روی تصویر به صورت خودکار توسط سیستم اعمال می‌شود تا خوانایی متن تضمین شود.
                  </span>
                </div>
              </div>
            )}

            {/* دکمه‌ها - Action Bar */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className={`rounded-full px-8 py-3 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading ? "bg-gray-300 text-gray-500" : "bg-[#007acc] text-white"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال پردازش...</span>
                  </>
                ) : (
                  "ذخیره تغییرات"
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* بخش راهنما - Surface Variant */}
      <div className="mt-6 bg-[#eef7fc] rounded-3xl p-6 border border-[#007acc]/10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-[#007acc]">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2 font-bold">
              راهنمای انتخاب تصویر
            </Typography>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#007acc] rounded-full"></span>
                برای بهترین نتیجه از تصاویر افقی با رزولوشن <strong>1920x800</strong> پیکسل استفاده کنید.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#007acc] rounded-full"></span>
                تصویر در دو بخش "صفحه اصلی" و "هدر بلاگ" نمایش داده می‌شود.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#007acc] rounded-full"></span>
                اگر تصویر ندارید، می‌توانید از{" "}
                <span className="text-[#007acc] font-medium cursor-pointer hover:underline">
                  مرکز فضای ابری
                </span>{" "}
                برای آپلود استفاده کنید.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogBackgroundSettings;
