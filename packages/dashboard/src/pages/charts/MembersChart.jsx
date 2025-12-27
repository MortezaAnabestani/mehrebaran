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
import api from "../../services/api";

// --- کامپوننت تولتیپ سفارشی (Custom Tooltip) ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white/95 backdrop-blur-sm p-3 border border-gray-100 rounded-2xl shadow-lg text-right"
        dir="rtl"
      >
        <p className="text-sm font-bold text-gray-700 mb-1">{label}</p>
        <p className="text-sm text-[#007acc]">{`${payload[0].name}: ${toPersianDigits(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const MembersChart = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // رنگ‌های سازمانی و مکمل
  const BRAND_COLOR = "#007acc";
  const COLORS = ["#007acc", "#40a9ff", "#ffb357", "#ff7875", "#bae637"];

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setMembers(data.data || data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // پردازش داده‌ها
  const processData = () => {
    const totalMembers = members.length;

    // توزیع ماهانه
    const monthlyData = members.reduce((acc, member) => {
      const date = new Date(member.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!acc[monthYear]) acc[monthYear] = 0;
      acc[monthYear]++;
      return acc;
    }, {});

    const monthlyChartData = Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // توزیع روزانه (30 روز اخیر)
    const dailyData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = members.filter((m) => {
        const memberDate = new Date(m.createdAt).toISOString().split("T")[0];
        return memberDate === dateStr;
      }).length;
      return {
        date: toPersianDigits(convertToPersianTime(date, "MM/DD")), // فرمت کوتاه‌تر برای نمودار
        fullDate: toPersianDigits(convertToPersianTime(date, "YYYY/MM/DD")),
        count,
      };
    }).reverse();

    // ساعات عضویت
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: toPersianDigits(`${hour}:00`),
      count: members.filter((m) => new Date(m.createdAt).getHours() === hour).length,
    }));

    // منابع (Placeholder)
    const sourceData = [
      { name: "مستقیم", value: members.length },
      { name: "تبلیغات", value: 0 },
      { name: "سوشال", value: 0 },
    ];

    return { totalMembers, monthlyChartData, dailyData, hourlyData, sourceData };
  };

  const { totalMembers, monthlyChartData, dailyData, hourlyData, sourceData } = processData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-[#007acc] font-bold text-lg">در حال بارگذاری آمار...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#f8fdff] min-h-screen font-sans" dir="rtl">
      {/* هدر اصلی */}
      <div className="mb-8 text-center md:text-right">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2"> تحلیل مخاطبان</h1>
        <p className="text-gray-500 text-sm">بررسی روند رشد و تعامل کاربران سایت</p>
      </div>

      {/* کارت‌های خلاصه آمار (Summary Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* کارت 1: کل مخاطبان */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#007acc]"></div>
          <h3 className="text-gray-500 font-medium text-sm mb-2">تعداد کل مخاطبان</h3>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-[#007acc]">{toPersianDigits(totalMembers)}</p>
            <span className="text-gray-400 text-sm mb-1">نفر</span>
          </div>
          <div className="absolute -left-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            {/* آیکون پس‌زمینه تزئینی */}
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>

        {/* کارت 2: آخرین عضو */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <h3 className="text-gray-500 font-medium text-sm mb-2">آخرین عضو پیوسته</h3>
          <p className="text-xl font-bold text-gray-800 truncate">{members[0]?.fullName || "ناموجود"}</p>
          <p className="text-xs text-gray-400 mt-1 bg-gray-50 inline-block px-2 py-1 rounded-lg">
            {members[0] ? toPersianDigits(new Date(members[0].createdAt).toLocaleDateString("fa-IR")) : "-"}
          </p>
        </div>

        {/* کارت 3: رکورد ماهانه */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <h3 className="text-gray-500 font-medium text-sm mb-2">رکورد جذب ماهانه</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {toPersianDigits(
                  monthlyChartData.reduce(
                    (max, item) => (item.count > max.count ? item : max),
                    monthlyChartData[0]
                  )?.count || 0
                )}
              </p>
              <span className="text-xs text-gray-400">عضو جدید</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-[#007acc] bg-blue-50 px-3 py-1 rounded-full">
                {monthlyChartData.reduce(
                  (max, item) => (item.count > max.count ? item : max),
                  monthlyChartData[0]
                )?.month || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* بخش نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* نمودار 1: رشد ماهانه (Bar Chart) */}
        <div className="bg-white p-6 rounded-[28px] shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-700">روند عضویت ماهانه</h3>
            <div className="w-2 h-2 rounded-full bg-[#007acc]"></div>
          </div>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="count" name="تعداد" fill={BRAND_COLOR} radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار 2: فعالیت 30 روز اخیر (Area Chart) */}
        <div className="bg-white p-6 rounded-[28px] shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-700">عملکرد 30 روز گذشته</h3>
            <div className="w-2 h-2 rounded-full bg-[#ffb357]"></div>
          </div>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffb357" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffb357" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="عضویت"
                  stroke="#ffb357"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار 3: توزیع ساعتی (Line Chart) */}
        <div className="bg-white p-6 rounded-[28px] shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-700">ترافیک ساعتی ثبت‌نام</h3>
            <div className="w-2 h-2 rounded-full bg-[#40a9ff]"></div>
          </div>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={2}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="تعداد"
                  stroke="#40a9ff"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#40a9ff", strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار 4: منابع ورودی (Donut Chart) */}
        <div className="bg-white p-6 rounded-[28px] shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-700">منابع جذب کاربر</h3>
            <div className="w-2 h-2 rounded-full bg-[#ff7875]"></div>
          </div>
          <div className="h-72 w-full flex items-center justify-center" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60} // تبدیل به Donut Chart برای ظاهر مدرن‌تر
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-gray-600 text-sm mx-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersChart;
