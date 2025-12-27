import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import api from "../services/api";

const DashboardLayout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const response = await api.get("/users/me");
        setMe(response.data.data);
        return response.data;
      } catch (error) {
        console.error("خطا در دریافت اطلاعات کاربر:", error);
        throw error;
      }
    }
    fetchMe();
  }, []);
  return (
    <div className="min-w-screen min-h-screen bg-slate-50">
      <div>
        <Header role={role} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} me={me} />
        <div className="flex flex-col lg:flex-row w-full">
          <Sidebar role={role} sidebarOpen={sidebarOpen} me={me} />
          <div className="p-[15px] lg:p-[30px] w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
