import { Link } from "react-router-dom";
import { lazy } from "react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../features/articlesSlice";
import DashboardTop from "../components/root/DashboardTop";
import DashboardHead from "../components/root/DashboardHead";
const SiteViewChart = lazy(() => import("../pages/charts/SiteVieweChart"));
const CarouselWithContent = lazy(() => import("../components/root/Carousel"));
import api from "../services/api";

const RootIndex = () => {
  const { articles } = useSelector((state) => state.articles);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedComments, setSelectedComments] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    let ignore = false;
    setSelectedArticle(null);

    async function fetchComments() {
      const { data } = await api.get("/comments");
      setSelectedComments(data?.comments);
    }
    fetchComments();
    dispatch(fetchArticles()).then((result) => {
      if (!ignore) {
        setSelectedArticle(result.payload.articles[0]);
      }
    });

    return () => {
      ignore = true;
    };
  }, [dispatch]);

  // مثلا در useEffect مسیر قبلی
  useEffect(() => {
    import("../components/textEditor/TextEditor");
  }, []);

  return (
    <div className="relative mt-6 hidden md:block">
      <DashboardHead />
      <DashboardTop
        selectedArticle={selectedArticle}
        selectedComments={selectedComments}
      />
      <SiteViewChart root={true} />
      <div className="bg-white p-6 mt-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4 border-b border-gray-500">
          <h2 className="text-md font-bold pb-4">مقالات اخیر</h2>
          <Link
            rel="preconnect"
            to="/dashboard/articles"
            className="px-2 py-[3px] bg-gray-600 rounded-sm hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 text-xs animate-pulse animate-thrice animate-ease-in-out">
              نمایش همه
            </span>
          </Link>
        </div>
        <CarouselWithContent contents={articles.articles} number={1} subject={"article"} />
      </div>
    </div>
  );
};

export default RootIndex;
