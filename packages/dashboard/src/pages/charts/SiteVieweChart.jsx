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

  const fetchData = useCallback(async (view) => {
    try {
      const formattedData = view?.dailyStats.map((item) => ({
        date: toPersianDigits(convertToPersianTime(item.date, "YY/MM/DD")),
        visits: item.count,
      }));

      setStats({
        total: view?.totalVisits,
        daily: formattedData.slice(-15),
        loading: false,
      });
    } catch (err) {
      setStats((prev) => ({
        ...prev,
        error: { message: "خطا در دریافت داده‌ها", err },
        loading: false,
      }));
    }
  }, []); // توجه: هیچ dependency ندارد

  useEffect(() => {
    dispatch(fetchview());
  }, [dispatch]);

  useEffect(() => {
    if (view) {
      fetchData(view);
    }
  }, [view, fetchData]); // فقط زمانی اجرا می‌شود که view تغییر کند

  // پالت رنگی مناسب برای تم قرمز/سیاه
  const COLORS = [
    "#FF0000",
    "#CC0000",
    "#990000",
    "#660000",
    "#330000",
    "#1A0000",
    "#FF3333",
    "#CC3333",
    "#993333",
  ];

  if (stats.loading) return <div className="text-center py-8">در حال بارگذاری...</div>;
  if (stats.error) return <div className="text-red-500 text-center py-8">{stats.error.message}</div>;

  return (
    <div className="space-y-4 mt-4 p-4 rounded-sm" style={{ direction: "ltr" }}>
      {/* کارت خلاصه آمار */}
      <div className="bg-gray-50 border-2 border-gray-300 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-right text-black">آمار بازدیدها</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-600 p-4 rounded-lg">
            <p className="text-sm">کل بازدیدها</p>
            <p className="text-2xl font-bold">{stats?.total?.toLocaleString("fa-IR")}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm">بازدید امروز</p>
            <p className="text-2xl font-bold">
              {stats?.daily[stats?.daily?.length - 1]?.visits?.toLocaleString("fa-IR") || 0}
            </p>
          </div>
        </div>
      </div>

      {/* نمودار خطی */}
      <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2 text-right">روند بازدیدها</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats?.daily} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" tick={{ fill: "#000000" }} tickMargin={10} />
            <YAxis tick={{ fill: "#000000" }} tickFormatter={(value) => value?.toLocaleString("fa-IR")} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#6666",
                borderRadius: "3px",
                fontSize: "12px",
              }}
              formatter={(value) => [value?.toLocaleString("fa-IR"), "بازدید"]}
              labelFormatter={(label) => `تاریخ: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#FF0000"
              strokeWidth={2}
              dot={{ r: 4, fill: "#FF3333" }}
              activeDot={{ r: 6, fill: "#FF0000" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* نمودار میله‌ای */}
      {!root && (
        <div className=" p-6 rounded-lg shadow-lg bg-gray-50 border-2 border-gray-300">
          <h3 className="text-lg font-semibold text-black mb-2 text-right">بازدیدهای روزانه</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fill: "#000000", fontSize: 12 }} />
              <YAxis tick={{ fill: "#000000" }} tickFormatter={(value) => value?.toLocaleString("fa-IR")} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#6666",
                  borderRadius: "8px",
                }}
                formatter={(value) => [value?.toLocaleString("fa-IR"), "بازدید"]}
                labelFormatter={(label) => `تاریخ: ${label}`}
              />
              <Bar dataKey="visits" name="بازدیدها">
                {stats?.daily?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <button
        className="bg-black px-3 py-1.5 text-white text-sm rounded-md cursor-pointer hover:bg-green-700 duration-200"
        onClick={() =>
          exportView(stats?.daily, {
            fileName: "بازدیدهای_ماهانه",
            includeUniqueVisits: false, // چون داده‌ها uniqueVisits ندارند
            includeConversion: false,
          })
        }
      >
        دانلود سند اکسل آمارها
      </button>
    </div>
  );
};

export default SiteViewChart;
