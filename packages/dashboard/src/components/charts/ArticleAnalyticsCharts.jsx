import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import GetQualityAnalysis from "./GetQualityAnalysis";
import { convertToPersianTime } from "../../utils/convertTime";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
const ArticleAnalyticsCharts = ({ article }) => {
  const chartData = [
    {
      name: "بازدیدها",
      value: article.views,
      fill: "#FF4757",
    },
    {
      name: "نظرات",
      value: article.comments.length,
      fill: "#2ED573",
    },
    {
      name: "امتیاز",
      value: article.ratings.average,
      fill: "#FFA502",
    },
    {
      name: "تگ‌ها",
      value: article.tags.length,
      fill: "#1E90FF",
    },
  ];

  const radarData = [
    {
      subject: "طول محتوا",
      A: Math.min(100, Math.floor(article.content.length / 100)),
      fullMark: 100,
    },
    {
      subject: "تعداد تصاویر",
      A: article.images.length * 10,
      fullMark: 50,
    },
    {
      subject: "ارتباط موضوعی",
      A: article.relatedArticles.length * 25,
      fullMark: 100,
    },
    {
      subject: "تعداد منابع",
      A: (article.content.match(/<a href/g) || []).length * 10,
      fullMark: 50,
    },
    {
      subject: "پیچیدگی متن",
      A: (article.content.match(/<p>/g) || []).length * 2,
      fullMark: 30,
    },
  ];

  const timeData = [
    {
      date: toPersianDigits(convertToPersianTime(new Date(article.createdAt), "YY/MM/DD")),
      views: Math.floor(article.views * 0.2),
    },
    {
      date: toPersianDigits(convertToPersianTime(new Date(article.createdAt), "YY/MM/DD")),
      views: Math.floor(article.views * 0.5),
    },
    {
      date: toPersianDigits(convertToPersianTime(new Date(article.createdAt), "YY/MM/DD")),
      views: article.views,
    },
  ];

  const COLORS = ["#FF4757", "#2ED573", "#FFA502", "#1E90FF", "#A55EEA"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4 text-gray-800 text-right">خلاصه آمار مقاله</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [value, "تعداد"]} labelStyle={{ fontWeight: "bold" }} />
            <Bar dataKey="value" name="مقدار">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {article.tags.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 text-gray-800 text-right">توزیع موضوعی</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={article.tags.map((tag, index) => ({
                  name: tag.name,
                  value: index + 1, // مقدار نمونه‌سازی شده
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name }) => name}
              >
                {article.tags.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [name, "اهمیت"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h3 className="text-lg font-bold mb-4 text-gray-800 text-right">روند بازدیدها</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
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
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#A55EEA" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h3 className="text-lg font-bold mb-4 text-gray-800 text-right">تحلیل کیفیت محتوا</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="مقاله" dataKey="A" stroke="#FF4757" fill="#FF4757" fillOpacity={0.6} />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        <GetQualityAnalysis article={article} />
      </div>
    </div>
  );
};

export default ArticleAnalyticsCharts;
