import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPopularTags, getTrendingTags, searchTags, getNeedsByTag } from "../../features/socialSlice";
import {
  HashtagIcon,
  MagnifyingGlassIcon,
  FireIcon,
  ChartBarIcon,
  ArrowRightIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const SocialTags = () => {
  const dispatch = useDispatch();
  const { popularTags, trendingTags, tagResults, needsByTag, loading } = useSelector((state) => state.social);

  const [activeTab, setActiveTab] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  // بارگذاری اولیه
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(getPopularTags({ limit: 50 })).unwrap(),
          dispatch(getTrendingTags({ limit: 50 })).unwrap(),
        ]);
      } catch (error) {
        console.error("خطا در بارگذاری تگ‌ها:", error);
      }
    };
    loadData();
  }, [dispatch]);

  // هندلر جستجو
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      await dispatch(searchTags(searchQuery)).unwrap();
      setActiveTab("search");
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  // هندلر کلیک روی تگ
  const handleTagClick = async (tag) => {
    const tagName = tag.name || tag._id || tag;
    setSelectedTag(tagName);
    try {
      await dispatch(getNeedsByTag(tagName)).unwrap();
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  // کامپوننت وضعیت (Badge)
  const StatusBadge = ({ status }) => {
    const styles = {
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      in_progress: "bg-amber-50 text-amber-700 border-amber-200",
      default: "bg-slate-100 text-slate-600 border-slate-200",
    };
    const style = styles[status] || styles.default;

    return (
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${style}`}>
        {status === "completed" ? "تکمیل شده" : status === "in_progress" ? "در جریان" : "نامشخص"}
      </span>
    );
  };

  // رندر لیست تگ‌ها
  const renderTagsList = (tags, showCount = true) => {
    if (!tags || tags.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-300 rounded-md bg-slate-50">
          <TagIcon className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-[12px] text-slate-500 font-medium">تگی یافت نشد</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 content-start">
        {tags.map((tag, index) => {
          const tagName = tag.name || tag._id || tag;
          const isSelected = selectedTag === tagName;

          return (
            <button
              key={tagName || index}
              onClick={() => handleTagClick(tagName)}
              className={`
                group flex items-center gap-2 px-3 py-1.5 rounded-md border text-[12px] transition-all duration-150
                ${
                  isSelected
                    ? "bg-[#007acc] border-[#007acc] text-white shadow-sm"
                    : "bg-white border-slate-300 text-slate-700 hover:border-[#007acc] hover:text-[#007acc] hover:bg-blue-50"
                }
              `}
            >
              <span className="font-medium">#{tagName}</span>
              {showCount && tag.count && (
                <span
                  className={`
                  px-1.5 py-0.5 rounded text-[10px] font-mono border
                  ${
                    isSelected
                      ? "bg-white/20 text-white border-white/20"
                      : "bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-white group-hover:border-blue-200"
                  }
                `}
                >
                  {tag.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header & Search Section */}
        <div className="bg-white border border-slate-300 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md border border-blue-100">
              <HashtagIcon className="w-5 h-5 text-[#007acc]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900">کاوشگر تگ‌ها</h1>
              <p className="text-[11px] text-slate-500 mt-0.5">مدیریت و جستجوی برچسب‌های سیستم</p>
            </div>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="جستجوی تگ (Enter بزنید)..."
                className="w-full h-9 pl-3 pr-9 text-[12px] bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all placeholder:text-slate-400"
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
            <button
              onClick={handleSearch}
              className="h-9 px-4 bg-[#007acc] hover:bg-blue-700 text-white text-[12px] font-medium rounded-md transition-colors flex items-center gap-2"
            >
              جستجو
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Tags List (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white border border-slate-300 rounded-md overflow-hidden flex flex-col h-full min-h-[500px]">
              {/* Custom Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50/50 px-2 pt-2">
                {[
                  { id: "popular", label: "محبوب‌ترین", icon: ChartBarIcon },
                  { id: "trending", label: "در حال ترند", icon: FireIcon },
                  ...(tagResults?.length > 0
                    ? [{ id: "search", label: "نتایج جستجو", icon: MagnifyingGlassIcon }]
                    : []),
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium rounded-t-md border-t border-x transition-all relative top-[1px]
                      ${
                        activeTab === tab.id
                          ? "bg-white border-slate-300 border-b-white text-[#007acc] z-10"
                          : "bg-transparent border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      }
                    `}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4 flex-1">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-[#007acc]"></div>
                  </div>
                ) : (
                  <>
                    {activeTab === "popular" && renderTagsList(popularTags, true)}
                    {activeTab === "trending" && renderTagsList(trendingTags, true)}
                    {activeTab === "search" && renderTagsList(tagResults, false)}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Needs Details (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-300 rounded-md flex flex-col h-full min-h-[500px] sticky top-4">
              <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-[12px] font-bold text-slate-800 flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-slate-500" />
                  جزئیات تگ
                </h3>
                {selectedTag && (
                  <span className="text-[11px] font-mono text-[#007acc] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    #{selectedTag}
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto max-h-[600px] p-0">
                {!selectedTag ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-3">
                      <ArrowRightIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-[12px] text-slate-500">
                      یک تگ را از لیست انتخاب کنید تا
                      <br />
                      نیازهای مرتبط نمایش داده شوند.
                    </p>
                  </div>
                ) : loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-[#007acc]"></div>
                  </div>
                ) : needsByTag && needsByTag.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {needsByTag.map((need) => (
                      <div key={need._id} className="p-3 hover:bg-slate-50 transition-colors group">
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="text-[12px] font-semibold text-slate-800 line-clamp-1 group-hover:text-[#007acc] transition-colors">
                            {need.title}
                          </h4>
                          <StatusBadge status={need.status} />
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                          {need.description}
                        </p>

                        <div className="flex items-center justify-end pt-1">
                          <Link
                            to={`/dashboard/needs/${need._id}`}
                            className="text-[11px] font-medium text-[#007acc] hover:text-blue-800 flex items-center gap-1"
                          >
                            مشاهده جزئیات
                            <ArrowRightIcon className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[12px] text-slate-400">نیازی با این تگ یافت نشد</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialTags;
