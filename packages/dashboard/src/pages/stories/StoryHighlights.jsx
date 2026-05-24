import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllHighlights, deleteHighlight } from "../../features/storiesSlice";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PhotoIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";
import toast from "react-hot-toast";

const StoryHighlights = () => {
  const dispatch = useDispatch();
  const { allHighlights, loading, pagination } = useSelector((state) => state.stories);

  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 24, // افزایش تعداد آیتم در صفحه به دلیل طراحی فشرده‌تر
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    highlightId: null,
    title: "",
  });

  // بارگذاری اولیه
  useEffect(() => {
    loadData();
  }, [filters.page, filters.search]);

  const loadData = async () => {
    try {
      await dispatch(fetchAllHighlights(filters)).unwrap();
    } catch (error) {
      console.error("Error loading highlights:", error);
    }
  };

  // محاسبه آمار (Memoized)
  const stats = useMemo(() => {
    const total = pagination.total || allHighlights.length;
    const stories = allHighlights.reduce((sum, h) => sum + (h.stories?.length || 0), 0);
    const avg = total > 0 ? (stories / total).toFixed(1) : 0;

    return [
      { label: "TOTAL_HIGHLIGHTS", value: total },
      { label: "TOTAL_STORIES", value: stories },
      { label: "AVG_DENSITY", value: avg },
    ];
  }, [allHighlights, pagination.total]);

  // هندلرها
  const handleDelete = (id, title) => {
    setDeleteModal({ isOpen: true, highlightId: id, title });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteHighlight(deleteModal.highlightId)).unwrap();
      setDeleteModal({ isOpen: false, highlightId: null, title: "" });
      toast.success("آیتم با موفقیت حذف شد");
      loadData();
    } catch (error) {
      toast.error("خطا در عملیات حذف");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4">
      {/* --- HEADER & METRICS BAR --- */}
      <div className="bg-white border border-slate-200 rounded-md mb-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-3 gap-4">
          {/* Title & Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#007acc]/10 flex items-center justify-center rounded-md border border-[#007acc]/20">
              <SparklesIcon className="w-4 h-4 text-[#007acc]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wider">هایلایت‌ها</h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span>ادمین</span>
                <span>/</span>
                <span>مدیریت محتوای شبکه اجتماعی</span>
              </div>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}:</span>
                <span className="text-xs font-mono font-medium text-slate-700">{stat.value}</span>
                {index < stats.length - 1 && <div className="h-3 w-[1px] bg-slate-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar: Search & Actions */}
        <div className="border-t border-slate-100 p-2 flex flex-col sm:flex-row gap-2 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all bg-white"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => loadData()}
              className="p-1.5 text-slate-500 hover:text-[#007acc] hover:bg-[#007acc]/5 rounded border border-transparent hover:border-[#007acc]/20 transition-all"
              title="Refresh Data"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <div className="h-4 w-[1px] bg-slate-300 mx-1" />
            <span className="text-[11px] text-slate-500 font-mono">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-1.5 border border-slate-200 rounded bg-white disabled:opacity-50 hover:border-[#007acc] hover:text-[#007acc] transition-colors"
              >
                <ChevronRightIcon className="w-3 h-3" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-1.5 border border-slate-200 rounded bg-white disabled:opacity-50 hover:border-[#007acc] hover:text-[#007acc] transition-colors"
              >
                <ChevronLeftIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      {loading && allHighlights.length === 0 ? (
        <div className="flex justify-center items-center h-64 border border-dashed border-slate-300 rounded-md bg-slate-50/50">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-[#007acc] rounded-full"></div>
            <span className="text-xs text-slate-500 font-mono">LOADING_DATA...</span>
          </div>
        </div>
      ) : allHighlights.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
          {allHighlights.map((highlight) => (
            <div
              key={highlight._id}
              className="group bg-white border border-slate-200 rounded-md p-2 hover:border-[#007acc] transition-all duration-200 flex gap-3 items-start"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 shrink-0 rounded border border-slate-100 overflow-hidden bg-slate-100">
                {highlight.coverImage ? (
                  <img src={highlight.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <PhotoIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] px-1 font-mono">
                  {highlight.stories?.length || 0}
                </div>
              </div>

              {/* Data Content */}
              <div className="flex-1 min-w-0 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-700 truncate mb-1" title={highlight.title}>
                    {highlight.title || "Untitled Highlight"}
                  </h3>

                  {/* User Row */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {highlight.user?.avatar ? (
                      <img src={highlight.user.avatar} className="w-3.5 h-3.5 rounded-full" alt="" />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="text-[10px] text-slate-500 truncate max-w-[100px]">
                      {highlight.user?.name || "Unknown User"}
                    </span>
                  </div>
                </div>

                {/* Meta & Actions */}
                <div className="flex items-end justify-between border-t border-slate-100 pt-1.5 mt-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-mono">UPDATED</span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {new Date(highlight.updatedAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(highlight._id, highlight.title)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                    title="Delete Highlight"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border border-slate-200 rounded-md bg-white">
          <Squares2X2Icon className="w-10 h-10 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500 font-medium">No Highlights Found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search filters</p>
        </div>
      )}

      {/* Delete Modal Wrapper */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, highlightId: null, title: "" })}
        onConfirm={confirmDelete}
        title="CONFIRM_DELETION"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default StoryHighlights;
