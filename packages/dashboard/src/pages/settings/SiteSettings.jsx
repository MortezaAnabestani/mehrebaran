import { Link } from "react-router-dom";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

const SiteSettings = () => {
  const settingsCards = [
    {
      title: "تنظیمات عکس بخش اصلی صفحه اول",
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
    {
      title: "تنظیمات صفحه حوزه‌های فعالیت",
      description: "مدیریت تصاویر، عنوان و توضیحات صفحه حوزه‌های فعالیت ",
      link: "/dashboard/settings/focus-page-hero",
      icon: "/assets/images/dashboard/icons/stage.svg",
    },
  ];

  return (
    // M3 Surface Container: استفاده از رنگ پس‌زمینه ملایم و گوشه‌های گرد بزرگ
    <div className="bg-[#f8fafd] rounded-[28px] p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        {/* M3 Headline Typography */}
        <h2 className="text-2xl md:text-3xl font-normal text-[#1a1c1e] tracking-tight">تنظیمات سایت</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCards.map((setting, index) => (
          <Card
            key={index}
            className="w-full bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border border-transparent hover:border-[#007acc]/20 overflow-hidden"
          >
            <CardBody className="p-6">
              <div className="flex items-start gap-5">
                {/* Icon Container with Tonal Background */}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#007acc]/10 shrink-0">
                  <img src={setting.icon} alt={setting.title} className="w-8 h-8 opacity-90" />
                </div>

                <div className="flex-1 flex flex-col h-full justify-between">
                  <div>
                    <Typography
                      variant="h5"
                      className="mb-2 text-lg font-medium text-[#1a1c1e] tracking-normal"
                    >
                      {setting.title}
                    </Typography>
                    <Typography className="text-sm text-gray-500 mb-5 leading-relaxed font-normal">
                      {setting.description}
                    </Typography>
                  </div>

                  <div className="flex justify-end">
                    <Link to={setting.link}>
                      {/* M3 Pill Button: دکمه‌های کاملا گرد */}
                      <Button
                        size="sm"
                        className="rounded-full bg-[#007acc] hover:bg-[#0062a3] shadow-none hover:shadow-md transition-all duration-300 normal-case font-medium px-6 py-2.5"
                      >
                        مدیریت تنظیمات
                      </Button>
                    </Link>
                  </div>
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
