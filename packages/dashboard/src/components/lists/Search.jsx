import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchArticleBySlug } from "../../features/articlesSlice";
import api from "../../services/api";

const Search = ({ chart = false }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();

  const persianTypeName = (type) => {
    switch (type) {
      case "article":
      case "articles":
        return "مقاله";
      case "authors":
        return "نویسنده";
      case "video":
      case "videos":
        return "ویدیو";
      case "gallery":
      case "galleries":
        return "گالری";
      case "project":
      case "projects":
        return "پروژه";
      case "news":
        return "خبر";
      case "focus-area":
        return "حوزه فعالیت";
      default:
        return type;
    }
  };

  const passArticleSlug = (slug) => {
    dispatch(fetchArticleBySlug(slug));
  };

  // تابع جستجوی debounced برای جلوگیری از ارسال درخواست زیاد
  const debouncedSearch = debounce(async (value) => {
    if (value.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await api.get("/search", {
        params: { query: value.trim() }
      });
      setResults(res?.data?.results || []); // استخراج results از پاسخ API
    } catch (err) {
      console.error(err);
    }
  }, 400); // ۴۰۰ میلی‌ثانیه تأخیر

  useEffect(() => {
    debouncedSearch(query);
    return debouncedSearch.cancel;
  }, [query]);

  return (
    <div className=" lg:pl-32 relative md:w-[500px]">
      <div className="flex items-center gap-1 md:w-[530px]">
        <input
          type="text"
          name="search"
          id="topbar-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5"
          placeholder="جستجو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <img
          src="/assets/images/dashboard/icons/searchIcon.svg"
          className="w-6 h-6  pointer-events-none"
          alt="search icon"
        />
      </div>
      {/* نمایش نتایج */}
      {results?.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded shadow">
          {results
            .filter((item) => (chart ? item.type === "article" : true))
            .map((item, index) => {
              // تبدیل type به فرمت مناسب برای route
              const routeType = item.type === "article" ? "articles" :
                               item.type === "video" ? "videos" :
                               item.type === "gallery" ? "galleries" :
                               item.type === "project" ? "projects" :
                               item.type;
              const path = `${routeType}/edit/${item.slug || item.id}`;

              return (
                <Link
                  rel="preconnect"
                  prefetch={true}
                  to={!chart && path}
                  key={item.id || index}
                  onClick={chart ? () => passArticleSlug(item.slug) : () => setResults([])}
                >
                  <li className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b border-red-100">
                    <p>{item.title || item._id}</p>
                    <p className="text-xs py-1 px-3 bg-red-100 rounded-full">{persianTypeName(item.type)}</p>
                  </li>
                </Link>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default Search;
