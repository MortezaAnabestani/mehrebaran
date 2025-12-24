import { useDispatch } from "react-redux";
import { deleteImageUploadCenter } from "../../features/imageUploadCenter";
import { useState, useEffect } from "react";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

// آیکون‌های SVG داخلی برای جلوگیری از وابستگی به کتابخانه‌های خارجی
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const ImageGallery = ({ images, loading }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredImages = images?.filter((image) =>
    image?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
      <div className="bg-gray-200 h-40 w-full rounded-lg mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="mt-8 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">گالری تصاویر</h2>
          <p className="text-sm text-gray-500 mt-1">مدیریت و مشاهده فایل‌های بارگذاری شده</p>
        </div>

        {/* Modern Search Input */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#007acc] transition-colors">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="جستجو در تصاویر..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pr-10 pl-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#007acc] focus:ring-4 focus:ring-[#007acc]/10 transition-all shadow-sm placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredImages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <SearchIcon />
            </div>
            <p className="text-lg font-medium text-gray-600">هیچ تصویری یافت نشد</p>
            <p className="text-sm mt-1">لطفا عبارت جستجو را تغییر دهید یا تصویر جدیدی بارگذاری کنید.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredImages?.map((img, index) => {
              const imageUrl = `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${img?.imageUrl}`;

              return (
                <div
                  key={img._id || index}
                  className="group relative bg-white rounded-xl border border-gray-100 hover:border-[#007acc]/30 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-40 overflow-hidden bg-gray-50">
                    <img
                      loading="lazy"
                      src={imageUrl}
                      alt={img?.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => dispatch(deleteImageUploadCenter(img?._id))}
                          className="bg-white/90 hover:bg-red-50 text-red-500 p-1.5 rounded-lg shadow-sm backdrop-blur-sm transition-colors transform hover:scale-105"
                          title="حذف تصویر"
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      <button
                        onClick={() => handleCopy(imageUrl, img?._id)}
                        className={`flex items-center justify-center gap-2 w-full py-1.5 text-xs font-medium rounded-lg backdrop-blur-sm transition-all shadow-sm
                          ${
                            copiedId === img?._id
                              ? "bg-green-500 text-white"
                              : "bg-white/90 text-gray-700 hover:bg-[#007acc] hover:text-white"
                          }`}
                      >
                        {copiedId === img?._id ? (
                          <>
                            <CheckIcon /> کپی شد
                          </>
                        ) : (
                          <>
                            <CopyIcon /> کپی لینک
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-3 flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-gray-700 truncate" title={img?.title}>
                      {img?.title || "بدون عنوان"}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                        {toPersianDigits(convertToPersianTime(img?.createdAt, "YYYY/MM/DD"))}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
