import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteVideo, fetchVideos } from "../../features/videosSlice";
import { useDispatch } from "react-redux";
import ConfirmDelete from "../createContent/ConfirmDelete";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const VideosListIndex = ({ videos, loading, currentPage, totalPages, totalItems, onNextPage, onPrevPage }) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="mt-5 p-4 bg-white rounded-md">
        <p className="font-bold">هنوز ویدئویی ثبت نشده است</p>
        <p className="mt-2">از این مسیر برای ثبت ویدئو اقدام کنید: ویدئوها ← ایجاد ویدئوی جدید</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden lg:block overflow-hidden">
        <div className="bg-white rounded-md shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تصویر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عنوان</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">دسته‌بندی</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">فیلمبردار</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">بازدید</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videos.map((video) => (
                <tr key={video._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${video.coverImage?.desktop}`}
                      alt={video.title}
                      className="h-16 w-24 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{video.title}</div>
                    {video.subtitle && (
                      <div className="text-xs text-gray-500 max-w-xs truncate">{video.subtitle}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{video.category?.name || "-"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{video.cameraman?.name || "-"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        video.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {video.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {toPersianDigits(convertToPersianTime(video.createdAt, "YYYY/MM/DD"))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {toPersianDigits(video.views || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/videos/edit/${video.slug}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <img
                          className="w-5 h-5"
                          src="/assets/images/dashboard/icons/replace.svg"
                          alt="ویرایش"
                          title="ویرایش"
                        />
                      </Link>
                      <button onClick={() => openDeleteModal(video)} className="text-red-600 hover:text-red-900">
                        <img
                          className="w-5 h-5"
                          src="/assets/images/dashboard/icons/trash.svg"
                          alt="حذف"
                          title="حذف"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {videos.map((video) => (
          <div key={video._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex gap-3">
              <img
                src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${video.coverImage?.mobile}`}
                alt={video.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{video.title}</h3>
                {video.subtitle && <p className="text-xs text-gray-600 mt-1">{video.subtitle}</p>}
                <div className="mt-2 flex gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      video.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {video.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                  </span>
                  <span className="text-gray-500">بازدید: {toPersianDigits(video.views || 0)}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                to={`/dashboard/videos/edit/${video.slug}`}
                className="flex-1 text-center py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                ویرایش
              </Link>
              <button
                onClick={() => openDeleteModal(video)}
                className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-md shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              قبلی
            </button>
            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                نمایش{" "}
                <span className="font-medium">{toPersianDigits((currentPage - 1) * 10 + 1)}</span> تا{" "}
                <span className="font-medium">
                  {toPersianDigits(Math.min(currentPage * 10, totalItems))}
                </span>{" "}
                از <span className="font-medium">{toPersianDigits(totalItems)}</span> ویدئو
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={onPrevPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  قبلی
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  صفحه {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
                </span>
                <button
                  onClick={onNextPage}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  بعدی
                </button>
              </nav>
            </div>
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
