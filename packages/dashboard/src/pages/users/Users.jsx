import { useEffect, useState } from "react";
import api from "../../services/api";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

// آیکون‌های SVG داخلی برای جلوگیری از وابستگی به پکیج‌های خارجی
const Icons = {
  Search: () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  User: () => (
    <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get('/users');
      setUsers(data.data || []);
      setFilteredUsers(data.data || []);
    } catch (err) {
      setError("خطا در برقراری ارتباط با سرور. لطفاً مجدداً تلاش کنید.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "آیا از حذف این کاربر اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
    );
    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/users/${id}`);
      setMessage(data.message || "کاربر با موفقیت حذف شد.");

      const updatedUsers = users.filter((user) => user._id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(
        updatedUsers.filter((u) => u.fullName?.includes(searchTerm) || u.phoneNumber?.includes(searchTerm))
      );

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("خطا در حذف کاربر. ممکن است دسترسی لازم را نداشته باشید.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // هندل کردن جستجو
  useEffect(() => {
    const results = users.filter(
      (user) =>
        (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phoneNumber && user.phoneNumber.includes(searchTerm))
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-[#1e1e1e]">
      {/* کارت اصلی */}
      <div className="max-w-6xl mx-auto bg-white rounded-[8px] shadow-md overflow-hidden">
        {/* هدر کارت */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#007acc]/10 p-2 rounded-[8px]">
              <Icons.User />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e1e1e]">مدیریت کاربران</h2>
              <p className="text-sm text-gray-500 mt-1">لیست تمام اعضای ثبت‌نام شده در سامانه</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* فیلد جستجو */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Icons.Search />
              </span>
              <input
                type="text"
                placeholder="جستجو (نام یا شماره)..."
                className="w-full py-2 pr-10 pl-4 text-sm text-[#1e1e1e] bg-gray-50 border border-gray-200 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#007acc] focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* دکمه رفرش */}
            <button
              onClick={fetchUsers}
              className="p-2 text-[#007acc] bg-[#007acc]/10 hover:bg-[#007acc]/20 rounded-[8px] transition-colors"
              title="بروزرسانی لیست"
            >
              <Icons.Refresh />
            </button>
          </div>
        </div>

        {/* نمایش پیام‌ها */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border-r-4 border-red-500 text-red-700 text-sm rounded-[8px] flex items-center">
            <span className="font-bold ml-2">خطا:</span> {error}
          </div>
        )}
        {message && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border-r-4 border-green-500 text-green-700 text-sm rounded-[8px] flex items-center">
            <span className="font-bold ml-2">موفقیت:</span> {message}
          </div>
        )}

        {/* جدول داده‌ها */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#007acc] text-white text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium border-b border-[#006bb3]">نام و نام خانوادگی</th>
                <th className="px-6 py-4 font-medium border-b border-[#006bb3]">شماره تماس</th>
                <th className="px-6 py-4 font-medium border-b border-[#006bb3]">تاریخ عضویت</th>
                <th className="px-6 py-4 font-medium border-b border-[#006bb3] text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                // اسکلت لودینگ (Skeleton Loading)
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-gray-200 rounded w-20 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Icons.User />
                      <p className="mt-2">هیچ کاربری یافت نشد.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                    <td className="px-6 py-4 text-sm font-medium text-[#1e1e1e]">{user.fullName || "---"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {user.phoneNumber ? toPersianDigits(user.phoneNumber) : "---"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-[4px] text-xs">
                        {toPersianDigits(convertToPersianTime(user.createdAt, "YYYY/MM/DD"))}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-[8px] border border-red-200 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <Icons.Trash />
                        <span>حذف</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* فوتر جدول (تعداد رکوردها) */}
        {!loading && filteredUsers.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>نمایش {toPersianDigits(filteredUsers.length)} کاربر</span>
            <span className="text-[#f7891b]">بروزرسانی شده</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
