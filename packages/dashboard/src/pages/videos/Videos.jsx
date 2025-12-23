import { Link } from "react-router-dom";
import VideosList from "../../components/lists/VideosList";

const Videos = () => {
  return (
    // FIX: Added 'grid grid-cols-1' and 'min-w-0' to strictly constrain width and prevent overflow issues
    <div className="grid grid-cols-1 w-full min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/30">
        {/* Title & Description */}
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          {/* BRANDING: Changed to Secondary Color #f7891b for better visual hierarchy */}
          <div className="p-2 bg-[#f7891b]/10 rounded-lg text-[#f7891b]">
            {/* Video Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1e1e1e] tracking-tight">مدیریت ویدئوها</h2>
            <p className="text-sm text-gray-500 mt-0.5">لیست تمام ویدئوهای بارگذاری شده در سیستم</p>
          </div>
        </div>

        {/* Action Button - Primary Color #007acc */}
        <Link
          to={"/dashboard/videos/create"}
          className="group flex items-center gap-2 px-5 py-2.5 bg-[#007acc] hover:bg-[#0062a3] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#007acc]/30 focus:ring-2 focus:ring-offset-2 focus:ring-[#007acc]"
        >
          <span className="font-medium text-sm">ایجاد ویدئوی جدید</span>
          {/* Plus Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transition-transform group-hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>

      {/* Content Section */}
      {/* FIX: 'w-full' ensures the container takes full width, 'overflow-x-auto' handles the table scroll properly */}
      <div className="w-full p-6 overflow-x-auto">
        <VideosList />
      </div>
    </div>
  );
};

export default Videos;
