import { useEffect, useState } from "react";
import api from "../../services/api";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";
import {
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquare,
  Clock,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0 });
  const [activeTab, setActiveTab] = useState("pending"); // 'all' or 'pending'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [page, activeTab]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const endpoint =
        activeTab === "pending" ? `/comments/admin/pending?page=${page}` : `/comments?page=${page}`;

      const { data } = await api.get(endpoint);

      if (activeTab === "pending") {
        setComments(data.comments || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setComments(data.data || []);
        setTotalPages(data.totalPages || 1);
      }

      // دریافت آمار کلی (در صورت وجود API)
      setStats((prev) => ({ ...prev, total: data.totalCount || data.data?.length || 0 }));
    } catch (err) {
      console.error("خطا در دریافت نظرات:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await api.patch(`/comments/admin/approve/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("خطا در تایید:", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("آیا از حذف این مورد اطمینان دارید؟")) return;
    try {
      setActionLoading(id);
      await api.patch(`/comments/admin/reject/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("خطا در رد:", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 text-[#1e1e1e] bg-[#ffffff]">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <MessageSquare className="text-[#007acc]" />
            مدیریت نظرات
          </h2>
          <p className="text-sm text-gray-500 mt-1">نظرات کاربران و پاسخ‌های مقالات را مدیریت کنید.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-50 border-r-4 border-[#007acc] p-3 rounded-[8px] shadow-sm min-w-[120px]">
            <p className="text-xs text-gray-600">کل نظرات</p>
            <p className="text-xl font-bold text-[#007acc]">{toPersianDigits(stats.total)}</p>
          </div>
          <div className="bg-orange-50 border-r-4 border-[#f7891b] p-3 rounded-[8px] shadow-sm min-w-[120px]">
            <p className="text-xs text-gray-600">در انتظار</p>
            <p className="text-xl font-bold text-[#f7891b]">{toPersianDigits(comments.length)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab("pending");
            setPage(1);
          }}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === "pending"
              ? "border-b-2 border-[#007acc] text-[#007acc]"
              : "text-gray-500 hover:text-[#007acc]"
          }`}
        >
          در انتظار تایید
        </button>
        <button
          onClick={() => {
            setActiveTab("all");
            setPage(1);
          }}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === "all"
              ? "border-b-2 border-[#007acc] text-[#007acc]"
              : "text-gray-500 hover:text-[#007acc]"
          }`}
        >
          همه نظرات
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007acc]"></div>
          <p className="text-gray-500 animate-pulse">در حال بارگذاری اطلاعات...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[8px] border-2 border-dashed border-gray-200">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500">هیچ نظری در این بخش یافت نشد.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {comments.map((comment) => (
            <div
              key={comment?._id}
              className={`relative group bg-white border rounded-[8px] shadow-soft transition-all duration-300 hover:shadow-md ${
                comment?.parent ? "mr-8 md:mr-12 border-r-4 border-r-[#f7891b]/30" : "border-gray-100"
              }`}
            >
              {/* Comment Header */}
              <div className="p-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#007acc]/10 flex items-center justify-center text-[#007acc]">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{comment?.user || "کاربر مهمان"}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {toPersianDigits(convertToPersianTime(comment?.createdAt, "YYYY/MM/DD HH:mm"))}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={12} />
                        {comment?.article?.title || "بدون عنوان"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {comment.approved ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">
                      <CheckCircle size={12} /> تایید شده
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-100">
                      <Clock size={12} /> در انتظار
                    </span>
                  )}
                </div>
              </div>

              {/* Comment Body */}
              <div className="p-4">
                {comment?.parent && (
                  <div className="mb-3 p-2 bg-gray-50 rounded text-[11px] text-gray-500 border-r-2 border-[#f7891b]">
                    در پاسخ به <span className="font-bold text-gray-700">{comment?.parent?.user}</span>:
                    <span className="italic opacity-80 block mt-1 line-clamp-1">
                      "{comment?.parent?.content}"
                    </span>
                  </div>
                )}
                <p className="text-sm leading-7 text-gray-800 whitespace-pre-line">{comment.content}</p>
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-gray-50/50 flex justify-end items-center gap-3 rounded-b-[8px]">
                {!comment.approved && (
                  <button
                    onClick={() => handleApprove(comment._id)}
                    disabled={actionLoading === comment._id}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#007acc] hover:bg-[#005fa3] text-white text-xs font-medium rounded-[8px] transition-colors disabled:opacity-50"
                  >
                    {actionLoading === comment._id ? (
                      "..."
                    ) : (
                      <>
                        <CheckCircle size={14} /> تایید نظر
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleReject(comment._id)}
                  disabled={actionLoading === comment._id}
                  className="flex items-center gap-2 px-4 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-[8px] transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="p-2 border rounded-[8px] hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-[8px] text-sm font-bold transition-all ${
                  page === i + 1
                    ? "bg-[#007acc] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#007acc]"
                }`}
              >
                {toPersianDigits(i + 1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 border rounded-[8px] hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;
