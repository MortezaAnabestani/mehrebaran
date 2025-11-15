import { Link } from "react-router-dom";
import GalleriesList from "../../components/lists/GalleriesList";

const Galleries = () => {
  return (
    <div className="bg-white rounded-md">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-medium">فهرست گالری‌ها</h2>
        <Link
          rel="preconnect"
          to={"/dashboard/galleries/create"}
          className="px-4 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
        >
          <span className="text-slate-50 w-1 animate-pulse animate-thrice animate-ease-in-out">
            ایجاد گالری جدید
          </span>
        </Link>
      </div>
      <GalleriesList />
    </div>
  );
};

export default Galleries;
