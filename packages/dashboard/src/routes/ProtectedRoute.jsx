import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/api/admins/me`
        );
        setIsAuthenticated(true);
        setUserRole(res?.data?.admin?.role);
      } catch (err) {
        console.log("err: ", err);
        setIsAuthenticated(false);
      }
    };

    verifyUser();
  }, [userRole]);

  if (isAuthenticated === null) {
    return <div className="text-center p-10">در حال بررسی دسترسی...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.length && !allowedRoles?.includes(userRole)) {
    return <div className="text-center p-10 text-red-500">دسترسی غیرمجاز</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
