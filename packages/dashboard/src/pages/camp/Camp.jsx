import { useState } from "react";
import { lazy, Suspense } from "react";
import DashboardSkeleton from "../../components/DashboardSkeleton"; // Fallback مناسب

const CampChart = lazy(() => import("../charts/CampChart"));

const Camp = () => {
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const pageOptions = [
    { label: "صفحه اصلی", value: "/" },
    { label: "نویسندگان", value: "/authors" },
    { label: "رویدادها", value: "/events" },
    { label: "آرشیو شماره‌های نشریه", value: "/archive" },
    { label: "افتخارات", value: "/honors" },
    { label: "گالری‌ها", value: "/gallery" },
    { label: "محتواهای آموزشی", value: "/educations" },
    { label: "عضویت", value: "/join-us" },
  ];

  // وقتی صفحه انتخاب شد، باید تغییرات در قالب لینک UTM ایجاد بشه
  const handleGenerateLink = () => {
    let baseUrl = "https://vaqayet.com";

    const baseUrlWithSlug = `${baseUrl}${selectedPage}`;

    const utmCampaign = campaign || "general_campaign";
    const utmMedium = medium || "social";

    const link = `${baseUrlWithSlug}?utm_source=${source}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    setGeneratedLink(link);
  };

  return (
    <div className="p-6 w-full mx-auto bg-white shadow-md rounded-lg">
      <div className="border p-4 rounded-md border-gray-300 shadow-md">
        <h2 className="text-base md:text-2xl font-semibold mb-4 text-center">
          ایجاد پیوند کمپین <span className="text-sm md:text-lg font-medium">(صفحۀ اصلی و صفحات فهرست)</span>
        </h2>
        <h6 className="text-xs text-red-500 text-center mb-2">
          * فرم زیر برای ایجاد پیوند کمپین برای صفحه اصلی یا صفحات فهرست هر کدام از انواع مطالب است
        </h6>
        <h6 className="text-xs text-red-500 text-center mb-2">
          ** برای ایجاد پیوند کمپین از یک محتوا (به‌طور مثال، یک مقالۀ خاص) به صفحه فهرست آن محتوا در داشبورد
          مراجعه کنید
        </h6>
        <div className="space-y-4">
          {/* منوی کشویی برای انتخاب نوع صفحه */}
          <div>
            <label className="block text-sm font-medium text-gray-700">نوع صفحه</label>
            <select
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
            >
              <option value="">انتخاب نوع صفحه</option>
              {pageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">منبع</label>
            <select
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="">انتخاب منبع</option>
              <option value="instagram">اینستاگرام</option>
              <option value="telegram">تلگرام</option>
              <option value="eitaa">ایتا</option>
              <option value="whatsapp">واتس‌آپ</option>
              <option value="google">گوگل</option>
              <option value="direct">مستقیم (دستی)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">سکو</label>
            <select
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
            >
              <option value="">انتخاب سکو</option>
              <option value="social">شبکه‌های اجتماعی</option>
              <option value="search">گوگل</option>
              <option value="direct">ورود مستقیم</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">نام کمپین</label>
            <input
              type="text"
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="نام کمپین را وارد کنید"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
            />
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleGenerateLink}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer duration-150 hover:bg-red-600"
            >
              ساخت پیوند قابل ردیابی
            </button>
          </div>

          {generatedLink && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">پیوند تولیدشده:</label>
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md "
                style={{ direction: "ltr" }}
              />
              <button
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                className="w-full mt-2 px-4 py-2 bg-gray-600 text-white rounded-md cursor-pointer duration-150 hover:bg-gray-700"
              >
                رونوشت پیوند
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border-t-2 border-dashed border-black mt-8" style={{ direction: "ltr" }}>
        <Suspense fallback={<DashboardSkeleton />}>
          <CampChart />
        </Suspense>
      </div>
    </div>
  );
};

export default Camp;
