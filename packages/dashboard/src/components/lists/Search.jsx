import { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchArticleBySlug } from "../../features/articlesSlice";

const Search = ({ chart = false }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;
  const dispatch = useDispatch();

  const persianTypeName = (type) => {
    switch (type) {
      case "articles":
        return "مقاله";
      case "authors":
        return "نویسنده";
      case "educations":
        return "محتوای آموزشی";
      case "events":
        return "رویداد";
      case "galleries":
        return "گالری";
      case "issues":
        return "شماره‌های نشریه";
      case "honors":
        return "افتخارات";
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
      const res = await axios.get(`${BASE_URL}/search?q=${value}`);
      setResults(res?.data); // مثلا آرایه‌ای از نتایج
    } catch (err) {
      console.error(err);
    }
  }, 400); // ۴۰۰ میلی‌ثانیه تأخیر

  useEffect(() => {
    debouncedSearch(query);
    return debouncedSearch.cancel;
  }, [query]);

  return (
    <div className=" lg:pl-32 relative md:w-[500px] z-200">
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
            .flatMap((group) => {
              const type = chart ? "articles" : group.type;
              const items = Object.keys(group)
                .filter((key) => (chart ? key !== "type" && group.type === "articles" : key !== "type"))
                .map((key) => ({
                  ...group[key],
                  type,
                }));
              return items;
            })
            .map((item, index) => {
              const path = `${item.type}/edit/${item.slug || item._id}`;
              return (
                <Link
                  rel="preconnect"
                  prefetch={true}
                  to={!chart && path}
                  key={index}
                  onClick={chart ? () => passArticleSlug(item.slug) : () => setResults([])}
                >
                  <li className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b border-red-100">
                    <p>{item.title || item.name || item._id}</p>
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
