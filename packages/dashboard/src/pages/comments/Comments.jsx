import { useEffect, useState } from "react";
import axios from "axios";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const Comments = () => {
  const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingComments();
    fetchAllComments();
  }, [page, actionLoading]);

  const fetchAllComments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/comments`);
      setAllComments(data.comments);
    } catch (err) {
      console.error("خطا در دریافت نظرات:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingComments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/comments/admin/pending?page=${page}`);
      setComments(data.comments);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("خطا در دریافت نظرات:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await axios.patch(`${BASE_URL}/comments/admin/approve/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("خطا در تایید:", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      await axios.patch(`${BASE_URL}/comments/admin/reject/${id}`);
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

  if (loading) return <p>در حال دریافت نظرات...</p>;

  if (allComments?.length === 0) return <p>هیچ نظری در این صفحه یافت نشد.</p>;

  return (
    <div className="space-y-6 md:w-8/10 md:mx-auto">
      <h2 className="text-xl font-bold">
        نظرات <span className="text-sm font-medium">(تعداد کل: {allComments.length})</span>
      </h2>

      {allComments?.map((comment) => (
        <div
          key={comment?._id}
          className={`border ${
            comment?.parent ? "bg-gray-200 mr-10 border-gray-300" : "border-gray-400"
          } p-2 rounded shadow-sm`}
        >
          <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-between px-2 py-2 border-b-2 border-b-red-600">
            <p className="text-sm text-gray-700">
              <strong>کاربر:</strong> {comment?.user}
            </p>
            <p className="text-sm text-gray-700">
              <strong>تاریخ ایجاد:</strong>
              {toPersianDigits(convertToPersianTime(comment?.createdAt, "YYYY/MM/DD HH:MM"))}
            </p>
            <p className="text-sm text-gray-700">
              <strong>مقالۀ مرتبط:</strong> {comment?.article?.title}
            </p>
          </div>

          <p className="text-sm pt-2">{comment.content}</p>
          <div className="w-full flex flex-col md:flex-row gap-2 mt-5 items-center justify-between border-t-2 border-gray-300">
            {comment?.parent && (
              <p className="text-xs/5 pt-2">
                این نظر در پاسخ به <span className="font-bold"> {comment?.parent?.user} </span> به تاریخ
                <span className="font-bold">
                  {toPersianDigits(convertToPersianTime(comment?.parent?.createdAt, "YYYY/MM/DD HH:MM"))}
                </span>
                داده شده است
              </p>
            )}
            <span></span>
            <div className="flex gap-3 md:mt-2 text-xs">
              <button
                className={`${
                  comment.approved
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 cursor-pointer"
                } text-white px-3 py-1 rounded `}
                onClick={() => !comment.approved && handleApprove(comment._id)}
                disabled={actionLoading === comment._id}
              >
                {comment.approved ? "تایید شده" : "در انتظار تایید"}
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                onClick={() => handleReject(comment._id)}
                disabled={actionLoading === comment._id}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center items-center gap-4 mt-4 ">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          قبلی
        </button>
        <span className="text-sm text-gray-700">
          صفحه {page} از {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default Comments;
