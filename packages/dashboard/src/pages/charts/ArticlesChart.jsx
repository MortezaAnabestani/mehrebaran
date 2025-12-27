import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../../features/articlesSlice";
import Search from "../../components/lists/Search";
import DashboardSkeleton from "../../components/DashboardSkeleton";

// Lazy loading components
const ArticleAnalyticsCharts = lazy(() => import("../../components/charts/ArticleAnalyticsCharts"));
const Bubble = lazy(() => import("../../components/charts/wordFrequency/Bubble"));
const Cloud = lazy(() => import("../../components/charts/wordFrequency/Cloud"));

const ArticlesChart = () => {
  const { selectedArticle } = useSelector((state) => state.articles);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // تابع کمکی برای تمیز کردن متن جهت نمودارها
  const cleanContent = (content) => {
    if (!content) return "";
    return content
      .replace(/<[^>]+>/g, "") // حذف تگ‌های HTML
      .replace(/[a-zA-Z0-9]/g, "") // حذف حروف انگلیسی و اعداد
      .replace(/[.,/#!$%^&*;:{}=\-_`~()؟«»،؛\[\]<>؟"'"٫]/g, " "); // حذف علائم سجاوندی
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* بخش جستجو */}
      <section className="flex flex-col gap-3">
        <label className="text-lg font-bold  mr-1">تحلیل محاسباتی مقاله</label>
        <Search chart={true} />
      </section>

      {selectedArticle && (
        <Suspense fallback={<DashboardSkeleton />}>
          <div className="flex flex-col gap-8 animate-fade-in-up">
            {/* هدر مقاله انتخاب شده - M3 Primary Container Style */}
            <div className="bg-[#e0f2fe] text-[#003e6b] p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border border-[#bae6fd]">
              <div className="text-center md:text-right">
                <span className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                  گزارش تحلیلی
                </span>
                <h1 className="text-xl md:text-2xl font-bold leading-relaxed">{selectedArticle?.title}</h1>
              </div>
              <div className="bg-white/60 px-4 py-2 rounded-2xl backdrop-blur-sm">
                <span className="text-sm font-medium text-slate-700">
                  نویسنده: <span className="text-[#007acc] font-bold">{selectedArticle.author.name}</span>
                </span>
              </div>
            </div>

            {/* بخش نمودارهای اصلی */}
            <div
              className="bg-white rounded-3xl shadow-md p-6 md:p-8 border border-slate-100"
              style={{ direction: "ltr" }}
            >
              <ArticleAnalyticsCharts article={selectedArticle} />
            </div>

            {/* بخش بسامد واژگان - M3 Card Style */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 transition-shadow hover:shadow-xl">
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-8 bg-[#007acc] rounded-full inline-block"></span>
                  پربسامدترین واژگان مقاله
                </h2>
                <p className="text-slate-500 text-sm mt-1 mr-4">نمایش بصری کلمات پرتکرار در متن مقاله</p>
              </div>

              <div className="flex flex-col xl:flex-row items-center justify-around gap-8 overflow-hidden">
                {/* Bubble Chart Container */}
                <div className="w-full flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <Bubble data={cleanContent(selectedArticle?.content)} />
                </div>

                {/* Cloud Chart Container */}
                <div className="w-full flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <Cloud data={cleanContent(selectedArticle?.content)} />
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default ArticlesChart;
