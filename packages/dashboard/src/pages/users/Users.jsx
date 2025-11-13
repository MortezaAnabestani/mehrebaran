import { useEffect, useState } from "react";
import axios from "axios";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL; // آدرس بک‌اندت

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/auth/users`);
      setUsers(data.users);
    } catch (err) {
      setError("خطا در دریافت کاربران");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`${BASE_URL}/auth/users/${id}`);
      setMessage(data.message);
      // حذف کاربر از لیست بدون نیاز به رفرش
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      setError("خطا در حذف کاربر");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-lg font-bold mb-4">لیست کاربران</h2>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right border border-gray-300">
          <thead className="bg-red-600 text-xs text-white">
            <tr>
              <th className="p-2 border">نام</th>
              <th className="p-2 border">شماره تماس</th>
              <th className="p-2 border">تاریخ عضویت</th>
              <th className="p-2 border">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  کاربری ثبت نشده است.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-2 border">{user.fullName}</td>
                <td className="p-2 border">{user.phoneNumber}</td>
                <td className="p-2 border">
                  {toPersianDigits(convertToPersianTime(user.createdAt, "YYYY/MM"))}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold cursor-pointer duration-200"
                  >
                    لغو عضویت
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
