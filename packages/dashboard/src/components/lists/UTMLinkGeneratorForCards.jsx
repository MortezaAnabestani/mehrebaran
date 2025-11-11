import { useState, useEffect } from "react";

const UTMLinkGeneratorForCards = ({ page, slug }) => {
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleGenerateLink = () => {
    let baseUrl = "https://vaqayet.com";

    const baseUrlWithSlug = `${baseUrl}/${page}/${slug}`;

    const utmCampaign = campaign || "general_campaign";
    const utmMedium = medium || "social";

    const link = `${baseUrlWithSlug}?utm_source=${source}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    setGeneratedLink(link);
  };

  return (
    <div className="w-full mx-auto pb-2 md:p-1 bg-white rounded-xs shadow-md border-gray-100 border-2 border-b-gray-400">
      {!generatedLink && (
        <div className="flex flex-wrap justify-between items-center gap-1">
          <div className="md:flex-1 ">
            <select
              className="block w-full p-1 text-xs border border-gray-300 rounded-xs"
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
          <div className="md:flex-1">
            <select
              className="block w-full p-1 text-xs border border-gray-300 rounded-xs"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
            >
              <option value="">انتخاب سکو</option>
              <option value="social">شبکه‌های اجتماعی</option>
              <option value="search">گوگل</option>
              <option value="direct">ورود مستقیم</option>
            </select>
          </div>
          <div className="md:flex-1">
            <input
              type="text"
              className="block w-full p-1 text-xs border border-gray-300 rounded-xs"
              placeholder="نام کمپین را وارد کنید"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button
              onClick={handleGenerateLink}
              className="px-2 py-1 bg-red-500 text-white rounded-xs cursor-pointer duration-150 hover:bg-red-600 text-xs"
            >
              ساخت پیوند کمپین
            </button>
          </div>
        </div>
      )}

      {generatedLink && (
        <div className="flex gap-1 text-center">
          <span className="text-lg cursor-pointer" onClick={() => setGeneratedLink(null)}>
            ×
          </span>
          <input
            type="text"
            readOnly
            value={generatedLink}
            className="block w-full p-1 text-xs border border-gray-300 rounded-xs overflow-x-auto"
            style={{ direction: "ltr" }}
          />
          <button
            onClick={() => navigator.clipboard.writeText(generatedLink)}
            className="px-2 bg-gray-600 text-white rounded-xs cursor-pointer duration-150 hover:bg-gray-700 text-xs"
          >
            رونوشت
          </button>
        </div>
      )}
    </div>
  );
};

export default UTMLinkGeneratorForCards;
