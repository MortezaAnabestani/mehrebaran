import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBadgesWithStats, deleteBadge } from "../../features/gamificationSlice";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TrophyIcon,
  ArrowPathIcon,
  FunnelIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";
import BadgeIcon from "../../components/BadgeIcon";

const Badges = () => {
  const dispatch = useDispatch();
  const { badges, loading } = useSelector((state) => state.gamification);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    rarity: "",
    isActive: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    badgeId: null,
    badgeName: "",
  });

  // بارگذاری نشان‌ها
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await dispatch(fetchBadgesWithStats()).unwrap();
    } catch (error) {
      console.error("Error loading badges:", error);
    }
  };

  // فیلتر کردن نشان‌ها
  const filteredBadges = useMemo(() => {
    if (!badges || !Array.isArray(badges)) return [];

    return badges.filter((badge) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = badge.name?.toLowerCase().includes(searchLower);
        const matchesNameEn = badge.nameEn?.toLowerCase().includes(searchLower);
        const matchesDesc = badge.description?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesNameEn && !matchesDesc) return false;
      }

      // Category filter
      if (filters.category && badge.category !== filters.category) return false;

      // Rarity filter
      if (filters.rarity && badge.rarity !== filters.rarity) return false;

      // Active status filter
      if (filters.isActive !== "") {
        const isActive = filters.isActive === "true";
        if (badge.isActive !== isActive) return false;
      }

      return true;
    });
  }, [badges, filters]);

  // آمار (Memoized)
  const stats = useMemo(() => {
    const total = badges?.length || 0;
    const active = badges?.filter((b) => b.isActive)?.length || 0;
    const inactive = total - active;
    const totalRecipients = badges?.reduce((sum, b) => sum + (b.recipientCount || 0), 0) || 0;

    return [
      { label: "TOTAL_BADGES", value: total },
      { label: "ACTIVE", value: active },
      { label: "INACTIVE", value: inactive },
      { label: "RECIPIENTS", value: totalRecipients },
    ];
  }, [badges]);

  // حذف نشان
  const handleDelete = (id, name) => {
    setDeleteModal({ isOpen: true, badgeId: id, badgeName: name });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteBadge(deleteModal.badgeId)).unwrap();
      setDeleteModal({ isOpen: false, badgeId: null, badgeName: "" });
    } catch (error) {
      console.error("Error deleting badge:", error);
    }
  };

  // تبدیل category به فارسی
  const getCategoryLabel = (category) => {
    const categoryMap = {
      contributor: "مشارکت‌کننده",
      supporter: "حمایت‌کننده",
      creator: "سازنده",
      helper: "کمک‌کننده",
      communicator: "ارتباط‌گیر",
      leader: "رهبر",
      expert: "متخصص",
      milestone: "نقطه عطف",
      special: "ویژه",
      seasonal: "فصلی",
    };
    return categoryMap[category] || category;
  };

  // تبدیل rarity به فارسی
  const getRarityLabel = (rarity) => {
    const rarityMap = {
      common: "معمولی",
      rare: "نادر",
      epic: "حماسی",
      legendary: "افسانه‌ای",
    };
    return rarityMap[rarity] || rarity;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4">
      {/* --- HEADER & METRICS BAR --- */}
      <div className="bg-white border border-slate-200 rounded-md mb-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-3 gap-4">
          {/* Title & Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#007acc]/10 flex items-center justify-center rounded-md border border-[#007acc]/20">
              <TrophyIcon className="w-4 h-4 text-[#007acc]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wider">مدیریت نشان‌ها</h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span>ادمین</span>
                <span>/</span>
                <span>مدیریت گیمیفیکیشن شبکه</span>
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

        {/* Toolbar: Search & Filters */}
        <div className="border-t border-slate-100 p-2 flex flex-col sm:flex-row gap-2 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search badges by name, description..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all bg-white"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all bg-white appearance-none"
            >
              <option value="">All Categories</option>
              <option value="contributor">مشارکت‌کننده</option>
              <option value="supporter">حمایت‌کننده</option>
              <option value="creator">سازنده</option>
              <option value="leader">رهبر</option>
              <option value="milestone">نقطه عطف</option>
              <option value="special">ویژه</option>
            </select>
          </div>

          {/* Rarity Filter */}
          <div className="relative">
            <select
              value={filters.rarity}
              onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
              className="pl-3 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all bg-white appearance-none"
            >
              <option value="">All Rarities</option>
              <option value="common">معمولی</option>
              <option value="rare">نادر</option>
              <option value="epic">حماسی</option>
              <option value="legendary">افسانه‌ای</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="pl-3 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all bg-white appearance-none"
            >
              <option value="">All Status</option>
              <option value="true">فعال</option>
              <option value="false">غیرفعال</option>
            </select>
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
            <Link to="/dashboard/gamification/badges/create">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-[#007acc] text-white text-xs font-medium rounded hover:bg-[#005a9e] transition-colors">
                <PlusIcon className="w-4 h-4" />
                New Badge
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      {loading && badges.length === 0 ? (
        <div className="flex justify-center items-center h-64 border border-dashed border-slate-300 rounded-md bg-slate-50/50">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-[#007acc] rounded-full"></div>
            <span className="text-xs text-slate-500 font-mono">LOADING_BADGES...</span>
          </div>
        </div>
      ) : filteredBadges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge._id}
              className="bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Badge Header with Color */}
              <div
                className="h-1.5"
                style={{ backgroundColor: badge.color || "#007acc" }}
              />

              <div className="p-3">
                {/* Icon & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: badge.color + "20" || "#007acc20" }}
                  >
                    <BadgeIcon iconName={badge.icon} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-800 truncate">{badge.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{badge.nameEn}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                  {badge.description}
                </p>

                {/* Badges & Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                      badge.rarity === "legendary"
                        ? "bg-orange-100 text-orange-700"
                        : badge.rarity === "epic"
                        ? "bg-purple-100 text-purple-700"
                        : badge.rarity === "rare"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {getRarityLabel(badge.rarity)}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-700">
                    {getCategoryLabel(badge.category)}
                  </span>
                  {badge.isSecret && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-medium">
                      مخفی
                    </span>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="bg-slate-50 rounded p-1.5 text-center">
                    <p className="text-[9px] text-slate-500 uppercase">Points</p>
                    <p className="text-xs font-bold text-slate-700">{badge.points}</p>
                  </div>
                  <div className="bg-slate-50 rounded p-1.5 text-center">
                    <p className="text-[9px] text-slate-500 uppercase">Order</p>
                    <p className="text-xs font-bold text-slate-700">{badge.order}</p>
                  </div>
                  <div className="bg-blue-50 rounded p-1.5 text-center">
                    <p className="text-[9px] text-slate-500 uppercase flex items-center justify-center gap-0.5">
                      <UserGroupIcon className="w-2.5 h-2.5" />
                      Users
                    </p>
                    <p className="text-xs font-bold text-blue-700">{badge.recipientCount || 0}</p>
                  </div>
                  <div className="bg-slate-50 rounded p-1.5 text-center">
                    <p className="text-[9px] text-slate-500 uppercase">Status</p>
                    <p
                      className={`text-xs font-bold ${
                        badge.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {badge.isActive ? "فعال" : "خاموش"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <Link
                    to={`/dashboard/gamification/badges/edit/${badge._id}`}
                    className="flex-1"
                  >
                    <button className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors">
                      <PencilIcon className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(badge._id, badge.name)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
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
          <TrophyIcon className="w-10 h-10 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500 font-medium">No Badges Found</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Try adjusting your search filters</p>
          <Link to="/dashboard/gamification/badges/create">
            <button className="flex items-center gap-1 px-4 py-2 bg-[#007acc] text-white text-xs font-medium rounded hover:bg-[#005a9e] transition-colors">
              <PlusIcon className="w-4 h-4" />
              Create First Badge
            </button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, badgeId: null, badgeName: "" })}
        onConfirm={confirmDelete}
        title="حذف نشان"
        message={`آیا از حذف نشان "${deleteModal.badgeName}" اطمینان دارید؟`}
      />
    </div>
  );
};

export default Badges;