import { Link } from "react-router-dom";
import AuthorsListIndex from "../../components/lists/AuthorsListIndex";

const AuthorsPage = () => {
  return (
    <div className="ml-3">
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">مجمع نویسندگان</h2>
          <Link
            rel="preconnect"
            to="/dashboard/authors/create"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
              اضافه‌کردن نویسنده
            </span>
          </Link>
        </div>
      </div>
      <AuthorsListIndex />
    </div>
  );
};

export default AuthorsPage;
