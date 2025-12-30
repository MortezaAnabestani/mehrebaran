import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteVideo, fetchVideos } from "../../features/videosSlice";
import { useDispatch } from "react-redux";
import ConfirmDelete from "../createContent/ConfirmDelete";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const VideosListIndex = ({
  videos,
  loading,
  currentPage,
  totalPages,
  totalItems,
  onNextPage,
  onPrevPage,
}) => {
  const dispatch = useDispatch();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDeleteModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedVideo) {
      try {
        await dispatch(deleteVideo(selectedVideo.slug)).unwrap();
        dispatch(fetchVideos());
      } catch (error) {
        console.error("خطا در حذف ویدئو:", error);
      }
    }
    setIsModalOpen(false);
  };

  // Loading State - Functional Skeleton
  if (loading) {
    return (
      <div className="w-full h-64 border border-slate-200 rounded-md bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-[#007acc] rounded-full animate-spin"></div>
        <span className="text-[12px] font-medium text-slate-500">در حال بارگذاری داده‌ها...</span>
      </div>
    );
  }

  // Empty State - Dashed Border
  if (!videos || videos.length === 0) {
    return (
      <div className="mt-4 border-2 border-dashed border-slate-300 rounded-md p-8 text-center bg-slate-50/50">
        <p className="text-slate-700 font-medium text-sm">داده‌ای یافت نشد</p>
        <p className="text-slate-500 text-[12px] mt-1">برای شروع، یک ویدئوی جدید ثبت کنید.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 font-sans">
      {/* Desktop View - High Density Table */}
      <div className="hidden lg:block border border-slate-200 rounded-md overflow-hidden bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {[
                "تصویر",
                "عنوان / زیرعنوان",
                "دسته‌بندی",
                "فیلمبردار",
                "وضعیت",
                "تاریخ",
                "بازدید",
                "عملیات",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {videos.map((video) => (
              <tr key={video._id} className="hover:bg-slate-50/80 transition-colors duration-150">
                {/* Image */}
                <td className="px-4 py-2.5 whitespace-nowrap w-24">
                  <div className="h-10 w-16 bg-slate-100 rounded border border-slate-200 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${
                        video.coverImage?.desktop
                      }`}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>

                {/* Title & Subtitle */}
                <td className="px-4 py-2.5">
                  <div className="flex flex-col max-w-[200px]">
                    <span className="text-[13px] font-medium text-slate-800 truncate" title={video.title}>
                      {video.title}
                    </span>
                    {video.subtitle && (
                      <span className="text-[11px] text-slate-500 truncate mt-0.5">{video.subtitle}</span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {video.category?.name || "---"}
                  </span>
                </td>

                {/* Cameraman */}
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="text-[12px] text-slate-600">{video.cameraman?.name || "---"}</span>
                </td>

                {/* Status */}
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium border ${
                      video.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ml-1.5 ${
                        video.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    ></span>
                    {video.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="text-[12px] text-slate-500 font-mono">
                    {toPersianDigits(convertToPersianTime(video.createdAt, "YYYY/MM/DD"))}
                  </span>
                </td>

                {/* Views */}
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="text-[12px] text-slate-600 font-mono">
                    {toPersianDigits(String(video.views || 0))}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-2.5 whitespace-nowrap text-left">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/dashboard/videos/edit/${video.slug}`}
                      className="p-1.5 text-slate-400 hover:text-[#007acc] hover:bg-blue-50 rounded transition-all"
                      title="ویرایش"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </Link>
                    <button
                      onClick={() => openDeleteModal(video)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                      title="حذف"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Functional Grid List */}
      <div className="lg:hidden grid grid-cols-1 gap-3">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-white border border-slate-200 rounded-md p-3 flex flex-col gap-3"
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-slate-100 rounded border border-slate-200 overflow-hidden flex-shrink-0">
                <img
                  src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${
                    video.coverImage?.mobile
                  }`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-800 truncate">{video.title}</h3>
                  {video.subtitle && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{video.subtitle}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border ${
                      video.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {video.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono border-r border-slate-200 pr-2 mr-auto">
                    {toPersianDigits(convertToPersianTime(video.createdAt, "YYYY/MM/DD"))}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Actions - Full Width Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Link
                to={`/dashboard/videos/edit/${video.slug}`}
                className="flex items-center justify-center py-1.5 text-[12px] font-medium text-[#007acc] bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors"
              >
                ویرایش
              </Link>
              <button
                onClick={() => openDeleteModal(video)}
                className="flex items-center justify-center py-1.5 text-[12px] font-medium text-red-600 bg-red-50 border border-red-100 rounded hover:bg-red-100 transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Compact & Bordered */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="hidden sm:flex items-center gap-2 text-[12px] text-slate-500">
            <span>نمایش</span>
            <span className="font-mono font-medium text-slate-700">
              {toPersianDigits((currentPage - 1) * 10 + 1)}
            </span>
            <span>تا</span>
            <span className="font-mono font-medium text-slate-700">
              {toPersianDigits(Math.min(currentPage * 10, totalItems))}
            </span>
            <span>از</span>
            <span className="font-mono font-medium text-slate-700">{toPersianDigits(totalItems)}</span>
            <span>ویدئو</span>
          </div>

          <div className="flex items-center gap-1 mr-auto sm:mr-0 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-300 rounded text-[12px] font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              قبلی
            </button>

            <span className="text-[12px] text-slate-600 font-medium sm:hidden">
              {toPersianDigits(currentPage)} / {toPersianDigits(totalPages)}
            </span>

            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-300 rounded text-[12px] font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              بعدی
            </button>
          </div>
        </div>
      )}

      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`آیا از حذف ویدئوی "${selectedVideo?.title}" مطمئن هستید؟`}
      />
    </div>
  );
};

export default VideosListIndex;
