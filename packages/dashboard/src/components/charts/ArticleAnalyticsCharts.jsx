import React from "react";
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
  Area,
  AreaChart,
} from "recharts";
import GetQualityAnalysis from "./GetQualityAnalysis";
import { convertToPersianTime } from "../../utils/convertTime";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";

// --- BRAND PALETTE & STYLES ---
const BRAND_COLOR = "#007acc";
const PALETTE = [
  "#007acc", // Primary
  "#4fc3f7", // Secondary
  "#004ba0", // Darker Primary
  "#00a152", // Success/Greenish
  "#ffab00", // Warning/Amber
];

// استایل‌های مشترک کارت‌ها بر اساس Material Design 3
const CardContainer = ({ children, title, className = "" }) => (
  <div
    className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col ${className}`}
  >
    {title && (
      <h3 className="text-lg font-bold mb-6 text-gray-800 text-right border-r-4 border-[#007acc] pr-3">
        {title}
      </h3>
    )}
    <div className="flex-1 w-full min-h-[300px]">{children}</div>
  </div>
);

// تولتیپ سفارشی با استایل M3
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-gray-100 text-right text-sm">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color || BRAND_COLOR }}>
            {entry.name}: {toPersianDigits(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ArticleAnalyticsCharts = ({ article }) => {
  // --- DATA PREPARATION ---
  const chartData = [
    { name: "بازدیدها", value: article.views || 0, fill: PALETTE[0] },
    { name: "نظرات", value: article.comments?.length || 0, fill: PALETTE[1] },
    { name: "تگ‌ها", value: article.tags?.length || 0, fill: PALETTE[2] },
    { name: "مرتبط", value: article.relatedArticles?.length || 0, fill: PALETTE[3] },
  ];

  const radarData = [
    {
      subject: "طول محتوا",
      A: Math.min(100, Math.floor((article.content?.length || 0) / 100)),
      fullMark: 100,
    },
    { subject: "تصاویر", A: (article.gallery?.length || 0) * 10, fullMark: 50 },
    { subject: "ارتباط", A: (article.relatedArticles?.length || 0) * 25, fullMark: 100 },
    { subject: "منابع", A: (article.content?.match(/<a href/g) || []).length * 10, fullMark: 50 },
    { subject: "خوانایی", A: (article.content?.match(/<p>/g) || []).length * 2, fullMark: 30 },
  ];

  const timeData = [
    {
      date: toPersianDigits(convertToPersianTime(new Date(article.createdAt), "YY/MM/DD")),
      views: Math.floor(article.views * 0.2),
    },
    {
      date: "میانه دوره", // Placeholder logic adjusted for visual continuity
      views: Math.floor(article.views * 0.6),
    },
    {
      date: "اکنون",
      views: article.views,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 bg-[#f8f9fa] rounded-[32px]">
      {/* 1. Bar Chart: General Stats */}
      <CardContainer title="خلاصه آمار مقاله">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "#555", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => toPersianDigits(val)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#007acc", opacity: 0.1 }} />
            <Bar dataKey="value" name="تعداد" radius={[8, 8, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContainer>

      {/* 2. Pie Chart: Topic Distribution */}
      {article.tags?.length > 0 && (
        <CardContainer title="توزیع موضوعی">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={article.tags.map((tag, index) => ({
                  name: tag.name || tag.title || "بدون نام",
                  value: index + 1,
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60} // Donut chart style for modern look
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {article.tags.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-gray-600 mr-2 text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContainer>
      )}

      {/* 3. Area/Line Chart: Views Trend */}
      <CardContainer title="روند بازدیدها" className="md:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BRAND_COLOR} stopOpacity={0.2} />
                <stop offset="95%" stopColor={BRAND_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fill: "#555" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "#555" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => toPersianDigits(val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="views"
              name="بازدید"
              stroke={BRAND_COLOR}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContainer>

      {/* 4. Radar Chart: Quality Analysis */}
      <CardContainer title="تحلیل کیفیت محتوا" className="md:col-span-2">
        <div className="flex flex-col md:flex-row items-center justify-between h-full">
          <div className="w-full md:w-1/2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#555", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="امتیاز"
                  dataKey="A"
                  stroke={BRAND_COLOR}
                  strokeWidth={2}
                  fill={BRAND_COLOR}
                  fillOpacity={0.4}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Analysis Text Component */}
          <div className="w-full  p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <GetQualityAnalysis article={article} />
          </div>
        </div>
      </CardContainer>
    </div>
  );
};

export default ArticleAnalyticsCharts;
