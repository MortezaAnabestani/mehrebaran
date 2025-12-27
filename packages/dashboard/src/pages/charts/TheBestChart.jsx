import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../../features/articlesSlice";
import { fetchAuthors } from "../../features/authorsSlice";
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

// --- کامپوننت‌های کمکی UI ---

// تولتیپ سفارشی با استایل Material Design
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm text-white p-4 rounded-2xl shadow-xl border border-slate-700 text-sm z-50">
        <p className="font-bold mb-2 border-b border-slate-600 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="text-slate-300">{entry.name}:</span>
            <span className="font-mono font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// کارت نگهدارنده نمودار با استایل M3
const ChartCard = ({ title, children, className = "" }) => (
  <div
    className={`bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex flex-col ${className}`}
  >
    <h2 className="text-lg font-bold text-slate-700 mb-6 border-r-4 border-[#007acc] pr-3">{title}</h2>
    <div className="flex-grow min-h-[350px] w-full" dir="ltr">
      {children}
    </div>
  </div>
);

const TheBestChart = () => {
  const { articles } = useSelector((state) => state.articles);
  const { authors } = useSelector((state) => state.authors);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([dispatch(fetchArticles()), dispatch(fetchAuthors())]);
      } catch (err) {
        console.error("خطا در بارگذاری داده‌های اولیه:", err);
      }
    };
    loadInitialData();
  }, [dispatch]);

  // پردازش داده‌ها با useMemo برای جلوگیری از محاسبه مجدد
  const processedData = useMemo(() => {
    const articleList = Array.isArray(articles?.articles) ? articles.articles : [];
    const authorList = Array.isArray(authors?.authors) ? authors?.authors : [];

    // 1. پربازدیدترین مقالات
    const topViewedArticles = [...articleList]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((article) => ({
        name: article.title.length > 20 ? `${article.title.substring(0, 20)}...` : article.title,
        views: article.views,
        fullTitle: article.title,
      }));

    // 2. پرکارترین نویسندگان (ترکیبی با امتیاز)
    const mostProductiveAuthors = [...authorList]
      .sort((a, b) => (b.articles?.length || 0) - (a.articles?.length || 0))
      .slice(0, 5)
      .map((author) => ({
        name: author.name,
        articles: author.articles?.length || 0,
        avgRating: author.ratings?.average || 0,
      }));

    // 3. عملکرد برچسب‌ها (تگ‌ها vs بازدید)
    const mostTaggedArticles = [...articleList]
      .sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0))
      .slice(0, 5)
      .map((article) => ({
        name: article.title.length > 15 ? `${article.title.substring(0, 15)}...` : article.title,
        tags: article.tags?.length || 0,
        views: article.views,
      }));

    // 4. پرتکرارترین تگ‌ها (Pie Chart)
    const popularTags = {};
    articleList.forEach((article) => {
      article.tags?.forEach((tag) => {
        if (tag?.name) {
          popularTags[tag.name] = (popularTags[tag.name] || 0) + 1;
        }
      });
    });
    const topTags = Object.entries(popularTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6) // محدود به 6 تگ برای زیبایی پای چارت
      .map(([name, count]) => ({ name, count }));

    return {
      topViewedArticles,
      mostProductiveAuthors,
      mostTaggedArticles,
      topTags,
    };
  }, [articles, authors]);

  const { topViewedArticles, mostProductiveAuthors, mostTaggedArticles, topTags } = processedData;

  // پالت رنگی برند (Brand Palette)
  // Primary: #007acc
  const BRAND_COLORS = {
    primary: "#007acc",
    secondary: "#40a9ff", // Lighter Blue
    tertiary: "#0050b3", // Darker Blue
    accent: "#faad14", // Amber for ratings/contrast
    surface: "#f0f5ff", // Very light blue tint
    chartPalette: ["#007acc", "#36cfc9", "#40a9ff", "#9254de", "#ffec3d", "#ff7a45"],
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans" dir="rtl">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
          داشبورد <span className="text-[#007acc]">تحلیلی</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          نمای کلی از عملکرد مقالات، نویسندگان و برچسب‌ها با تمرکز بر داده‌های کلیدی.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. پربازدیدترین مقالات (Bar Chart) */}
        <ChartCard title="پربازدیدترین مقالات">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topViewedArticles} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: BRAND_COLORS.surface }} />
              <Bar
                dataKey="views"
                name="تعداد بازدید"
                fill={BRAND_COLORS.primary}
                radius={[8, 8, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. عملکرد نویسندگان (Composed Chart) */}
        <ChartCard title="عملکرد نویسندگان برتر">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mostProductiveAuthors} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: BRAND_COLORS.surface }} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                dataKey="articles"
                name="تعداد مقالات"
                fill={BRAND_COLORS.secondary}
                radius={[6, 6, 0, 0]}
                barSize={30}
              />
              <Bar
                dataKey="avgRating"
                name="میانگین امتیاز"
                fill={BRAND_COLORS.accent}
                radius={[6, 6, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. همبستگی تگ‌ها و بازدید (Line Chart) */}
        <ChartCard title="تأثیر برچسب‌ها بر بازدید">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mostTaggedArticles} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis yAxisId="left" tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tags"
                name="تعداد تگ‌ها"
                stroke={BRAND_COLORS.tertiary}
                strokeWidth={3}
                dot={{ r: 4, fill: BRAND_COLORS.tertiary, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="views"
                name="تعداد بازدید"
                stroke={BRAND_COLORS.accent}
                strokeWidth={3}
                dot={{ r: 4, fill: BRAND_COLORS.accent, strokeWidth: 2, stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. توزیع موضوعی (Pie Chart) */}
        <ChartCard title="سهم موضوعات (تگ‌ها)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topTags}
                cx="50%"
                cy="50%"
                innerRadius={60} // Donut chart style for modern look
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
                nameKey="name"
              >
                {topTags.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BRAND_COLORS.chartPalette[index % BRAND_COLORS.chartPalette.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default TheBestChart;
