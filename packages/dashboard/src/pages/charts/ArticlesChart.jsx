import { useEffect } from "react";
import { lazy, Suspense } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../../features/articlesSlice";
import Search from "../../components/lists/Search";
import DashboardSkeleton from "../../components/DashboardSkeleton";

const ArticleAnalyticsCharts = lazy(() => import("../../components/charts/ArticleAnalyticsCharts"));
const Bubble = lazy(() => import("../../components/charts/wordFrequency/Bubble"));
const Cloud = lazy(() => import("../../components/charts/wordFrequency/Cloud"));

const ArticlesChart = () => {
  const { selectedArticle } = useSelector((state) => state.articles);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);
  return (
    <div>
      <>
        <p className="text-xs text-gray-400 mb-2">مقاله خود را جستجو کنید</p>
        <Search chart={true} />
      </>
      {selectedArticle && (
        <Suspense fallback={<DashboardSkeleton />}>
          <div className="mt-5">
            <h1 className="text-sm w-full text-center p-2 bg-gray-900 text-white rounded-sm">
              تحلیل و بررسی مقالۀ{" "}
              <span className="font-bold text-base text-amber-300">{selectedArticle?.title}</span> | نویسنده:{" "}
              {selectedArticle.author.name}
            </h1>
            <div style={{ direction: "ltr" }}>
              <ArticleAnalyticsCharts article={selectedArticle} />
            </div>
            <div className="p-6 border text-lg font-bold border-gray-200 rounded-sm w-30/31 mx-auto shadow-md bg-white">
              <h1>پربسامدترین واژگان مقاله</h1>
              <div className="flex flex-col md:flex-row overflow-scroll items-center justify-around gap-2 ">
                <Bubble
                  data={
                    selectedArticle?.content
                      .replace(/<[^>]+>/g, "") // حذف تگ‌های HTML
                      .replace(/[a-zA-Z0-9]/g, "") // حذف حروف انگلیسی و اعداد
                      .replace(/[.,/#!$%^&*;:{}=\-_`~()؟«»،؛\[\]<>؟"'"٫]/g, " ") // حذف علائم سجاوندی فارسی و انگلیسی
                  }
                />
                <Cloud
                  data={
                    selectedArticle?.content
                      .replace(/<[^>]+>/g, "") // حذف تگ‌های HTML
                      .replace(/[a-zA-Z0-9]/g, "") // حذف حروف انگلیسی و اعداد
                      .replace(/[.,/#!$%^&*;:{}=\-_`~()؟«»،؛\[\]<>؟"'"٫]/g, " ") // حذف علائم سجاوندی فارسی و انگلیسی
                  }
                />
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default ArticlesChart;
