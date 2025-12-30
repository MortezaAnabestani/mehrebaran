import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchNeedsForAdmin, deleteNeed } from "../../features/needsSlice";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const Needs = () => {
  const dispatch = useDispatch();
  const { needs, loading, totalPages, total } = useSelector((state) => state.needs);

  const [filters, setFilters] = useState({
    status: "",
    urgencyLevel: "",
    searchQuery: "",
    limit: 10,
    page: 1,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    needId: null,
    needTitle: "",
  });

  useEffect(() => {
    const loadNeeds = async () => {
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
        };
        if (filters.status) params.status = filters.status;
        if (filters.urgencyLevel) params.urgencyLevel = filters.urgencyLevel;
        if (filters.searchQuery) params.title = filters.searchQuery;

        await dispatch(fetchNeedsForAdmin(params)).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری نیازها:", error);
      }
    };
    loadNeeds();
  }, [dispatch, filters.page, filters.limit, filters.status, filters.urgencyLevel, filters.searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDelete = (id, title) => {
    setDeleteModal({ isOpen: true, needId: id, needTitle: title });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteNeed(deleteModal.needId)).unwrap();
      setDeleteModal({ isOpen: false, needId: null, needTitle: "" });
    } catch (error) {
      console.error("خطا در حذف نیاز:", error);
    }
  };

  // Utility for Status Styles
  const getStatusStyle = (status) => {
    const styles = {
      draft: "bg-slate-100 text-slate-600 border-slate-200",
      pending: "bg-amber-50 text-amber-600 border-amber-200",
      under_review: "bg-blue-50 text-blue-600 border-blue-200",
      approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
      in_progress: "bg-indigo-50 text-indigo-600 border-indigo-200",
      completed: "bg-teal-50 text-teal-600 border-teal-200",
      rejected: "bg-red-50 text-red-600 border-red-200",
      archived: "bg-slate-100 text-slate-500 border-slate-200",
      cancelled: "bg-gray-100 text-gray-500 border-gray-200",
    };
    return styles[status] || "bg-slate-100 text-slate-600 border-slate-200";
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      draft: "پیش‌نویس",
      pending: "در انتظار",
      under_review: "بررسی",
      approved: "تایید شده",
      in_progress: "در جریان",
      completed: "تکمیل",
      rejected: "رد شده",
      archived: "آرشیو",
      cancelled: "لغو",
    };
    return statusMap[status] || status;
  };

  const getUrgencyStyle = (level) => {
    const styles = {
      low: "text-slate-500 bg-slate-100",
      medium: "text-amber-600 bg-amber-50",
      high: "text-orange-600 bg-orange-50",
      critical: "text-red-600 bg-red-50 font-bold",
    };
    return styles[level] || "text-slate-500 bg-slate-100";
  };

  const getUrgencyLabel = (level) => {
    const map = { low: "کم", medium: "متوسط", high: "زیاد", critical: "بحرانی" };
    return map[level] || level;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans text-right" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">مدیریت نیازها</h1>
          <p className="text-[12px] text-slate-500 mt-1">لیست و مدیریت درخواست‌های ثبت شده در سیستم</p>
        </div>
        <Link to="/dashboard/needs/create">
          <button className="flex items-center gap-2 bg-[#007acc] hover:bg-[#0062a3] text-white text-[12px] font-medium px-4 py-2 rounded-md transition-colors shadow-sm">
            <PlusIcon className="w-4 h-4" />
            <span>ایجاد نیاز جدید</span>
          </button>
        </Link>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white border border-slate-200 rounded-md p-3 mb-4 shadow-sm">
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="col-span-12 md:col-span-4 relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[12px] rounded-md focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] block pr-9 pl-2.5 py-2 outline-none transition-all placeholder:text-slate-400"
              placeholder="جستجو در عنوان..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="col-span-6 md:col-span-3">
            <div className="relative">
              <select
                className="w-full bg-white border border-slate-200 text-slate-700 text-[12px] rounded-md focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] block p-2 outline-none appearance-none"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="draft">پیش‌نویس</option>
                <option value="pending">در انتظار</option>
                <option value="under_review">در حال بررسی</option>
                <option value="approved">تایید شده</option>
                <option value="in_progress">در حال انجام</option>
                <option value="completed">تکمیل شده</option>
                <option value="rejected">رد شده</option>
              </select>
              <FunnelIcon className="w-3 h-3 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Urgency Filter */}
          <div className="col-span-6 md:col-span-3">
            <select
              className="w-full bg-white border border-slate-200 text-slate-700 text-[12px] rounded-md focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] block p-2 outline-none"
              value={filters.urgencyLevel}
              onChange={(e) => handleFilterChange("urgencyLevel", e.target.value)}
            >
              <option value="">همه فوریت‌ها</option>
              <option value="low">کم</option>
              <option value="medium">متوسط</option>
              <option value="high">زیاد</option>
              <option value="critical">بحرانی</option>
            </select>
          </div>

          {/* Limit */}
          <div className="col-span-12 md:col-span-2 flex justify-end">
            <select
              className="bg-slate-50 border border-slate-200 text-slate-700 text-[12px] rounded-md focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] block p-2 outline-none w-full md:w-auto"
              value={filters.limit}
              onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
            >
              <option value="5">5 ردیف</option>
              <option value="10">10 ردیف</option>
              <option value="20">20 ردیف</option>
              <option value="50">50 ردیف</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#007acc]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    عنوان نیاز
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-32">
                    وضعیت
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-24">
                    فوریت
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-24 text-center">
                    حامیان
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-32">
                    پیشرفت
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-32 text-left">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {needs && needs.length > 0 ? (
                  needs.map((need) => (
                    <tr key={need._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-2.5">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-slate-700 group-hover:text-[#007acc] transition-colors">
                            {need.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                            ID: {need._id.slice(-6)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${getStatusStyle(
                            need.status
                          )}`}
                        >
                          {getStatusLabel(need.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${getUrgencyStyle(
                            need.urgencyLevel
                          )}`}
                        >
                          {getUrgencyLabel(need.urgencyLevel)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="text-[12px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {need.supporters?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#007acc] h-1.5 rounded-full"
                              style={{ width: `${need.overallProgress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 w-8 text-left">
                            {need.overallProgress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Link to={`/dashboard/needs/${need._id}`}>
                            <button
                              className="p-1.5 text-slate-500 hover:text-[#007acc] hover:bg-blue-50 rounded-md transition-colors"
                              title="مشاهده"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                          </Link>
                          <Link to={`/dashboard/needs/edit/${need._id}`}>
                            <button
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              title="ویرایش"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(need._id, need.title)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="حذف"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400 text-[12px]">
                      داده‌ای برای نمایش وجود ندارد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            نمایش {needs?.length || 0} از {total || 0} رکورد
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={filters.page <= 1}
              className="p-1 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-600 px-2">
              صفحه {filters.page} از {totalPages || 1}
            </span>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
              disabled={filters.page >= totalPages}
              className="p-1 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, needId: null, needTitle: "" })}
        onConfirm={confirmDelete}
        title="حذف نیاز"
        message={`آیا از حذف نیاز "${deleteModal.needTitle}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
      />
    </div>
  );
};

export default Needs;
