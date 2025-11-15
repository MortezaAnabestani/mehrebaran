import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGalleries } from "../../features/galleriesSlice";
import GalleriesListIndex from "./GalleriesListIndex";

const GalleriesList = () => {
  const dispatch = useDispatch();
  const { galleries, loading } = useSelector((state) => state.galleries);

  const [filters, setFilters] = useState({
    status: "",
    searchQuery: "",
    limit: 10,
    page: 1,
  });

  // بارگذاری گالری‌ها با فیلترهای مناسب
  useEffect(() => {
    const loadGalleries = async () => {
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
        await dispatch(fetchGalleries(params)).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری گالری‌ها:", error);
      }
    };

    loadGalleries();
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
    if (galleries?.pagination?.totalPages && filters.page < galleries.pagination.totalPages) {
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
  const totalPages = galleries?.pagination?.totalPages || 1;
  const currentPage = filters.page;
  const totalItems = galleries?.pagination?.total || 0;

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex items-center gap-4 mb-6">
        <select
          name="status"
          value={filters.status}
          onChange={handleStatusChange}
          className="w-43 lg:w-48 px-2 lg:px-4 py-2 text-sm rounded-md border border-red-200 focus:border-red-300 focus:outline-none"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشرشده</option>
        </select>

        <input
          type="text"
          placeholder="جستجو براساس عنوان..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 text-sm rounded-md border border-gray-200 focus:border-gray-300 focus:outline-none"
        />

        <select
          value={filters.limit}
          onChange={handleLimitChange}
          className="w-20 px-2 py-2 text-sm rounded-md border border-gray-200 focus:border-gray-300 focus:outline-none"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <GalleriesListIndex
        galleries={galleries?.galleries || []}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onNextPage={goToNextPage}
        onPrevPage={goToPrevPage}
      />
    </div>
  );
};

export default GalleriesList;
