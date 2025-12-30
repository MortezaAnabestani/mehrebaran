import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdmins, deleteAdmin } from "../../features/adminsSlice";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const Admins = () => {
  const dispatch = useDispatch();
  const { admins, loading, error } = useSelector((state) => state.admins);
  const [selectedThing, setSelectedThing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const openDeleteModal = (admin) => {
    setSelectedThing(admin);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedThing) {
      try {
        await dispatch(deleteAdmin(selectedThing._id)).unwrap();
        dispatch(fetchAdmins());
      } catch (error) {
        console.error("خطا در حذف ادمین:", error);
      }
    }
    setIsModalOpen(false);
  };

  // Utility for Image URL
  const getAvatarUrl = (avatar) =>
    avatar
      ? `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${avatar}`
      : "/assets/images/dashboard/icons/male_user.svg";

  return (
    <div className="w-full bg-white min-h-screen text-slate-800 font-sans">
      {/* Header Section */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-end px-4 pt-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">مدیریت مدیران</h1>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">لیست دسترسی‌ها و سوابق ورود به سیستم</p>
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
          TOTAL: {toPersianDigits(admins?.length || 0)}
        </div>
      </div>

      {/* Loading/Error States */}
      <div className="px-4">
        {loading && (
          <div className="w-full p-4 border border-slate-200 rounded-md bg-slate-50 text-center text-xs text-slate-500 animate-pulse">
            <span className="font-mono">LOADING_DATA...</span>
          </div>
        )}
        {error && (
          <div className="w-full p-3 border border-red-200 rounded-md bg-red-50 text-red-700 text-xs font-medium">
            خطا: {error}
          </div>
        )}
      </div>

      {/* Desktop Data Grid (Functional Style) */}
      <div className="hidden lg:block px-4">
        <div className="w-full border border-slate-200 rounded-md overflow-hidden">
          {/* Grid Header */}
          <div className="grid grid-cols-12 gap-2 bg-slate-50 border-b border-slate-200 py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-3">کاربر / شناسه</div>
            <div className="col-span-2">نقش و دسترسی</div>
            <div className="col-span-2">تاریخ عضویت</div>
            <div className="col-span-4">آخرین فعالیت‌ها (IP Log)</div>
            <div className="col-span-1 text-left">عملیات</div>
          </div>

          {/* Grid Rows */}
          <div className="divide-y divide-slate-100">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="grid grid-cols-12 gap-2 py-3 px-4 items-start hover:bg-slate-50/80 transition-colors group text-sm"
              >
                {/* Col 1: User Info */}
                <div className="col-span-3 flex gap-3 items-center">
                  <Link to={`edit/${admin._id}`} className="shrink-0">
                    <img
                      src={getAvatarUrl(admin.avatar)}
                      alt={admin.name}
                      className="w-10 h-10 rounded-md object-cover border border-slate-200 group-hover:border-[#007acc]/50 transition-colors"
                    />
                  </Link>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 truncate text-[13px]">{admin.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono truncate">{admin.username}</span>
                    <span className="text-[10px] text-slate-400 truncate">{admin.email}</span>
                  </div>
                </div>

                {/* Col 2: Role */}
                <div className="col-span-2 flex items-center h-full">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium border ${
                      admin.role === "admin"
                        ? "bg-slate-100 text-slate-600 border-slate-200"
                        : "bg-[#007acc]/10 text-[#007acc] border-[#007acc]/20"
                    }`}
                  >
                    {admin.role === "admin" ? "ادمین محدود" : "مدیر کل"}
                  </span>
                </div>

                {/* Col 3: Date */}
                <div className="col-span-2 flex items-center h-full">
                  <span className="text-[11px] font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    {toPersianDigits(convertToPersianTime(admin.createdAt, "YYYY/MM/DD"))}
                  </span>
                </div>

                {/* Col 4: Logs (Compact) */}
                <div className="col-span-4 flex flex-col gap-1">
                  {admin?.loginHistory?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span className="text-slate-700">{item?.ip}</span>
                      <span className="text-slate-400 border-r border-slate-200 pr-2 mr-1">
                        {toPersianDigits(convertToPersianTime(item?.timestamp, "MM/DD - HH:mm"))}
                      </span>
                    </div>
                  ))}
                  {admin?.loginHistory?.length === 0 && (
                    <span className="text-[10px] text-slate-300 italic">بدون سابقه</span>
                  )}
                </div>

                {/* Col 5: Actions */}
                <div className="col-span-1 flex justify-end items-center h-full gap-1">
                  <Link
                    to={`edit/${admin._id}`}
                    className="p-1.5 rounded-md text-slate-400 hover:text-[#007acc] hover:bg-[#007acc]/5 transition-all border border-transparent hover:border-[#007acc]/20"
                    title="ویرایش"
                  >
                    <img
                      src="/assets/images/dashboard/icons/replace.svg"
                      className="w-4 h-4 opacity-70 hover:opacity-100"
                      alt="edit"
                    />
                  </Link>
                  <button
                    onClick={() => openDeleteModal(admin)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-200"
                    title="حذف"
                  >
                    <img
                      src="/assets/images/dashboard/icons/trash.svg"
                      className="w-4 h-4 opacity-70 hover:opacity-100"
                      alt="delete"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View (Card Stack) */}
      <div className="lg:hidden px-4 flex flex-col gap-3">
        {admins.map((admin) => (
          <div
            key={admin._id}
            className="bg-white border border-slate-200 rounded-md p-3 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-3">
                <img
                  src={getAvatarUrl(admin.avatar)}
                  alt={admin.name}
                  className="w-10 h-10 rounded-md object-cover bg-slate-100"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{admin.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{admin.username}</p>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded border ${
                  admin.role === "admin"
                    ? "bg-slate-50 border-slate-200 text-slate-500"
                    : "bg-blue-50 border-blue-100 text-[#007acc]"
                }`}
              >
                {admin.role === "admin" ? "ادمین" : "مدیر"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400">ایمیل</span>
                <span className="font-mono text-slate-700">{admin.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400">تاریخ عضویت</span>
                <span className="font-mono text-slate-700">
                  {toPersianDigits(convertToPersianTime(admin.createdAt, "YYYY/MM/DD"))}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded border border-slate-100 p-2">
              <p className="text-[10px] text-slate-400 mb-1">آخرین ورود:</p>
              {admin?.loginHistory?.[0] ? (
                <div className="flex justify-between text-[10px] font-mono text-slate-600">
                  <span>{admin.loginHistory[0].ip}</span>
                  <span>
                    {toPersianDigits(
                      convertToPersianTime(admin.loginHistory[0].timestamp, "YYYY/MM/DD HH:mm")
                    )}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-300">---</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <Link
                to={`edit/${admin._id}`}
                className="flex items-center justify-center gap-2 py-2 rounded-md border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 hover:text-[#007acc] hover:border-[#007acc]/30 transition-all"
              >
                ویرایش
              </Link>
              <button
                onClick={() => openDeleteModal(admin)}
                className="flex items-center justify-center gap-2 py-2 rounded-md border border-red-100 text-red-600 bg-red-50/50 text-xs font-medium hover:bg-red-100 transition-all"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`آیا از حذف "${selectedThing?.name}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
      />
    </div>
  );
};

export default Admins;
