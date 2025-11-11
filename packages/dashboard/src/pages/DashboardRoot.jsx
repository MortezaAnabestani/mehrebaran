import { Link } from "react-router-dom";
import { lazy } from "react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssues } from "../features/issuesSlice";
import { fetchArticles } from "../features/articlesSlice";
import DashboardTop from "../components/root/DashboardTop";
import DashboardHead from "../components/root/DashboardHead";
const SiteViewChart = lazy(() => import("../pages/charts/SiteVieweChart"));
const CarouselWithContent = lazy(() => import("../components/root/Carousel"));
import axios from "axios";

const RootIndex = () => {
  const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

  const { articles } = useSelector((state) => state.articles);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedComments, setSelectedComments] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    let ignore = false;
    setSelectedArticle(null);
    setSelectedIssue(null);

    async function fetchComments() {
      const { data } = await axios.get(`${BASE_URL}/comments`);
      setSelectedComments(data?.comments);
    }
    fetchComments();
    dispatch(fetchArticles()).then((result) => {
      if (!ignore) {
        setSelectedArticle(result.payload.articles[0]);
      }
    });
    dispatch(fetchIssues()).then((result) => {
      if (!ignore) {
        setSelectedIssue(result.payload.issues[0]);
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
        selectedIssue={selectedIssue}
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
