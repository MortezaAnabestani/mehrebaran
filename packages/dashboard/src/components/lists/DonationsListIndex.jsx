import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteDonation, fetchDonations } from "../../features/donationsSlice";
import { useDispatch } from "react-redux";
import ConfirmDelete from "../createContent/ConfirmDelete";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const DonationsListIndex = ({ donations, loading, currentPage, totalPages, totalItems, onNextPage, onPrevPage }) => {
  const dispatch = useDispatch();
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDeleteModal = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDonation) {
      try {
        await dispatch(deleteDonation(selectedDonation._id)).unwrap();
        dispatch(fetchDonations());
      } catch (error) {
        console.error("خطا در حذف کمک مالی:", error);
      }
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "در انتظار", class: "bg-yellow-100 text-yellow-800" },
      completed: { label: "تکمیل شده", class: "bg-green-100 text-green-800" },
      verified: { label: "تایید شده", class: "bg-blue-100 text-blue-800" },
      failed: { label: "ناموفق", class: "bg-red-100 text-red-800" },
      rejected: { label: "رد شده", class: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-800" };
    return <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      online: "آنلاین",
      bank_transfer: "انتقال بانکی",
      cash: "نقدی",
    };
    return methodMap[method] || method;
  };

  const formatAmount = (amount) => {
    return toPersianDigits(amount.toLocaleString("fa-IR")) + " تومان";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <div className="mt-5 p-4 bg-white rounded-md">
        <p className="font-bold">هنوز کمک مالی ثبت نشده است</p>
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">کد پیگیری</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">پروژه</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مبلغ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">روش پرداخت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">کمک‌کننده</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{donation.trackingCode || "-"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {donation.project?.title || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-semibold">{formatAmount(donation.amount)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{getPaymentMethodLabel(donation.paymentMethod)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(donation.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {donation.donorInfo?.isAnonymous
                        ? "ناشناس"
                        : (donation.donorInfo?.fullName || donation.donor?.name || "-")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {toPersianDigits(convertToPersianTime(donation.createdAt, "YYYY/MM/DD"))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/donations/${donation._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <img
                          className="w-5 h-5"
                          src="/assets/images/dashboard/icons/eye.svg"
                          alt="مشاهده"
                          title="مشاهده جزئیات"
                        />
                      </Link>
                      <button onClick={() => openDeleteModal(donation)} className="text-red-600 hover:text-red-900">
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
        {donations.map((donation) => (
          <div key={donation._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm">{donation.trackingCode}</p>
                <p className="text-xs text-gray-600 mt-1">{donation.project?.title || "-"}</p>
              </div>
              {getStatusBadge(donation.status)}
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <p><span className="font-medium">مبلغ:</span> {formatAmount(donation.amount)}</p>
              <p><span className="font-medium">روش پرداخت:</span> {getPaymentMethodLabel(donation.paymentMethod)}</p>
              <p><span className="font-medium">کمک‌کننده:</span> {donation.donorInfo?.isAnonymous ? "ناشناس" : (donation.donorInfo?.fullName || donation.donor?.name || "-")}</p>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                to={`/dashboard/donations/${donation._id}`}
                className="flex-1 text-center py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                مشاهده جزئیات
              </Link>
              <button
                onClick={() => openDeleteModal(donation)}
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
                از <span className="font-medium">{toPersianDigits(totalItems)}</span> کمک مالی
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
        message={`آیا از حذف کمک مالی "${selectedDonation?.trackingCode}" مطمئن هستید؟`}
      />
    </div>
  );
};

export default DonationsListIndex;
