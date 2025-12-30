import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../../features/videosSlice";
import VideosListIndex from "./VideosListIndex";
import { Search, Filter, List, ChevronDown } from "lucide-react"; // فرض بر نصب بودن lucide-react

const VideosList = () => {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.videos);

  const [filters, setFilters] = useState({
    status: "",
    searchQuery: "",
    limit: 10,
    page: 1,
  });

  // بارگذاری ویدئوها
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
        };
        if (filters.status) params.status = filters.status;
        if (filters.searchQuery) params.title = filters.searchQuery;

        await dispatch(fetchVideos(params)).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری ویدئوها:", error);
      }
    };

    loadVideos();
  }, [dispatch, filters.page, filters.limit, filters.status, filters.searchQuery]);

  // هندلرها
  const handleStatusChange = (e) => setFilters({ ...filters, status: e.target.value, page: 1 });
  const handleSearchChange = (e) => setFilters({ ...filters, searchQuery: e.target.value, page: 1 });
  const handleLimitChange = (e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 });

  const goToNextPage = () => {
    if (videos?.pagination?.totalPages && filters.page < videos.pagination.totalPages) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  const goToPrevPage = () => {
    if (filters.page > 1) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
  };

  const totalPages = videos?.pagination?.totalPages || 1;
  const currentPage = filters.page;
  const totalItems = videos?.pagination?.total || 0;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-md flex flex-col overflow-hidden font-sans">
      {/* Header Section: Engineering Style Label */}
      <div className="h-10 bg-slate-50 border-b border-slate-200 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            مدیریت محتوای ویدیویی
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            TOTAL: {totalItems}
          </span>
        </div>
      </div>

      {/* Toolbar / Filters Section */}
      <div className="p-2 border-b border-slate-200 bg-white grid grid-cols-12 gap-2">
        {/* Search Input */}
        <div className="col-span-12 lg:col-span-6 relative group">
          <div className="absolute right-2.5 top-2 pointer-events-none">
            <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#007acc]" />
          </div>
          <input
            type="text"
            placeholder="جستجو براساس عنوان..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full h-8 pr-8 pl-3 text-[12px] bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Status Filter */}
        <div className="col-span-8 lg:col-span-4 relative">
          <div className="absolute right-2.5 top-2 pointer-events-none">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <select
            name="status"
            value={filters.status}
            onChange={handleStatusChange}
            className="w-full h-8 pr-8 pl-2 text-[12px] bg-white border border-slate-200 rounded-md focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] focus:outline-none appearance-none cursor-pointer text-slate-700"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشرشده</option>
          </select>
          <ChevronDown className="absolute left-2 top-2.5 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>

        {/* Limit Selector */}
        <div className="col-span-4 lg:col-span-2 relative">
          <select
            value={filters.limit}
            onChange={handleLimitChange}
            className="w-full h-8 px-2 text-[12px] font-mono bg-white border border-slate-200 rounded-md focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] focus:outline-none cursor-pointer text-center text-slate-700"
          >
            <option value="5">5 ردیف</option>
            <option value="10">10 ردیف</option>
            <option value="20">20 ردیف</option>
            <option value="50">50 ردیف</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-slate-50/30 min-h-[300px]">
        <VideosListIndex
          videos={videos?.videos || []}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onNextPage={goToNextPage}
          onPrevPage={goToPrevPage}
        />
      </div>
    </div>
  );
};

export default VideosList;
