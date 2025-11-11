import { useEffect, useState } from "react";
import axios from "axios";

const ApplicationsDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchApplications = async (currentPage = 1) => {
    const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/applications?page=${currentPage}`);
      setApplications(data.applications);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("خطا در دریافت درخواست‌ها:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(page);
  }, [page]);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">درخواست‌های همکاری</h2>
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : applications.length === 0 ? (
        <p>درخواستی ثبت نشده است.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-red-500 text-white text-sm text-right">
                <th className="px-4 py-2">نام</th>
                <th className="px-4 py-2">شماره تماس</th>
                <th className="px-4 py-2">تلگرام</th>
                <th className="px-4 py-2">زمینه علاقه</th>
                <th className="px-4 py-2">تاریخ ارسال</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b border-gray-300 text-sm">
                  <td className="px-4 py-2">{app.fullName}</td>
                  <td className="px-4 py-2">{app.phoneNumber}</td>
                  <td className="px-4 py-2 text-center" style={{ direction: "ltr" }}>
                    {app.telegramId || "ندارد"}
                  </td>
                  <td className="px-4 py-2">{app.interest}</td>
                  <td className="px-4 py-2">{new Date(app.createdAt).toLocaleDateString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              قبلی
            </button>
            <span className="px-3 py-1">{`صفحه ${page} از ${totalPages}`}</span>
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              بعدی
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsDashboard;
