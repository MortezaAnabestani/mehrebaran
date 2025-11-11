import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha"; // اضافه کردن reCAPTCHA

axios.defaults.withCredentials = true; // برای ارسال کوکی HttpOnly

const Login = () => {
  const [step, setStep] = useState(1); // Step 1: Login, Step 2: 2FA
  const [eyeOn, setEyeOn] = useState(false); // Step 1: Login, Step 2: 2FA
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twofaCode, setTwofaCode] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("test"); // ذخیره مقدار reCAPTCHA
  const navigate = useNavigate();

  // ارسال درخواست ورود
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      setStatus("لطفاً reCAPTCHA را تایید کنید!");
      return;
    }
    setStatus(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PUBLIC_API_URL}/admins/login`,
        { username, password, captchaValue }, // ارسال مقدار reCAPTCHA به سرور
        { withCredentials: true }
      );
              navigate("/dashboard");

    //   setStep(2);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setStatus("نام کاربری یا رمز عبور اشتباه است!");
      } else {
        setStatus("خطا در ارتباط با سرور");
      }
    } finally {
      setLoading(false);
    }
  };

  // ارسال کد 2FA
  const handleTwofaSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await axios.post(
        ` ${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/api/admins/verify-2fa`,
        { username, twofaCode },
        { withCredentials: true }
      );
      setStatus("ورود شما موفقیت‌آمیز بود");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      if (err.response?.data?.message) {
        setStatus(err.response.data.message);
      } else {
        setStatus("کد 2FA اشتباه است");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center h-screen bg-red-500">
      <img
        src="/assets/images/dashboard/icons/brandShortTitle_white.svg"
        className="w-[100px] mx-auto"
        alt="لوگوی نشریه وقایع اتفاقیه"
      />
      {status && <p className="text-lg text-center mt-4 font-bold">{status}</p>}
      <div className="bg-white p-6 md:rounded-lg shadow-md shadow-black/45 w-96 z-10 mt-4">
        <h2 className="text-2xl font-bold mb-4 text-center">وقایع‌گردانی</h2>
        {step === 1 && (
          <>
            <h4 className="text-md font-bold mb-4 text-center text-red-500">ورود به میز مدیریت تارنما</h4>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="text"
                placeholder="username"
                className="w-full p-2 border border-gray-400 rounded mb-3 outline-0 focus:border-gray-600 text-left"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ direction: "ltr" }}
              />
              <div className="relative">
                <input
                  type={eyeOn ? "text" : "password"}
                  placeholder="password"
                  className="w-full p-2 border border-gray-400 rounded mb-3 outline-0 focus:border-gray-600 text-left"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ direction: "ltr" }}
                />
                <img
                  onClick={() => setEyeOn(!eyeOn)}
                  src={`assets/images/dashboard/icons/${eyeOn ? "eye-on" : "eye-off"}.svg`}
                  className="w-5 absolute top-1/5 right-2 cursor-pointer"
                />
              </div>
              <div className="mb-3">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // کلید سایت خود را وارد کنید
                  onChange={handleCaptchaChange} // ذخیره مقدار reCAPTCHA
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 duration-200 text-white p-2 rounded cursor-pointer"
                disabled={loading}
              >
                {loading ? "در حال ورود..." : "ورود"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h4 className="text-md font-bold mb-4 text-center text-red-500">
              کد ارسال‌شده به ایمیلتان را وارد کنید
            </h4>
            <form onSubmit={handleTwofaSubmit}>
              <input
                type="text"
                placeholder="کد احراز هویت دومرحله‌ای"
                className="w-full p-2 border border-gray-400 rounded mb-3 outline-0 focus:border-gray-600 text-right"
                value={twofaCode}
                onChange={(e) => setTwofaCode(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 duration-200 text-white p-2 rounded cursor-pointer"
                disabled={loading}
              >
                {loading ? "در حال تأیید..." : "تأیید کد"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
