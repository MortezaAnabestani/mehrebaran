import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { fetchview } from "../../features/viewSlice";
import { exportView } from "../../utils/exportView";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const SiteViewChart = ({ root }) => {
  const dispatch = useDispatch();
  const { view } = useSelector((state) => state.view);
  const [stats, setStats] = useState({
    total: 0,
    daily: [],
    loading: true,
    error: null,
  });

  // رنگ اصلی برند
  const BRAND_PRIMARY = "#007acc";

  // پالت رنگی متریال دیزاین (مشتق شده از رنگ اصلی)
  const CHART_PALETTE = [
    "#007acc", // Primary
    "#006bb3", // Darker
    "#005c99",
    "#4fc3f7", // Lighter
    "#29b6f6",
    "#0288d1",
    "#01579b",
  ];

  const fetchData = useCallback(async (view) => {
    try {
      if (!view || !view.dailyStats) {
        throw new Error("داده‌های بازدید موجود نیست");
      }

      const formattedData = view.dailyStats.map((item) => ({
        date: toPersianDigits(convertToPersianTime(item.date, "YY/MM/DD")),
        visits: item.count,
      }));

      setStats({
        total: view.totalVisits,
        daily: formattedData.slice(-15),
        loading: false,
      });
    } catch (err) {
      console.error("Error in fetchData:", err);
      setStats((prev) => ({
        ...prev,
        error: { message: "خطا در دریافت داده‌ها", err },
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchview());
  }, [dispatch]);

  useEffect(() => {
    if (view) {
      fetchData(view);
    }
  }, [view, fetchData]);

  // استایل لودینگ
  if (stats.loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-[#007acc] font-medium text-lg">در حال بارگذاری آمار...</div>
      </div>
    );

  // استایل خطا
  if (stats.error)
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center border border-red-100 mx-4 mt-4">
        {stats.error.message}
      </div>
    );

  return (
    <div className="space-y-6 mt-6 px-2 md:px-4 pb-8" style={{ direction: "ltr" }}>
      {/* هدر و دکمه دانلود - چیدمان فلکس برای موبایل و دسکتاپ */}
      <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-4 mb-2 px-2">
        <h2 className="text-2xl font-bold text-gray-800 order-2 md:order-1 text-right w-full md:w-auto">
          آمار بازدید سایت{" "}
        </h2>
        <button
          className="order-1 md:order-2 w-full md:w-auto bg-[#007acc] text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-[#0062a3] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
          onClick={() =>
            exportView(stats?.daily, {
              fileName: "بازدیدهای_ماهانه",
              includeUniqueVisits: false,
              includeConversion: false,
            })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          دانلود گزارش اکسل
        </button>
      </div>

      {/* کارت‌های خلاصه آمار (Summary Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* کارت کل بازدیدها - Primary Container */}
        <div className="bg-[#007acc] text-white p-6 rounded-[24px] shadow-md relative overflow-hidden group transition-transform hover:-translate-y-1 duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 text-right">
            <p className="text-blue-100 text-sm font-medium mb-1">کل بازدیدها</p>
            <p className="text-4xl font-bold tracking-tight">{stats?.total?.toLocaleString("fa-IR")}</p>
          </div>
        </div>

        {/* کارت بازدید امروز - Surface Container */}
        <div className="bg-white border border-gray-100 text-gray-800 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 text-right">
          <div className="flex items-center justify-end gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-gray-500 text-sm font-medium">بازدید امروز</p>
          </div>
          <p className="text-4xl font-bold text-[#007acc]">
            {stats?.daily[stats?.daily?.length - 1]?.visits?.toLocaleString("fa-IR") || 0}
          </p>
        </div>
      </div>

      {/* نمودار خطی (Line Chart) */}
      <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-800 text-right w-full">روند بازدیدها</h3>
        </div>

        <div className="h-[300px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND_PRIMARY} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={BRAND_PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value?.toLocaleString("fa-IR")}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  padding: "12px 16px",
                  fontFamily: "inherit",
                }}
                itemStyle={{ color: BRAND_PRIMARY, fontWeight: "bold" }}
                formatter={(value) => [value?.toLocaleString("fa-IR"), "بازدید"]}
                labelFormatter={(label) => `تاریخ: ${label}`}
                cursor={{ stroke: "#e0e0e0", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="visits"
                stroke={BRAND_PRIMARY}
                strokeWidth={3}
                dot={{ r: 4, fill: "#fff", stroke: BRAND_PRIMARY, strokeWidth: 2 }}
                activeDot={{ r: 7, fill: BRAND_PRIMARY, stroke: "#fff", strokeWidth: 2 }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* نمودار میله‌ای (Bar Chart) */}
      {!root && (
        <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-800 text-right w-full">بازدیدهای روزانه (میله‌ای)</h3>
          </div>

          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.daily} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => value?.toLocaleString("fa-IR")}
                />
                <Tooltip
                  cursor={{ fill: "#f3f4f6", radius: 8 }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    padding: "12px 16px",
                  }}
                  formatter={(value) => [value?.toLocaleString("fa-IR"), "بازدید"]}
                  labelFormatter={(label) => `تاریخ: ${label}`}
                />
                <Bar dataKey="visits" radius={[8, 8, 0, 0]}>
                  {stats?.daily?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteViewChart;
