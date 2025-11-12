import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVolunteerById,
  approveVolunteer,
  rejectVolunteer,
  updateVolunteer,
} from "../../features/volunteersSlice";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const VolunteerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedVolunteer, loading, error } = useSelector((state) => state.volunteers);

  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    hoursContributed: 0,
    tasksCompleted: 0,
    status: "",
  });

  useEffect(() => {
    dispatch(fetchVolunteerById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedVolunteer) {
      setUpdateData({
        hoursContributed: selectedVolunteer.hoursContributed || 0,
        tasksCompleted: selectedVolunteer.tasksCompleted || 0,
        status: selectedVolunteer.status,
      });
    }
  }, [selectedVolunteer]);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await dispatch(approveVolunteer({ id, message: approvalMessage })).unwrap();
      alert("داوطلب با موفقیت تایید شد.");
      setShowApproveModal(false);
      dispatch(fetchVolunteerById(id)); // رفرش اطلاعات
    } catch (error) {
      alert(`خطا در تایید: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("لطفاً دلیل رد را وارد کنید.");
      return;
    }

    setIsProcessing(true);
    try {
      await dispatch(rejectVolunteer({ id, reason: rejectionReason })).unwrap();
      alert("ثبت‌نام رد شد.");
      setShowRejectModal(false);
      dispatch(fetchVolunteerById(id)); // رفرش اطلاعات
    } catch (error) {
      alert(`خطا در رد: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async () => {
    setIsProcessing(true);
    try {
      await dispatch(updateVolunteer({ id, data: updateData })).unwrap();
      alert("اطلاعات با موفقیت بروزرسانی شد.");
      setShowUpdateModal(false);
      dispatch(fetchVolunteerById(id)); // رفرش اطلاعات
    } catch (error) {
      alert(`خطا در بروزرسانی: ${error}`);
    } finally {
      setIsProcessing(false);
    }
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
    return <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-md p-6">
        <p className="text-center">در حال بارگذاری...</p>
      </div>
    );
  }

  if (error || !selectedVolunteer) {
    return (
      <div className="bg-white rounded-md p-6">
        <p className="text-center text-red-600">خطا در بارگذاری اطلاعات: {error}</p>
        <button onClick={() => navigate("/dashboard/volunteers")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mx-auto block">
          بازگشت به لیست
        </button>
      </div>
    );
  }

  const volunteer = selectedVolunteer;
  const canApprove = volunteer.status === "pending";
  const canUpdate = ["approved", "active"].includes(volunteer.status);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">جزئیات ثبت‌نام داوطلبانه</h1>
              <p className="text-sm text-gray-600 mt-1">تاریخ ثبت‌نام: {toPersianDigits(convertToPersianTime(volunteer.createdAt, "YYYY/MM/DD - HH:mm"))}</p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(volunteer.status)}
              {canUpdate && (
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  بروزرسانی اطلاعات
                </button>
              )}
            </div>
          </div>
        </div>

        {/* اطلاعات اصلی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* اطلاعات داوطلب */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">اطلاعات داوطلب</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 text-sm">نام و نام خانوادگی:</span>
                <p className="font-medium">{volunteer.volunteer?.name || "-"}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">ایمیل:</span>
                <p className="font-medium">{volunteer.volunteer?.email || "-"}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">شماره موبایل:</span>
                <p className="font-medium">{volunteer.volunteer?.mobile || "-"}</p>
              </div>
            </div>
          </div>

          {/* اطلاعات پروژه */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">اطلاعات پروژه</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 text-sm">نام پروژه:</span>
                <p className="font-medium">{volunteer.project?.title || "-"}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">توضیحات:</span>
                <p className="text-sm">{volunteer.project?.description || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* مهارت‌ها و در دسترس بودن */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* مهارت‌ها */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">مهارت‌ها</h2>
            {volunteer.skills && volunteer.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">مهارتی ثبت نشده است.</p>
            )}
          </div>

          {/* در دسترس بودن */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">در دسترس بودن</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 text-sm">ساعات در دسترس:</span>
                <p className="font-medium">{toPersianDigits(volunteer.availableHours || 0)} ساعت/هفته</p>
              </div>
              {volunteer.availability && (
                <div>
                  <span className="text-gray-600 text-sm">روزها:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {volunteer.availability.days && volunteer.availability.days.length > 0 ? (
                      volunteer.availability.days.map((day, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {day}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">نامشخص</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* آمار مشارکت */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">آمار مشارکت</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <p className="text-2xl font-bold text-blue-600">{toPersianDigits(volunteer.hoursContributed || 0)}</p>
              <p className="text-sm text-gray-600 mt-1">ساعات مشارکت</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <p className="text-2xl font-bold text-green-600">{toPersianDigits(volunteer.tasksCompleted || 0)}</p>
              <p className="text-sm text-gray-600 mt-1">وظایف تکمیل شده</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <p className="text-2xl font-bold text-purple-600">{getStatusBadge(volunteer.status)}</p>
              <p className="text-sm text-gray-600 mt-1">وضعیت فعلی</p>
            </div>
          </div>
        </div>

        {/* مخاطب اضطراری */}
        {volunteer.emergencyContact && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">مخاطب اضطراری</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600 text-sm">نام:</span>
                <p className="font-medium">{volunteer.emergencyContact.name || "-"}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">شماره تماس:</span>
                <p className="font-medium">{volunteer.emergencyContact.phone || "-"}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">نسبت:</span>
                <p className="font-medium">{volunteer.emergencyContact.relationship || "-"}</p>
              </div>
            </div>
          </div>
        )}

        {/* گواهی */}
        {volunteer.certificateUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">گواهی داوطلبی</h2>
            <a
              href={volunteer.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              مشاهده و دانلود گواهی
            </a>
          </div>
        )}

        {/* دکمه‌های عملیات */}
        {canApprove && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setShowApproveModal(true)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              تایید ثبت‌نام
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              رد ثبت‌نام
            </button>
          </div>
        )}

        {/* دکمه بازگشت */}
        <button
          onClick={() => navigate("/dashboard/volunteers")}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          بازگشت به لیست
        </button>
      </div>

      {/* مودال تایید */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">تایید ثبت‌نام</h3>
            <p className="text-sm text-gray-600 mb-4">پیام تایید (اختیاری):</p>
            <textarea
              value={approvalMessage}
              onChange={(e) => setApprovalMessage(e.target.value)}
              className="w-full p-3 border rounded mb-4"
              rows="4"
              placeholder="پیام تایید برای داوطلب..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? "در حال پردازش..." : "تایید"}
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setApprovalMessage("");
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال رد */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">رد ثبت‌نام</h3>
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
                disabled={isProcessing || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isProcessing ? "در حال پردازش..." : "تایید رد"}
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

      {/* مودال بروزرسانی */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">بروزرسانی اطلاعات</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ساعات مشارکت</label>
                <input
                  type="number"
                  value={updateData.hoursContributed}
                  onChange={(e) => setUpdateData({ ...updateData, hoursContributed: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">وظایف تکمیل شده</label>
                <input
                  type="number"
                  value={updateData.tasksCompleted}
                  onChange={(e) => setUpdateData({ ...updateData, tasksCompleted: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">وضعیت</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="approved">تایید شده</option>
                  <option value="active">فعال</option>
                  <option value="completed">تکمیل شده</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdate}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? "در حال پردازش..." : "ذخیره"}
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
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

export default VolunteerDetails;
