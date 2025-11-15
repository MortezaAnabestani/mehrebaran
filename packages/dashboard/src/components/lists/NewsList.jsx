import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../../features/newsSlice";
import NewsListIndex from "./NewsListIndex";

const NewsList = () => {
  const dispatch = useDispatch();
  const { news, loading } = useSelector((state) => state.news);

  const [filters, setFilters] = useState({
    status: "",
    searchQuery: "",
    limit: 10,
    page: 1,
  });

  // بارگذاری اخبار با فیلترهای مناسب
  useEffect(() => {
    const loadNews = async () => {
      try {
        // ساخت پارامترهای فیلتر
        const params = {
          page: filters.page,
          limit: filters.limit,
        };

        // افزودن فیلترهای اضافی اگر وجود داشته باشند
        if (filters.status) params.status = filters.status;
        if (filters.searchQuery) params.title = filters.searchQuery;

        // ارسال درخواست با پارامترهای فیلتر
        await dispatch(fetchNews(params)).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری اخبار:", error);
      }
    };

    loadNews();
  }, [dispatch, filters.page, filters.limit, filters.status, filters.searchQuery]);

  // تغییر وضعیت فیلتر
  const handleStatusChange = (e) => {
    setFilters({
      ...filters,
      status: e.target.value,
      page: 1, // بازگشت به صفحه اول هنگام تغییر فیلتر
    });
  };

  // تغییر متن جستجو
  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      searchQuery: e.target.value,
      page: 1, // بازگشت به صفحه اول هنگام تغییر جستجو
    });
  };

  // تغییر تعداد آیتم‌ها در هر صفحه
  const handleLimitChange = (e) => {
    setFilters({
      ...filters,
      limit: parseInt(e.target.value),
      page: 1, // بازگشت به صفحه اول هنگام تغییر تعداد آیتم‌ها
    });
  };

  // رفتن به صفحه بعد
  const goToNextPage = () => {
    if (news?.pagination?.totalPages && filters.page < news.pagination.totalPages) {
      setFilters({
        ...filters,
        page: filters.page + 1,
      });
    }
  };

  // رفتن به صفحه قبل
  const goToPrevPage = () => {
    if (filters.page > 1) {
      setFilters({
        ...filters,
        page: filters.page - 1,
      });
    }
  };

  // محاسبه اطلاعات پیجینیشن
  const totalPages = news?.pagination?.totalPages || 1;
  const currentPage = filters.page;
  const totalItems = news?.pagination?.total || 0;

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex items-center gap-4 mb-6">
        <select
          name="status"
          value={filters.status}
          onChange={handleStatusChange}
          className="w-43 lg:w-48 px-2 lg:px-4 py-2 text-sm rounded-md border border-blue-200 focus:border-blue-300 focus:outline-none"
        >
          <option value="">وضعیت محتوا</option>
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشر شده</option>
          <option value="archived">بایگانی</option>
        </select>
        <input
          type="text"
          placeholder="بخشی از عنوان را بنویسید"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 text-sm py-2 rounded-md border border-blue-200 focus:border-blue-300 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <NewsListIndex news={news} />
      )}

      <div className="flex justify-between items-center py-6">
        <div className="flex gap-4 items-center group">
          <label className="text-xs font-medium">تعداد </label>
          <select
            name="limit"
            value={filters.limit}
            onChange={handleLimitChange}
            className="px-2 py-1 rounded-md border border-blue-200 focus:border-blue-300 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            {currentPage}/{totalPages} از {totalItems}
          </span>
          <div className="flex gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className={`${
                currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-gray-600"
              }`}
            >
              <img
                className="w-6 h-6 text-gray-300"
                src="/assets/images/dashboard/icons/rightArrow.svg"
                alt="right arrow"
              />
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              className={`${
                currentPage >= totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:text-gray-600"
              }`}
            >
              <img
                className="w-6 h-6 text-gray-300"
                src="/assets/images/dashboard/icons/leftArrow.svg"
                alt="left arrow"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsList;
