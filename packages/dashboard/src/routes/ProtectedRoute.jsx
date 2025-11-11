import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import api from "../services/api";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // بررسی وجود token در localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        // دریافت اطلاعات کاربر از سرور
        const res = await api.get("/auth/me");
        const user = res.data.data;

        // ذخیره اطلاعات کاربر در localStorage
        localStorage.setItem("user", JSON.stringify(user));

        setIsAuthenticated(true);
        setUserRole(user.role);
      } catch (err) {
        console.error("خطا در بررسی احراز هویت:", err);
        setIsAuthenticated(false);
        // حذف token و user در صورت خطا
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    verifyUser();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center p-10">در حال بررسی دسترسی...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.length && allowedRoles.includes(userRole)) {
    return <div className="text-center p-10 text-red-500">دسترسی غیرمجاز</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
