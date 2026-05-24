import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllStories, deleteStory } from "../../features/storiesSlice";
import {
  EyeIcon,
  TrashIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon,
  HeartIcon,
  ClockIcon,
  UserIcon,
  Squares2X2Icon,
  GlobeAltIcon,
  LockClosedIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const Stories = () => {
  const dispatch = useDispatch();
  const { allStories, loading, pagination } = useSelector((state) => state.stories);

  // State for filters and search
  const [filters, setFilters] = useState({
    type: "",
    privacy: "",
    search: "",
    page: 1,
    limit: 20,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    storyId: null,
    storyCaption: "",
  });

  // بارگذاری استوری‌ها
  useEffect(() => {
    const params = { ...filters };
    dispatch(fetchAllStories(params));
  }, [dispatch, filters]);

  // حذف استوری
  const handleDelete = (storyId, caption) => {
    setDeleteModal({
      isOpen: true,
      storyId,
      storyCaption: caption || "این استوری",
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteStory(deleteModal.storyId)).unwrap();
      setDeleteModal({ isOpen: false, storyId: null, storyCaption: "" });
      // Refresh stories list
      const params = { ...filters };
      dispatch(fetchAllStories(params));
    } catch (error) {
      console.error("خطا در حذف استوری:", error);
    }
  };

  // Helpers
  const getTypeLabel = (type) => {
    const typeMap = {
      image: "تصویر",
      video: "ویدیو",
      text: "متن",
    };
    return typeMap[type] || type;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "image":
        return PhotoIcon;
      case "video":
        return VideoCameraIcon;
      case "text":
        return DocumentTextIcon;
      default:
        return PhotoIcon;
    }
  };

  const getTypeStyles = (type) => {
    const styles = {
      image: "bg-blue-50 text-blue-600 border-blue-200",
      video: "bg-purple-50 text-purple-600 border-purple-200",
      text: "bg-green-50 text-green-600 border-green-200",
    };
    return styles[type] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const getPrivacyLabel = (privacy) => {
    const privacyMap = {
      public: "عمومی",
      followers: "دنبال‌کنندگان",
      private: "خصوصی",
    };
    return privacyMap[privacy] || privacy;
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return "منقضی شده";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} روز`;
    }
    if (hours > 0) return `${hours} ساعت`;

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes} دقیقه`;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      privacy: "",
      search: "",
      page: 1,
      limit: 20,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const networkStats = useMemo(() => {
    if (!allStories || !Array.isArray(allStories)) {
      return {
        totalStories: 0,
        imageStories: 0,
        videoStories: 0,
        textStories: 0,
        totalViews: 0,
        totalReactions: 0,
        avgViewsPerStory: 0,
      };
    }

    const totalStories = pagination.total || allStories.length;
    const imageStories = allStories.filter((s) => s.type === "image").length;
    const videoStories = allStories.filter((s) => s.type === "video").length;
    const textStories = allStories.filter((s) => s.type === "text").length;

    const totalViews = allStories.reduce((sum, story) => sum + (story.viewsCount || 0), 0);
    const totalReactions = allStories.reduce((sum, story) => sum + (story.reactionsCount || 0), 0);
    const avgViewsPerStory = totalStories > 0 ? Math.round(totalViews / totalStories) : 0;

    return {
      totalStories,
      imageStories,
      videoStories,
      textStories,
      totalViews,
      totalReactions,
      avgViewsPerStory,
    };
  }, [allStories, pagination.total]);

  const StatItem = ({ label, value, icon: Icon, colorClass = "text-slate-600" }) => (
    <div className="flex flex-col justify-between p-3 bg-white first:rounded-r-md last:rounded-l-md">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
      </div>
      <span className="text-lg font-mono font-semibold text-slate-800 tracking-tight">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Squares2X2Icon className="w-6 h-6 text-[#007acc]" />
              مدیریت استوری‌های شبکه
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              سامانه نظارت و مدیریت متمرکز استوری‌های کاربران
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-medium text-blue-700">
              نسخه ۱.۰.۰
            </div>
            <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-600">
              {pagination.total || 0} رکورد یافت شد
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-md overflow-hidden shadow-sm">
          <StatItem
            label="کل استوری‌ها"
            value={networkStats.totalStories}
            icon={ChartBarIcon}
            colorClass="text-blue-600"
          />
          <StatItem
            label="تصاویر"
            value={networkStats.imageStories}
            icon={PhotoIcon}
            colorClass="text-blue-500"
          />
          <StatItem
            label="ویدیوها"
            value={networkStats.videoStories}
            icon={VideoCameraIcon}
            colorClass="text-purple-600"
          />
          <StatItem
            label="متن"
            value={networkStats.textStories}
            icon={DocumentTextIcon}
            colorClass="text-green-600"
          />
          <StatItem
            label="بازدیدها"
            value={networkStats.totalViews}
            icon={EyeIcon}
            colorClass="text-indigo-600"
          />
          <StatItem
            label="ری‌اکشن‌ها"
            value={networkStats.totalReactions}
            icon={HeartIcon}
            colorClass="text-red-600"
          />
          <StatItem
            label="میانگین بازدید"
            value={networkStats.avgViewsPerStory}
            icon={ChartBarIcon}
            colorClass="text-orange-600"
          />
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="bg-white border border-slate-200 rounded-md p-3 flex flex-col lg:flex-row gap-3 items-center justify-between shadow-sm">
          <div className="flex flex-1 w-full gap-3 items-center">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="جستجو در عنوان، متن..."
                className="w-full h-9 pr-9 pl-3 text-sm bg-slate-50 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-400"
                value={filters.search}
                onChange={handleSearch}
              />
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            <select
              className="h-9 px-3 text-sm bg-white border border-slate-200 rounded focus:border-blue-500 outline-none cursor-pointer min-w-[140px]"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">همه انواع</option>
              <option value="image">تصویر</option>
              <option value="video">ویدیو</option>
              <option value="text">متن</option>
            </select>

            <select
              className="h-9 px-3 text-sm bg-white border border-slate-200 rounded focus:border-blue-500 outline-none cursor-pointer min-w-[140px]"
              value={filters.privacy}
              onChange={(e) => handleFilterChange("privacy", e.target.value)}
            >
              <option value="">همه حریم‌ها</option>
              <option value="public">عمومی</option>
              <option value="followers">دنبال‌کنندگان</option>
              <option value="private">خصوصی</option>
            </select>

            {(filters.type || filters.privacy || filters.search) && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
              >
                حذف فیلترها
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {allStories && allStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allStories.map((story) => {
                  const TypeIcon = getTypeIcon(story.type);
                  const isExpired = new Date(story.expiresAt) < new Date();

                  return (
                    <div
                      key={story._id}
                      className="group bg-white border border-slate-200 rounded-md hover:border-blue-400 transition-all duration-200 flex flex-col overflow-hidden"
                    >
                      {/* Story Preview */}
                      <div className="relative h-48 bg-slate-100">
                        {story.type === "image" && story.media?.url ? (
                          <img
                            src={story.media.url}
                            alt="story"
                            className="w-full h-full object-cover"
                          />
                        ) : story.type === "video" && story.media?.thumbnail ? (
                          <div className="relative w-full h-full">
                            <img
                              src={story.media.thumbnail}
                              alt="story"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                                <VideoCameraIcon className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>
                        ) : story.type === "text" ? (
                          <div
                            className="w-full h-full flex items-center justify-center p-4"
                            style={{
                              backgroundColor: story.backgroundColor || "#3B82F6",
                            }}
                          >
                            <p
                              className="text-center text-sm font-medium line-clamp-4"
                              style={{ color: story.textColor || "#FFFFFF" }}
                            >
                              {story.text}
                            </p>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PhotoIcon className="w-16 h-16 text-slate-300" />
                          </div>
                        )}

                        {/* Type Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${getTypeStyles(story.type)}`}>
                            <TypeIcon className="w-3 h-3" />
                            {getTypeLabel(story.type)}
                          </span>
                        </div>

                        {/* Expired Badge */}
                        {isExpired && (
                          <div className="absolute top-2 left-2">
                            <span className="text-[10px] px-2 py-0.5 rounded border bg-red-50 text-red-600 border-red-200">
                              منقضی شده
                            </span>
                          </div>
                        )}

                        {/* Privacy Badge */}
                        <div className="absolute bottom-2 right-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 text-white flex items-center gap-1">
                            {story.privacy === "public" ? (
                              <GlobeAltIcon className="w-3 h-3" />
                            ) : story.privacy === "followers" ? (
                              <UserGroupIcon className="w-3 h-3" />
                            ) : (
                              <LockClosedIcon className="w-3 h-3" />
                            )}
                            {getPrivacyLabel(story.privacy)}
                          </span>
                        </div>
                      </div>

                      {/* Story Info */}
                      <div className="p-3 flex-1 flex flex-col gap-2">
                        {/* User */}
                        {story.user && (
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-600 truncate">
                              {story.user.name || story.user.email}
                            </span>
                          </div>
                        )}

                        {/* Caption */}
                        {story.caption && (
                          <p className="text-xs text-slate-500 line-clamp-2 min-h-[2em]">
                            {story.caption}
                          </p>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 text-[11px] mt-auto">
                          <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex items-center gap-1">
                            <EyeIcon className="w-3 h-3 text-slate-400" />
                            <span className="font-mono font-medium text-slate-700">{story.viewsCount || 0}</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex items-center gap-1">
                            <HeartIcon className="w-3 h-3 text-red-400" />
                            <span className="font-mono font-medium text-slate-700">{story.reactionsCount || 0}</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] text-slate-600 truncate">
                              {getTimeRemaining(story.expiresAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer / Actions */}
                      <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                        <Link
                          to={`/dashboard/stories/${story._id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-white border border-slate-200 hover:border-[#007acc] hover:text-[#007acc] text-slate-600 text-xs font-medium rounded transition-colors"
                        >
                          <EyeIcon className="w-3.5 h-3.5" />
                          جزئیات
                        </Link>
                        <button
                          onClick={() => handleDelete(story._id, story.caption)}
                          className="h-8 w-8 flex items-center justify-center bg-white border border-slate-200 hover:border-red-400 hover:text-red-600 text-slate-500 rounded transition-colors"
                          title="حذف"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 border-dashed rounded-md">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <MagnifyingGlassIcon className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">استوری یافت نشد</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {filters.type || filters.privacy || filters.search
                    ? "لطفاً فیلترهای جستجو را تغییر دهید."
                    : "هنوز هیچ استوری در شبکه ایجاد نشده است."}
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-xs text-slate-500">
                  صفحه <span className="font-mono font-medium text-slate-700">{pagination.page}</span> از{" "}
                  <span className="font-mono font-medium text-slate-700">{pagination.totalPages}</span>
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="h-8 w-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-8 min-w-[2rem] px-2 text-xs font-medium rounded border transition-colors ${
                          pagination.page === pageNum
                            ? "bg-[#007acc] border-[#007acc] text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="h-8 w-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, storyId: null, storyCaption: "" })}
        onConfirm={confirmDelete}
        title="حذف استوری"
        message={`آیا از حذف استوری "${deleteModal.storyCaption}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
      />
    </div>
  );
};

export default Stories;
