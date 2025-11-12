import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteVolunteer, fetchVolunteers } from "../../features/volunteersSlice";
import { useDispatch } from "react-redux";
import ConfirmDelete from "../createContent/ConfirmDelete";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const VolunteersListIndex = ({ volunteers, loading, currentPage, totalPages, totalItems, onNextPage, onPrevPage }) => {
  const dispatch = useDispatch();
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDeleteModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedVolunteer) {
      try {
        await dispatch(deleteVolunteer(selectedVolunteer._id)).unwrap();
        dispatch(fetchVolunteers());
      } catch (error) {
        console.error("خطا در حذف داوطلب:", error);
      }
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "در انتظار تایید", class: "bg-yellow-100 text-yellow-800" },
      approved: { label: "تایید شده", class: "bg-green-100 text-green-800" },
      active: { label: "فعال", class: "bg-blue-100 text-blue-800" },
      completed: { label: "تکمیل شده", class: "bg-purple-100 text-purple-800" },
      withdrawn: { label: "انصراف داده", class: "bg-gray-100 text-gray-800" },
      rejected: { label: "رد شده", class: "bg-red-100 text-red-800" },
    };
    const statusInfo = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-800" };
    return <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!volunteers || volunteers.length === 0) {
    return (
      <div className="mt-5 p-4 bg-white rounded-md">
        <p className="font-bold">هنوز ثبت‌نام داوطلبانه‌ای ثبت نشده است</p>
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام داوطلب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">پروژه</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مهارت‌ها</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ساعات موجود</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ ثبت‌نام</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {volunteer.volunteer?.name || "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {volunteer.volunteer?.email || "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {volunteer.project?.title || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {volunteer.skills && volunteer.skills.length > 0 ? (
                        volunteer.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                      {volunteer.skills && volunteer.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{volunteer.skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {toPersianDigits(volunteer.availableHours || 0)} ساعت/هفته
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(volunteer.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {toPersianDigits(convertToPersianTime(volunteer.createdAt, "YYYY/MM/DD"))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/volunteers/${volunteer._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <img
                          className="w-5 h-5"
                          src="/assets/images/dashboard/icons/eye.svg"
                          alt="مشاهده"
                          title="مشاهده جزئیات"
                        />
                      </Link>
                      <button onClick={() => openDeleteModal(volunteer)} className="text-red-600 hover:text-red-900">
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
        {volunteers.map((volunteer) => (
          <div key={volunteer._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm">{volunteer.volunteer?.name || "-"}</p>
                <p className="text-xs text-gray-600 mt-1">{volunteer.project?.title || "-"}</p>
              </div>
              {getStatusBadge(volunteer.status)}
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="font-medium">ساعات موجود:</span>{" "}
                {toPersianDigits(volunteer.availableHours || 0)} ساعت/هفته
              </p>
              <div>
                <span className="font-medium">مهارت‌ها:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {volunteer.skills && volunteer.skills.length > 0 ? (
                    volunteer.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">ندارد</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                to={`/dashboard/volunteers/${volunteer._id}`}
                className="flex-1 text-center py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                مشاهده جزئیات
              </Link>
              <button
                onClick={() => openDeleteModal(volunteer)}
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
                از <span className="font-medium">{toPersianDigits(totalItems)}</span> داوطلب
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
        message={`آیا از حذف ثبت‌نام داوطلبانه "${selectedVolunteer?.volunteer?.name}" مطمئن هستید؟`}
      />
    </div>
  );
};

export default VolunteersListIndex;
