import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
const DashboardLayout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/api/admins/me`,
          {
            withCredentials: true,
          }
        );
        setMe(response.data.admin);
        return response.data;
      } catch (error) {
        console.error("خطا در خروج:", error);
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
