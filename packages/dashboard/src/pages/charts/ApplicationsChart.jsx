import axios from "axios";
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

const ApplicationsChart = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;
    try {
      const { data } = await axios.get(`${BASE_URL}/applications`);
      setApplications(data.applications);
    } catch (err) {
      console.error("خطا در دریافت درخواست‌ها:", err.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // پردازش داده‌ها برای نمودارها
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

  // رنگ‌های متنوع برای نمودارها
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  return (
    <div className="flex flex-col p-5 bg-red-50 border border-gray-200 rounded-lg shadow-md mt-6" dir="ltr">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">درخواست‌های همکاری</h2>

      <div className="flex flex-wrap gap-5 mb-5">
        {/* نمودار تعداد درخواست‌ها بر اساس تاریخ */}
        <div className="flex-1 min-w-[300px] bg-white p-4 rounded-lg shadow">
          <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">
            تعداد درخواست‌ها بر اساس تاریخ
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="تعداد درخواست" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار زمینه‌های همکاری پرطرفدار */}
        <div className="flex-1 min-w-[300px] bg-white p-4 rounded-lg shadow">
          <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">زمینه‌های همکاری پرطرفدار</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={interestData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {interestData.map((entry, index) => (
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

      <div className="flex flex-wrap gap-5">
        {/* نمودار توزیع ساعتی درخواست‌ها */}
        <div className="flex-1 min-w-[300px] bg-white p-4 rounded-lg shadow">
          <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">توزیع ساعتی درخواست‌ها</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="تعداد درخواست"
                  stroke="#ff7300"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsChart;
