import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey, clearMessages } from "../../features/settingsSlice";
import { Card, CardBody, Typography, Input, Textarea, Button } from "@material-tailwind/react";

const HomePageHeroSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, error, successMessage } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    desktopImage: "",
    mobileImage: "",
  });

  // بارگذاری تنظیمات فعلی
  useEffect(() => {
    dispatch(getSettingByKey("homePageHero"));
  }, [dispatch]);

  // پر کردن فرم با داده‌های موجود
  useEffect(() => {
    if (settings.homePageHero) {
      setFormData({
        title: settings.homePageHero.title || "",
        description: settings.homePageHero.subtitle || "",
        desktopImage: settings.homePageHero.image?.desktop || "",
        mobileImage: settings.homePageHero.image?.mobile || "",
      });
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = {
      title: formData.title,
      subtitle: formData.description,
      image: {
        desktop: formData.desktopImage,
        mobile: formData.mobileImage,
      },
    };

    dispatch(updateSettingByKey({ key: "homePageHero", value }));
  };

  return (
    <div className="bg-white rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">تنظیمات Hero Section صفحه اصلی</h2>
      </div>

      {/* پیام‌ها */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{successMessage}</div>
      )}
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* عنوان */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                عنوان
              </Typography>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                label="عنوان صفحه اصلی"
                required
              />
            </div>

            {/* توضیحات */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                توضیحات
              </Typography>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                label="توضیحات صفحه اصلی"
                rows={4}
                required
              />
            </div>

            {/* تصویر دسکتاپ */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                URL تصویر دسکتاپ
              </Typography>
              <Input
                type="url"
                name="desktopImage"
                value={formData.desktopImage}
                onChange={handleChange}
                label="مثال: https://example.com/image.jpg"
                required
              />
              {formData.desktopImage && (
                <div className="mt-2">
                  <Typography variant="small" color="gray" className="mb-2">
                    پیش‌نمایش تصویر دسکتاپ:
                  </Typography>
                  <img
                    src={formData.desktopImage}
                    alt="پیش‌نمایش دسکتاپ"
                    className="w-full h-48 object-cover rounded-md"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* تصویر موبایل */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                URL تصویر موبایل
              </Typography>
              <Input
                type="url"
                name="mobileImage"
                value={formData.mobileImage}
                onChange={handleChange}
                label="مثال: https://example.com/image-mobile.jpg"
                required
              />
              {formData.mobileImage && (
                <div className="mt-2">
                  <Typography variant="small" color="gray" className="mb-2">
                    پیش‌نمایش تصویر موبایل:
                  </Typography>
                  <img
                    src={formData.mobileImage}
                    alt="پیش‌نمایش موبایل"
                    className="w-48 h-48 object-cover rounded-md"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

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
            <li>تصاویر باید به صورت URL کامل وارد شوند</li>
            <li>برای آپلود تصویر، از بخش "مرکز فضای ابری" استفاده کنید</li>
            <li>پس از آپلود، URL تصویر را کپی کرده و اینجا وارد کنید</li>
            <li>توصیه می‌شود تصویر دسکتاپ با ابعاد 1920x1080 و تصویر موبایل با ابعاد 768x1024 باشد</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default HomePageHeroSettings;
