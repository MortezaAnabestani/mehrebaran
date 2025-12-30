import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteGallery, fetchGalleries } from "../../features/galleriesSlice";
import { useDispatch } from "react-redux";
import ConfirmDelete from "../createContent/ConfirmDelete";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

// آیکون‌های SVG داخلی برای کاهش وابستگی و کنترل دقیق استایل
const EditIcon = () => (
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
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
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

const GalleriesListIndex = ({
  galleries,
  loading,
  currentPage,
  totalPages,
  totalItems,
  onNextPage,
  onPrevPage,
}) => {
  const dispatch = useDispatch();
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDeleteModal = (gallery) => {
    setSelectedGallery(gallery);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedGallery) {
      try {
        await dispatch(deleteGallery(selectedGallery._id)).unwrap();
        dispatch(fetchGalleries());
      } catch (error) {
        console.error("خطا در حذف گالری:", error);
      }
    }
    setIsModalOpen(false);
  };

  // Loading State - Minimal
  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col justify-center items-center border border-slate-200 rounded-md bg-slate-50">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#007acc]"></div>
        <p className="mt-3 text-[12px] text-slate-500 font-medium">در حال بارگذاری داده‌ها...</p>
      </div>
    );
  }

  // Empty State - Functional
  if (!galleries || galleries.length === 0) {
    return (
      <div className="w-full p-8 border border-dashed border-slate-300 rounded-md bg-slate-50 text-center">
        <p className="text-[13px] font-medium text-slate-700">داده‌ای یافت نشد</p>
        <p className="mt-1 text-[11px] text-slate-500">برای شروع، یک گالری جدید ایجاد کنید.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Desktop View - Strict Table */}
      <div className="hidden lg:block w-full overflow-hidden border border-slate-200 rounded-md bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {[
                "تصویر",
                "عنوان و توضیحات",
                "دسته‌بندی",
                "عکاس",
                "تعداد",
                "وضعیت",
                "تاریخ ایجاد",
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
            {galleries.map((gallery) => (
              <tr key={gallery._id} className="hover:bg-slate-50/80 transition-colors duration-150">
                {/* Image */}
                <td className="px-4 py-2 whitespace-nowrap w-20">
                  <div className="h-10 w-14 bg-slate-100 rounded border border-slate-200 overflow-hidden">
                    <img
                      src={
                        gallery.images && gallery.images[0]?.desktop
                          ? `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${
                              gallery.images[0].desktop
                            }`
                          : "/assets/images/dashboard/icons/image-placeholder.svg"
                      }
                      alt={gallery.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>

                {/* Title */}
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-800 truncate max-w-[180px]">
                      {gallery.title}
                    </span>
                    {gallery.subtitle && (
                      <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {gallery.subtitle}
                      </span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {gallery.category?.name || "-"}
                  </span>
                </td>

                {/* Photographer */}
                <td className="px-4 py-2 whitespace-nowrap text-[12px] text-slate-600">
                  {gallery.photographer?.name || "-"}
                </td>

                {/* Count */}
                <td className="px-4 py-2 whitespace-nowrap text-[12px] text-slate-600 font-mono">
                  {toPersianDigits(String(gallery.images?.length || 0))}
                </td>

                {/* Status */}
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        gallery.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    ></span>
                    <span className="text-[11px] font-medium text-slate-600">
                      {gallery.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-4 py-2 whitespace-nowrap text-[11px] text-slate-500">
                  {toPersianDigits(convertToPersianTime(gallery.createdAt, "YYYY/MM/DD"))}
                </td>

                {/* Views */}
                <td className="px-4 py-2 whitespace-nowrap text-[12px] text-slate-600 font-mono">
                  {toPersianDigits(String(gallery.views || 0))}
                </td>

                {/* Actions */}
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/dashboard/galleries/edit/${gallery.slug}`}
                      className="p-1.5 text-slate-400 hover:text-[#007acc] hover:bg-blue-50 rounded transition-colors"
                      title="ویرایش"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(gallery)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="حذف"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Data List Style */}
      <div className="lg:hidden flex flex-col gap-2">
        {galleries.map((gallery) => (
          <div
            key={gallery._id}
            className="bg-white border border-slate-200 rounded-md p-3 flex flex-col gap-3"
          >
            {/* Header: Image & Title */}
            <div className="flex gap-3 items-start">
              <img
                src={
                  gallery.images && gallery.images[0]?.mobile
                    ? `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${gallery.images[0].mobile}`
                    : "/assets/images/dashboard/icons/image-placeholder.svg"
                }
                alt={gallery.title}
                className="w-16 h-16 object-cover rounded border border-slate-100 bg-slate-50"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-slate-800 truncate">{gallery.title}</h3>
                {gallery.subtitle && (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{gallery.subtitle}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                      gallery.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    {gallery.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                  </span>
                  <span className="text-[10px] text-slate-400 border-r border-slate-200 pr-2 mr-2">
                    {toPersianDigits(String(gallery.images?.length || 0))} عکس
                  </span>
                </div>
              </div>
            </div>

            {/* Footer: Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
              <span className="text-[10px] text-slate-400">
                {toPersianDigits(convertToPersianTime(gallery.createdAt, "YYYY/MM/DD"))}
              </span>
              <div className="flex gap-2">
                <Link
                  to={`/dashboard/galleries/edit/${gallery.slug}`}
                  className="text-[11px] font-medium text-[#007acc] hover:underline px-2 py-1"
                >
                  ویرایش
                </Link>
                <button
                  onClick={() => openDeleteModal(gallery)}
                  className="text-[11px] font-medium text-red-600 hover:underline px-2 py-1"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Functional Style */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="hidden sm:flex flex-1 items-center justify-between">
            <p className="text-[11px] text-slate-500">
              نمایش{" "}
              <span className="font-medium text-slate-700">
                {toPersianDigits((currentPage - 1) * 10 + 1)}
              </span>{" "}
              تا{" "}
              <span className="font-medium text-slate-700">
                {toPersianDigits(Math.min(currentPage * 10, totalItems))}
              </span>{" "}
              از <span className="font-medium text-slate-700">{toPersianDigits(totalItems)}</span> مورد
            </p>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={onPrevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-r-md border border-slate-300 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                قبلی
              </button>
              <span className="relative inline-flex items-center border-y border-slate-300 bg-white px-4 py-1.5 text-[11px] font-medium text-slate-700">
                {toPersianDigits(currentPage)} / {toPersianDigits(totalPages)}
              </span>
              <button
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-l-md border border-slate-300 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                بعدی
              </button>
            </nav>
          </div>

          {/* Mobile Pagination */}
          <div className="flex sm:hidden justify-between w-full">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              قبلی
            </button>
            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
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
        message={`آیا از حذف گالری "${selectedGallery?.title}" مطمئن هستید؟`}
      />
    </div>
  );
};

export default GalleriesListIndex;
