import { Routes, Route } from "react-router-dom";
import LoginPage from "../page/LoginPage";
import DashboardPage from "../page/DashboardPage";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* مسیرهای داخل داشبورد */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardPage />} />
        {/* <Route path="/tags" element={<TagsListPage />} /> */}
      </Route>
    </Routes>
  );
}
