import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = () => {
  const [eyeOn, setEyeOn] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ارسال درخواست ورود
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        mobile,
        password,
      });

      const { token, user } = res.data.data;

      // بررسی role کاربر - فقط admin، manager و super_admin مجاز هستند
      const allowedRoles = ["admin", "manager", "super_admin"];
      if (!allowedRoles.includes(user.role)) {
        setStatus("شما مجوز دسترسی به پنل مدیریت را ندارید!");
        setLoading(false);
        return;
      }

      // ذخیره token و user در localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setStatus("ورود موفقیت‌آمیز بود...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setStatus("شماره موبایل یا رمز عبور اشتباه است!");
      } else {
        setStatus(err.response?.data?.message || "خطا در ارتباط با سرور");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center h-screen">
      <img
        src="/assets/images/dashboard/icons/brandShortTitle_white.svg"
        className="w-[200px] mx-auto"
        alt="لوگوی  مهرباران"
      />
      {status && <p className="text-lg text-center mt-4 font-bold text-green-600">{status}</p>}
      <div className="p-6 md:rounded-lg shadow-md shadow-black/45 w-96 z-10 mt-4 bg-[#3b80c3]">
        <h3 className="text-lg font-bold mb-4 text-center text-white">ورود به میز مدیریت</h3>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="text"
            placeholder="09123456789"
            className="w-full p-2 border border-gray-400 rounded mb-3 outline-0 focus:border-gray-600 text-left bg-white"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            style={{ direction: "ltr" }}
          />
          <div className="relative">
            <input
              type={eyeOn ? "text" : "password"}
              placeholder="password"
              className="w-full p-2 border border-gray-400 rounded mb-3 outline-0 focus:border-gray-600 text-left bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ direction: "ltr" }}
            />
            <img
              onClick={() => setEyeOn(!eyeOn)}
              src={`assets/images/dashboard/icons/${eyeOn ? "eye-on" : "eye-off"}.svg`}
              className="w-5 absolute top-1/5 right-2 cursor-pointer"
              alt="toggle password visibility"
            />
          </div>
          <button
            type="submit"
            className="w-full duration-200 bg-white hover:bg-sky-50 text-[#3b80c3] p-2 rounded cursor-pointer"
            disabled={loading}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
