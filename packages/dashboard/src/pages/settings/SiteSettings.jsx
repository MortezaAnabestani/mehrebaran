import { Link } from "react-router-dom";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

const SiteSettings = () => {
  const settingsCards = [
    {
      title: "تنظیمات Hero Section صفحه اصلی",
      description: "مدیریت تصویر، عنوان و توضیحات بخش اصلی صفحه اول",
      link: "/dashboard/settings/home-hero",
      icon: "/assets/images/dashboard/icons/photo_gallery.svg",
    },
    {
      title: "تنظیمات پس‌زمینه بخش بلاگ",
      description: "مدیریت تصویر پس‌زمینه بخش بلاگ در صفحه اصلی و صفحه بلاگ",
      link: "/dashboard/settings/blog-background",
      icon: "/assets/images/dashboard/icons/paperIcon.svg",
    },
    {
      title: "آمارهای «در کنار هم چه کردیم»",
      description: "مدیریت آمارهای نمایش داده شده در بخش دستاوردها در صفحه اصلی",
      link: "/dashboard/settings/what-we-did-statistics",
      icon: "/assets/images/dashboard/icons/chart.svg",
    },
    {
      title: "تنظیمات صفحه پروژه‌های تکمیل شده",
      description: "مدیریت تصویر پس‌زمینه، عنوان و توضیحات صفحه پروژه‌های تکمیل شده",
      link: "/dashboard/settings/completed-projects-page",
      icon: "/assets/images/dashboard/icons/category.svg",
    },
  ];

  return (
    <div className="bg-white rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">تنظیمات سایت</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCards.map((setting, index) => (
          <Card key={index} className="w-full hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-start gap-4">
                <img src={setting.icon} alt={setting.title} className="w-12 h-12" />
                <div className="flex-1">
                  <Typography variant="h5" color="blue-gray" className="mb-2 text-base">
                    {setting.title}
                  </Typography>
                  <Typography className="text-sm text-gray-600 mb-4">{setting.description}</Typography>
                  <Link to={setting.link}>
                    <Button size="sm" variant="gradient" color="blue">
                      مدیریت تنظیمات
                    </Button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SiteSettings;
