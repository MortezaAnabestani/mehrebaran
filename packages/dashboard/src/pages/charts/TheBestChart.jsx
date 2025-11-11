import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../../features/articlesSlice";
import { fetchAuthors } from "../../features/authorsSlice";
import { fetchHonors } from "../../features/honorsSlice";
import {
  BarChart,
  PieChart,
  LineChart,
  ScatterChart,
  Bar,
  Pie,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ZAxis,
} from "recharts";

const TheBestChart = () => {
  const { articles } = useSelector((state) => state.articles);
  const { authors } = useSelector((state) => state.authors);
  const { honors } = useSelector((state) => state.honors);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([dispatch(fetchArticles()), dispatch(fetchAuthors()), dispatch(fetchHonors())]);
      } catch (err) {
        console.error("خطا در بارگذاری داده‌های اولیه:", err);
      }
    };
    loadInitialData();
  }, [dispatch]);

  // پردازش داده‌ها برای نمودارها
  const processData = () => {
    const articleList = Array.isArray(articles?.articles) ? articles.articles : [];
    const authorList = Array.isArray(authors?.authors) ? authors?.authors : [];
    const honorsList = Array.isArray(honors) ? honors : [];

    // پربازدیدترین مقالات
    const topViewedArticles = [...articleList]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((article) => ({
        name: article.title.length > 20 ? `${article.title.substring(0, 20)}...` : article.title,
        views: article.views,
        id: article._id,
      }));

    // پرامتیازترین نویسندگان
    const topRatedAuthors = [...authorList]
      .filter((a) => a.ratings?.count > 0)
      .sort((a, b) => b.ratings?.average - a.ratings?.average)
      .slice(0, 5)
      .map((author) => ({
        name: author.name,
        rating: author.ratings?.average || 0,
        articles: author.articles?.length || 0,
      }));

    // پرکارترین نویسندگان
    const mostProductiveAuthors = [...authorList]
      .sort((a, b) => (b.articles?.length || 0) - (a.articles?.length || 0))
      .slice(0, 5)
      .map((author) => ({
        name: author.name,
        articles: author.articles?.length || 0,
        avgRating: author.ratings?.average || 0,
      }));

    // پرتگ‌ترین مقالات
    const mostTaggedArticles = [...articleList]
      .sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0))
      .slice(0, 5)
      .map((article) => ({
        name: article.title.length > 15 ? `${article.title.substring(0, 15)}...` : article.title,
        tags: article.tags?.length || 0,
        views: article.views,
      }));

    // پرتکرارترین تگ‌ها
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
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    // جوایز و افتخارات
    const honorsByAuthor = {};
    honorsList.forEach((honor) => {
      const authorName = honor.author?.name;
      if (authorName) {
        honorsByAuthor[authorName] = (honorsByAuthor[authorName] || 0) + 1;
      }
    });
    const topHonoredAuthors = Object.entries(honorsByAuthor)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      topViewedArticles,
      topRatedAuthors,
      mostProductiveAuthors,
      mostTaggedArticles,
      topTags,
      topHonoredAuthors,
    };
  };

  const {
    topViewedArticles,
    topRatedAuthors,
    mostProductiveAuthors,
    mostTaggedArticles,
    topTags,
    topHonoredAuthors,
  } = processData();

  // پالت رنگ برای نمودارها
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#4ECDC4"];

  return (
    <div className="p-6 bg-gray-50 rounded-xl" dir="ltr">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">ترین‌ها</h1>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl text-right font-semibold text-gray-700 mb-4">پربازدیدترین مقالات</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topViewedArticles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} بازدید`, "تعداد بازدید"]}
                  labelFormatter={(label) => `مقاله: ${label}`}
                />
                <Legend />
                <Bar dataKey="views" name="تعداد بازدید" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1  gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl text-right font-semibold text-gray-700 mb-4">عملکرد نویسندگان</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostProductiveAuthors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "تعداد مقالات") return [value, name];
                    return [value.toFixed(1), "میانگین امتیاز"];
                  }}
                  labelFormatter={(label) => `نویسنده: ${label}`}
                />
                <Legend />
                <Bar dataKey="articles" name="تعداد مقالات" fill="#00C49F" />
                <Bar dataKey="avgRating" name="میانگین امتیاز" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* پرتگ‌ترین مقالات */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl text-right font-semibold text-gray-700 mb-4">عملکرد برچسب‌ها</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mostTaggedArticles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" dataKey="tags" />
                <YAxis yAxisId="right" orientation="right" dataKey="views" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "تعداد تگ‌ها") return [value, name];
                    return [value, "تعداد بازدید"];
                  }}
                  labelFormatter={(label) => `مقاله: ${label}`}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tags"
                  name="تعداد تگ‌ها"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line yAxisId="right" type="monotone" dataKey="views" name="تعداد بازدید" stroke="#82CA9D" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ردیف سوم - پرتکرارترین تگ‌ها و نویسندگان برنده جایزه */}
      <div className="grid grid-cols-1  gap-6">
        {/* پرتکرارترین تگ‌ها */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl text-right font-semibold text-gray-700 mb-4">فراوانی برچسب‌ها</h2>
          <div className="h-100">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topTags}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {topTags.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} مقاله`, "تعداد استفاده"]}
                  labelFormatter={(label) => `تگ: ${label}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نویسندگان برنده جایزه */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl text-right font-semibold text-gray-700 mb-4">وقایع‌نگاران برگزیده</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topHonoredAuthors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} جایزه`, "تعداد جوایز"]}
                  labelFormatter={(label) => `نویسنده: ${label}`}
                />
                <Legend />
                <Bar dataKey="count" name="تعداد جوایز" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheBestChart;
