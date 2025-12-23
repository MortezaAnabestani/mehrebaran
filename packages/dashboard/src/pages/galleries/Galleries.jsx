import { Link } from "react-router-dom";
import GalleriesList from "../../components/lists/GalleriesList";

const Galleries = () => {
  return (
    <div className="grid grid-cols-1 w-full min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
      {/* Header Section */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-3">
          {/* Brand Accent Line */}
          <div className="h-8 w-1.5 bg-[#f7891b] rounded-full shadow-[0_0_10px_rgba(247,137,27,0.5)]"></div>
          <h2 className="text-2xl font-bold text-[#1e1e1e] tracking-tight">فهرست گالری‌ها</h2>
        </div>

        <Link
          rel="preconnect"
          to={"/dashboard/galleries/create"}
          className="group flex items-center gap-2 px-6 py-2.5 bg-[#007acc] text-white rounded-lg shadow-md shadow-blue-500/20 hover:bg-[#0062a3] hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 ease-out"
        >
          {/* Plus Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium text-sm">ایجاد گالری جدید</span>
        </Link>
      </div>

      {/* Content Section */}
      <div className="w-full p-6 overflow-x-auto">
        <GalleriesList />
      </div>
    </div>
  );
};

export default Galleries;
