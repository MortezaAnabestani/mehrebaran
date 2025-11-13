import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonationById, verifyBankTransfer } from "../../features/donationsSlice";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedDonation, loading, error } = useSelector((state) => state.donations);

  const [isVerifying, setIsVerifying] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    dispatch(fetchDonationById(id));
  }, [dispatch, id]);

  const handleApprove = async () => {
    if (window.confirm("آیا از تایید این کمک مالی مطمئن هستید؟")) {
      setIsVerifying(true);
      try {
        await dispatch(verifyBankTransfer({ donationId: id, approve: true })).unwrap();
        alert("کمک مالی با موفقیت تایید شد.");
        dispatch(fetchDonationById(id)); // رفرش اطلاعات
      } catch (error) {
        alert(`خطا در تایید: ${error}`);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("لطفاً دلیل رد را وارد کنید.");
      return;
    }

    setIsVerifying(true);
    try {
      await dispatch(
        verifyBankTransfer({
          donationId: id,
          approve: false,
          rejectionReason: rejectionReason,
        })
      ).unwrap();
      alert("کمک مالی رد شد.");
      setShowRejectModal(false);
      dispatch(fetchDonationById(id)); // رفرش اطلاعات
    } catch (error) {
      alert(`خطا در رد: ${error}`);
    } finally {
      setIsVerifying(false);
    }
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
    return <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      online: "پرداخت آنلاین",
      bank_transfer: "انتقال بانکی",
      cash: "نقدی",
    };
    return methodMap[method] || method;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-md p-6">
        <p className="text-center">در حال بارگذاری...</p>
      </div>
    );
  }

  if (error || !selectedDonation) {
    return (
      <div className="bg-white rounded-md p-6">
        <p className="text-center text-red-600">خطا در بارگذاری اطلاعات: {error}</p>
        <button onClick={() => navigate("/dashboard/donations")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mx-auto block">
          بازگشت به لیست
        </button>
      </div>
    );
  }

  const donation = selectedDonation;
  const needsVerification = donation.paymentMethod === "bank_transfer" && donation.status === "pending" && donation.receipt;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">جزئیات کمک مالی</h1>
              <p className="text-sm text-gray-600 mt-1">کد پیگیری: {donation.trackingCode || "-"}</p>
            </div>
            <div className="text-left">
              {getStatusBadge(donation.status)}
            </div>
          </div>
        </div>

        {/* اطلاعات اصلی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* اطلاعات پروژه */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">اطلاعات پروژه</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 text-sm">نام پروژه:</span>
                <p className="font-medium">{donation.project?.title || "-"}</p>
              </div>
            </div>
          </div>

          {/* اطلاعات پرداخت */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">اطلاعات پرداخت</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 text-sm">مبلغ:</span>
                <p className="font-bold text-green-600 text-xl">{toPersianDigits(donation.amount.toLocaleString("fa-IR"))} تومان</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">روش پرداخت:</span>
                <p className="font-medium">{getPaymentMethodLabel(donation.paymentMethod)}</p>
              </div>
              {donation.transactionId && (
                <div>
                  <span className="text-gray-600 text-sm">شماره تراکنش:</span>
                  <p className="font-medium">{donation.transactionId}</p>
                </div>
              )}
              {donation.refId && (
                <div>
                  <span className="text-gray-600 text-sm">شماره پیگیری:</span>
                  <p className="font-medium">{donation.refId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* اطلاعات کمک‌کننده */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">اطلاعات کمک‌کننده</h2>
          {donation.donorInfo?.isAnonymous ? (
            <p className="text-gray-600">کمک‌کننده به صورت ناشناس ثبت شده است.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-600 text-sm">نام و نام خانوادگی:</span>
                <p className="font-medium">{donation.donorInfo?.fullName || donation.donor?.name || "-"}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">ایمیل:</span>
                <p className="font-medium">{donation.donorInfo?.email || donation.donor?.email || "-"}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">شماره موبایل:</span>
                <p className="font-medium">{donation.donorInfo?.mobile || donation.donor?.mobile || "-"}</p>
              </div>
            </div>
          )}

          {donation.message && (
            <div className="mt-4">
              <span className="text-gray-600 text-sm">پیام:</span>
              <p className="mt-1 p-3 bg-gray-50 rounded">{donation.message}</p>
            </div>
          )}

          {donation.dedicatedTo && (
            <div className="mt-4">
              <span className="text-gray-600 text-sm">تقدیم به:</span>
              <p className="mt-1 p-3 bg-gray-50 rounded">{donation.dedicatedTo}</p>
            </div>
          )}
        </div>

        {/* رسید بانکی */}
        {donation.receipt && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">رسید بانکی</h2>
            <div className="space-y-4">
              <div>
                <img
                  src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${donation.receipt.image}`}
                  alt="رسید بانکی"
                  className="max-w-full h-auto rounded border"
                />
              </div>
              <div>
                <span className="text-gray-600 text-sm">تاریخ آپلود:</span>
                <p className="font-medium">{toPersianDigits(convertToPersianTime(donation.receipt.uploadedAt, "YYYY/MM/DD - HH:mm"))}</p>
              </div>
              {donation.receipt.verified && donation.receipt.verifiedAt && (
                <div>
                  <span className="text-gray-600 text-sm">تاریخ تایید:</span>
                  <p className="font-medium">{toPersianDigits(convertToPersianTime(donation.receipt.verifiedAt, "YYYY/MM/DD - HH:mm"))}</p>
                </div>
              )}
              {donation.receipt.rejectionReason && (
                <div>
                  <span className="text-gray-600 text-sm">دلیل رد:</span>
                  <p className="mt-1 p-3 bg-red-50 text-red-800 rounded">{donation.receipt.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* دکمه‌های تایید/رد */}
            {needsVerification && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApprove}
                  disabled={isVerifying}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isVerifying ? "در حال تایید..." : "تایید رسید"}
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isVerifying}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  رد رسید
                </button>
              </div>
            )}
          </div>
        )}

        {/* گواهی */}
        {donation.certificateUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">گواهی کمک مالی</h2>
            <a
              href={donation.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              مشاهده و دانلود گواهی
            </a>
          </div>
        )}

        {/* تاریخچه */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">تاریخچه</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">تاریخ ثبت:</span> {toPersianDigits(convertToPersianTime(donation.createdAt, "YYYY/MM/DD - HH:mm"))}</p>
            {donation.completedAt && (
              <p><span className="font-medium">تاریخ تکمیل:</span> {toPersianDigits(convertToPersianTime(donation.completedAt, "YYYY/MM/DD - HH:mm"))}</p>
            )}
            {donation.verifiedAt && (
              <p><span className="font-medium">تاریخ تایید:</span> {toPersianDigits(convertToPersianTime(donation.verifiedAt, "YYYY/MM/DD - HH:mm"))}</p>
            )}
          </div>
        </div>

        {/* دکمه بازگشت */}
        <button
          onClick={() => navigate("/dashboard/donations")}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          بازگشت به لیست
        </button>
      </div>

      {/* مودال رد */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">رد کمک مالی</h3>
            <p className="text-sm text-gray-600 mb-4">لطفاً دلیل رد را وارد کنید:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border rounded mb-4"
              rows="4"
              placeholder="دلیل رد..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={isVerifying || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isVerifying ? "در حال پردازش..." : "تایید رد"}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;
