import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey, clearMessages } from "../../features/settingsSlice";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";

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

  // پاک کردن پیام‌ها پس از 3 ثانیه
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

    const value = {
      image: imageUrl,
    };

    dispatch(updateSettingByKey({ key: "blogBackground", value }));
  };

  return (
    <div className="bg-white rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">تنظیمات پس‌زمینه بخش بلاگ</h2>
      </div>

      {/* پیام‌ها */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{successMessage}</div>
      )}
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL تصویر */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                URL تصویر پس‌زمینه
              </Typography>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                label="مثال: https://example.com/blog-background.jpg"
                required
              />
              <Typography variant="small" color="gray" className="mt-2">
                این تصویر به عنوان پس‌زمینه بخش بلاگ در صفحه اصلی و صفحه /blog استفاده می‌شود
              </Typography>
            </div>

            {/* پیش‌نمایش تصویر */}
            {imageUrl && (
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  پیش‌نمایش تصویر
                </Typography>
                <div className="relative w-full h-64 rounded-md overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="پیش‌نمایش"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {/* Overlay برای شبیه‌سازی نحوه نمایش واقعی */}
                  <div className="absolute inset-0 bg-blue-500/70 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <Typography variant="h4" className="mb-2">
                        مجلۀ مهر باران
                      </Typography>
                      <Typography variant="small">
                        فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد
                      </Typography>
                    </div>
                  </div>
                </div>
                <Typography variant="small" color="gray" className="mt-2">
                  💡 تصویر واقعی با یک لایه آبی شفاف نمایش داده می‌شود (همانند پیش‌نمایش بالا)
                </Typography>
              </div>
            )}

            {/* دکمه ذخیره */}
            <div className="flex gap-4">
              <Button type="submit" color="blue" disabled={loading}>
                {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* راهنما */}
      <Card className="mt-6 bg-blue-50">
        <CardBody>
          <Typography variant="h6" color="blue-gray" className="mb-2">
            💡 راهنما
          </Typography>
          <ul className="list-disc mr-6 space-y-1 text-sm text-gray-700">
            <li>تصویر باید به صورت URL کامل وارد شود</li>
            <li>برای آپلود تصویر، از بخش "مرکز فضای ابری" استفاده کنید</li>
            <li>پس از آپلود، URL تصویر را کپی کرده و اینجا وارد کنید</li>
            <li>توصیه می‌شود تصویر با ابعاد 1920x800 و کیفیت بالا باشد</li>
            <li>این تصویر در دو مکان نمایش داده می‌شود:</li>
            <ul className="list-circle mr-6 mt-1">
              <li>بخش بلاگ در صفحه اصلی (home page)</li>
              <li>هدر صفحه بلاگ (/blog)</li>
            </ul>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default BlogBackgroundSettings;
