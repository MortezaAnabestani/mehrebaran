import { Link } from "react-router-dom";
import ArticlesList from "../../components/lists/ArticlesList";
const Articles = () => {
  return (
    <div className="bg-white rounded-md">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-medium">فهرست مقاله‌ها</h2>
        <Link
          rel="preconnect"
          to={"/dashboard/articles/create"}
          className="px-4 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
        >
          <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
            ایجاد مقاله
          </span>
        </Link>
      </div>
      <ArticlesList />
    </div>
  );
};

export default Articles;
