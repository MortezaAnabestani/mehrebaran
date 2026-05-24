import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllTeams, deleteTeam } from "../../features/teamsSlice";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon,
  UsersIcon,
  CheckCircleIcon,
  LockClosedIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const Teams = () => {
  const dispatch = useDispatch();
  const { allTeams, loading, pagination } = useSelector((state) => state.teams);

  // State for filters and search
  const [filters, setFilters] = useState({
    status: "",
    focusArea: "",
    search: "",
    page: 1,
    limit: 20,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    teamId: null,
    needId: null,
    teamName: "",
  });

  // Fetch teams on mount and when filters change
  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.focusArea) params.focusArea = filters.focusArea;
    if (filters.search) params.search = filters.search;
    params.page = filters.page;
    params.limit = filters.limit;

    dispatch(fetchAllTeams(params));
  }, [dispatch, filters]);

  const handleDelete = (needId, teamId, teamName) => {
    setDeleteModal({
      isOpen: true,
      teamId,
      needId,
      teamName,
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteTeam({ needId: deleteModal.needId, teamId: deleteModal.teamId })).unwrap();
      setDeleteModal({ isOpen: false, teamId: null, needId: null, teamName: "" });
      // Refresh teams list
      const params = { ...filters };
      dispatch(fetchAllTeams(params));
    } catch (error) {
      console.error("خطا در حذف تیم:", error);
    }
  };

  // Helpers
  const getStatusLabel = (status) => {
    const statusMap = {
      active: "فعال",
      paused: "متوقف",
      completed: "تکمیل",
      disbanded: "منحل",
    };
    return statusMap[status] || status;
  };

  const getStatusStyles = (status) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-600 border-emerald-200",
      paused: "bg-amber-50 text-amber-600 border-amber-200",
      completed: "bg-blue-50 text-blue-600 border-blue-200",
      disbanded: "bg-slate-50 text-slate-500 border-slate-200",
    };
    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const getFocusAreaLabel = (focusArea) => {
    const focusMap = {
      fundraising: "مالی",
      logistics: "لجستیک",
      communication: "ارتباطات",
      technical: "فنی",
      volunteer: "داوطلبی",
      coordination: "هماهنگی",
      documentation: "مستندسازی",
      general: "عمومی",
    };
    return focusMap[focusArea] || focusArea;
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
      status: "",
      focusArea: "",
      search: "",
      page: 1,
      limit: 20,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const networkStats = useMemo(() => {
    if (!allTeams || !Array.isArray(allTeams)) {
      return {
        totalTeams: 0,
        activeTeams: 0,
        totalMembers: 0,
        completedTeams: 0,
        privateTeams: 0,
        avgMembersPerTeam: 0,
        topFocusArea: "-",
      };
    }

    const totalTeams = pagination.total || allTeams.length;
    const activeTeams = allTeams.filter((t) => t.status === "active").length;
    const completedTeams = allTeams.filter((t) => t.status === "completed").length;
    const privateTeams = allTeams.filter((t) => t.isPrivate).length;

    const totalMembers = allTeams.reduce((sum, team) => {
      const count = team.activeMembers || team.members?.filter((m) => m.isActive).length || 0;
      return sum + count;
    }, 0);

    const avgMembersPerTeam = totalTeams > 0 ? Math.round(totalMembers / totalTeams) : 0;

    const focusAreaCounts = {};
    allTeams.forEach((team) => {
      const area = team.focusArea || "general";
      focusAreaCounts[area] = (focusAreaCounts[area] || 0) + 1;
    });

    const topFocusAreaKey = Object.keys(focusAreaCounts).reduce(
      (a, b) => (focusAreaCounts[a] > focusAreaCounts[b] ? a : b),
      "general"
    );

    return {
      totalTeams,
      activeTeams,
      totalMembers,
      completedTeams,
      privateTeams,
      avgMembersPerTeam,
      topFocusArea: getFocusAreaLabel(topFocusAreaKey),
    };
  }, [allTeams, pagination.total]);

  // --- Sub-components for cleaner render ---

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
              مدیریت تیم‌های شبکه
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              سامانه نظارت و مدیریت متمرکز تیم‌های عملیاتی
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-medium text-blue-700">
              نسخه ۱.۲.۰
            </div>
            <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-600">
              {pagination.total || 0} رکورد یافت شد
            </div>
          </div>
        </div>

        {/* Stats Bar - High Density Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-md overflow-hidden shadow-sm">
          <StatItem
            label="کل تیم‌ها"
            value={networkStats.totalTeams}
            icon={ChartBarIcon}
            colorClass="text-blue-600"
          />
          <StatItem
            label="فعال"
            value={networkStats.activeTeams}
            icon={CheckCircleIcon}
            colorClass="text-emerald-600"
          />
          <StatItem
            label="اعضا"
            value={networkStats.totalMembers}
            icon={UsersIcon}
            colorClass="text-indigo-600"
          />
          <StatItem
            label="میانگین اعضا"
            value={networkStats.avgMembersPerTeam}
            icon={UserGroupIcon}
            colorClass="text-orange-600"
          />
          <StatItem
            label="تکمیل شده"
            value={networkStats.completedTeams}
            icon={CheckCircleIcon}
            colorClass="text-cyan-600"
          />
          <StatItem
            label="خصوصی"
            value={networkStats.privateTeams}
            icon={LockClosedIcon}
            colorClass="text-amber-600"
          />
          <StatItem
            label="حوزه برتر"
            value={networkStats.topFocusArea}
            icon={ChartBarIcon}
            colorClass="text-pink-600"
          />
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="bg-white border border-slate-200 rounded-md p-3 flex flex-col lg:flex-row gap-3 items-center justify-between shadow-sm">
          <div className="flex flex-1 w-full gap-3 items-center">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="جستجو در نام، توضیحات..."
                className="w-full h-9 pr-9 pl-3 text-sm bg-slate-50 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-400"
                value={filters.search}
                onChange={handleSearch}
              />
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            <select
              className="h-9 px-3 text-sm bg-white border border-slate-200 rounded focus:border-blue-500 outline-none cursor-pointer min-w-[140px]"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="paused">متوقف شده</option>
              <option value="completed">تکمیل شده</option>
              <option value="disbanded">منحل شده</option>
            </select>

            <select
              className="h-9 px-3 text-sm bg-white border border-slate-200 rounded focus:border-blue-500 outline-none cursor-pointer min-w-[140px]"
              value={filters.focusArea}
              onChange={(e) => handleFilterChange("focusArea", e.target.value)}
            >
              <option value="">همه حوزه‌ها</option>
              <option value="fundraising">جمع‌آوری کمک مالی</option>
              <option value="logistics">لجستیک</option>
              <option value="communication">ارتباطات</option>
              <option value="technical">فنی</option>
              <option value="volunteer">داوطلبی</option>
              <option value="coordination">هماهنگی</option>
              <option value="documentation">مستندسازی</option>
              <option value="general">عمومی</option>
            </select>

            {(filters.status || filters.focusArea || filters.search) && (
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
            {allTeams && allTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allTeams.map((team) => (
                  <div
                    key={team._id}
                    className="group bg-white border border-slate-200 rounded-md hover:border-blue-400 transition-all duration-200 flex flex-col"
                  >
                    {/* Card Header */}
                    <div className="p-3 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 truncate" title={team.name}>
                          {team.name}
                        </h3>
                        {team.need && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            <p className="text-[11px] text-slate-500 truncate">نیاز: {team.need.title}</p>
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${getStatusStyles(team.status)}`}
                      >
                        {getStatusLabel(team.status)}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 flex-1 flex flex-col gap-3">
                      {/* Description */}
                      <p className="text-xs text-slate-500 line-clamp-2 min-h-[2.5em]">
                        {team.description || "توضیحات ثبت نشده است."}
                      </p>

                      {/* Key-Value Data Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <span className="block text-slate-400 mb-0.5">حوزه</span>
                          <span className="font-medium text-slate-700">
                            {getFocusAreaLabel(team.focusArea)}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <span className="block text-slate-400 mb-0.5">دسترسی</span>
                          <span className="font-medium text-slate-700">
                            {team.isPrivate ? "خصوصی" : "عمومی"}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <span className="block text-slate-400 mb-0.5">اعضا</span>
                          <span className="font-mono font-medium text-slate-700">
                            {team.activeMembers || team.members?.filter((m) => m.isActive).length || 0}
                            <span className="text-slate-400 mx-0.5">/</span>
                            {team.maxMembers || "∞"}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <span className="block text-slate-400 mb-0.5">تسک‌ها</span>
                          <span className="font-mono font-medium text-slate-700">
                            {team.tasksCompletedByTeam || 0}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      {team.tags && team.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-auto pt-2">
                          {team.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200"
                            >
                              #{tag}
                            </span>
                          ))}
                          {team.tags.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
                              +{team.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer / Actions */}
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                      {team.need && (
                        <Link
                          to={`/dashboard/teams/${team.need._id}/${team._id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-white border border-slate-200 hover:border-[#007acc] hover:text-[#007acc] text-slate-600 text-xs font-medium rounded transition-colors"
                        >
                          <EyeIcon className="w-3.5 h-3.5" />
                          مشاهده
                        </Link>
                      )}
                      {team.need && (
                        <>
                          <button
                            onClick={() =>
                              (window.location.href = `/dashboard/teams/${team.need._id}/${team._id}/edit`)
                            }
                            className="h-8 w-8 flex items-center justify-center bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 text-slate-500 rounded transition-colors"
                            title="ویرایش"
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(team.need._id, team._id, team.name)}
                            className="h-8 w-8 flex items-center justify-center bg-white border border-slate-200 hover:border-red-400 hover:text-red-600 text-slate-500 rounded transition-colors"
                            title="حذف"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 border-dashed rounded-md">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <MagnifyingGlassIcon className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">تیمی یافت نشد</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {filters.status || filters.focusArea || filters.search
                    ? "لطفاً فیلترهای جستجو را تغییر دهید."
                    : "هنوز هیچ تیمی در شبکه ایجاد نشده است."}
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
        onClose={() => setDeleteModal({ isOpen: false, teamId: null, needId: null, teamName: "" })}
        onConfirm={confirmDelete}
        title="حذف تیم"
        message={`آیا از حذف تیم "${deleteModal.teamName}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
      />
    </div>
  );
};

export default Teams;
