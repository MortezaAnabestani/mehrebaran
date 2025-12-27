import { useEffect, useState } from "react";
import {
  BarChart,
  PieChart,
  LineChart,
  Bar,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import api from "../../services/api";

const ApplicationsChart = () => {
  const [applications, setApplications] = useState([]);

  // رنگ‌های برند و پالت متریال
  const BRAND_PRIMARY = "#007acc";
  const BRAND_SECONDARY = "#40a9ff";
  const BRAND_TERTIARY = "#0050b3";
  const ACCENT_COLOR = "#ff9800"; // رنگ مکمل برای جلب توجه

  // پالت رنگی برای نمودار دایره‌ای (مشتق شده از رنگ اصلی)
  const PIE_COLORS = [
    "#007acc", // Primary
    "#299cdb", // Lighter
    "#52beea", // Even Lighter
    "#7ce0f9", // Lightest
    "#0056b3", // Darker
    "#003a8c", // Darkest
  ];

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/volunteers/all");
      setApplications(data.data || data.volunteers || []);
    } catch (err) {
      console.error("خطا در دریافت درخواست‌ها:", err.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const processData = () => {
    // داده‌های تعداد درخواست‌ها بر اساس تاریخ
    const dateCounts = applications.reduce((acc, app) => {
      const date = new Date(app.createdAt).toLocaleDateString("fa-IR");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const dateData = Object.keys(dateCounts).map((date) => ({
      date,
      count: dateCounts[date],
    }));

    // داده‌های زمینه‌های همکاری
    const interestCounts = applications.reduce((acc, app) => {
      acc[app.interest] = (acc[app.interest] || 0) + 1;
      return acc;
    }, {});

    const interestData = Object.keys(interestCounts).map((interest) => ({
      name: interest,
      value: interestCounts[interest],
    }));

    // داده‌های ساعتی
    const hourCounts = applications?.reduce((acc, app) => {
      const hour = new Date(app.createdAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const hourData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: hourCounts[i] || 0,
    }));

    return { dateData, interestData, hourData };
  };

  const { dateData, interestData, hourData } = processData();

  // استایل سفارشی برای تولتیپ‌ها (M3 Style)
  const CustomTooltipStyle = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "none",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    padding: "12px",
    fontFamily: "inherit",
    fontSize: "14px",
    color: "#333",
  };

  return (
    <div
      className="flex flex-col p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-3xl shadow-sm mt-8 transition-all duration-300"
      dir="rtl"
    >
      <div className="mb-8 text-center md:text-right border-b border-slate-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">درخواست‌های همکاری</h2>
        <p className="text-slate-500 mt-2 text-sm">نمای کلی آمار و اطلاعات ورودی سیستم</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* کارت ۱: نمودار میله‌ای */}
        <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border border-slate-100">
          <h3 className="text-center lg:text-right text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-[#007acc] rounded-full inline-block"></span>
            روند روزانه درخواست‌ها
          </h3>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CustomTooltipStyle} cursor={{ fill: "#f1f5f9" }} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar
                  dataKey="count"
                  name="تعداد درخواست"
                  fill={BRAND_PRIMARY}
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* کارت ۲: نمودار دایره‌ای */}
        <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border border-slate-100">
          <h3 className="text-center lg:text-right text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-[#007acc] rounded-full inline-block"></span>
            توزیع زمینه‌های همکاری
          </h3>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={interestData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60} // Donut chart style for modern look
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {interestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* کارت ۳: نمودار خطی (تمام عرض) */}
      <div className="w-full bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border border-slate-100">
        <h3 className="text-center lg:text-right text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-[#007acc] rounded-full inline-block"></span>
          ترافیک ساعتی ثبت درخواست
        </h3>
        <div className="h-[350px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis
                dataKey="hour"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CustomTooltipStyle} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="count"
                name="تعداد درخواست"
                stroke={ACCENT_COLOR}
                strokeWidth={3}
                dot={{ r: 4, fill: ACCENT_COLOR, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsChart;
