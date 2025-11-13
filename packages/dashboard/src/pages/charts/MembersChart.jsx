import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  PieChart,
  LineChart,
  AreaChart,
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
  Area,
} from "recharts";
import { convertToPersianTime } from "../../utils/convertTime";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";

const MembersChart = () => {
  const [members, setMembers] = useState([]);
  const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/auth/users`);
      setMembers(data.users);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // پردازش داده‌ها
  const processData = () => {
    // آمار کلی
    const totalMembers = members.length;

    // توزیع ماهانه
    const monthlyData = members.reduce((acc, member) => {
      const date = new Date(member.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear]++;
      return acc;
    }, {});

    const monthlyChartData = Object.entries(monthlyData)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // توزیع روزانه (آخرین 30 روز)
    const dailyData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const count = members.filter((m) => {
        const memberDate = new Date(m.createdAt).toISOString().split("T")[0];
        return memberDate === dateStr;
      }).length;

      return {
        date: toPersianDigits(convertToPersianTime(date, "YYYY/MM/DD")),
        count,
      };
    }).reverse();

    // ساعات عضویت
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: toPersianDigits(`${hour}:00`),
      count: members.filter((m) => new Date(m.createdAt).getHours() === hour).length,
    }));

    // منابع عضویت (اگر در آینده اضافه شد)
    const sourceData = [
      { name: "مستقیم", value: members.length },
      { name: "تبلیغات", value: 0 },
      { name: "شبکه‌های اجتماعی", value: 0 },
    ];

    return {
      totalMembers,
      monthlyChartData,
      dailyData,
      hourlyData,
      sourceData,
    };
  };

  const { totalMembers, monthlyChartData, dailyData, hourlyData, sourceData } = processData();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="p-6 bg-amber-50 mt-6 rounded-xl border border-gray-200 shadow-md" dir="ltr">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">آمار مخاطبان سایت</h1>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow text-right">
          <h3 className="text-gray-500 font-medium ">تعداد کل مخاطبان</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalMembers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-right">
          <h3 className="text-gray-500 font-medium">آخرین عضو</h3>
          <p className="text-xl font-semibold text-gray-700">{members[0]?.fullName || "ناموجود"}</p>
          <p className="text-sm text-gray-400">
            {new Date(members[0]?.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-right">
          <h3 className="text-gray-500 font-medium">پرکارترین ماه</h3>
          <p className="text-xl font-semibold text-gray-700">
            {
              monthlyChartData.reduce(
                (max, item) => (item.count > max.count ? item : max),
                monthlyChartData[0]
              )?.month
            }
          </p>
          <p className="text-sm text-gray-400">
            {
              monthlyChartData.reduce(
                (max, item) => (item.count > max.count ? item : max),
                monthlyChartData[0]
              )?.count
            }{" "}
            عضو
          </p>
        </div>
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* عضویت ماهانه */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-right">تعداد عضویت‌ها در هر ماه</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="تعداد عضویت" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* عضویت روزانه (30 روز اخیر) */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-right">عضویت‌های 30 روز اخیر</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="count" name="عضویت روزانه" stroke="#ff7300" fill="#ffb357" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* توزیع ساعتی */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-right">توزیع ساعتی عضویت‌ها</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="تعداد عضویت"
                  stroke="#00C49F"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* منابع عضویت */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-right">منبع عضویت‌ها</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersChart;
