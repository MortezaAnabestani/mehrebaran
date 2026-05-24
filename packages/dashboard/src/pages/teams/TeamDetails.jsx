import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchTeamById, deleteTeam, removeMember } from "../../features/teamsSlice";
import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
  HashtagIcon,
  CalendarIcon,
  ChartBarIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const TeamDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { needId, teamId } = useParams();

  const { selectedTeam, loading } = useSelector((state) => state.teams);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    teamId: null,
    teamName: "",
  });

  useEffect(() => {
    if (teamId && needId) {
      dispatch(fetchTeamById({ needId, teamId }));
    }
  }, [dispatch, teamId, needId]);

  const handleDelete = () => {
    setDeleteModal({
      isOpen: true,
      teamId: selectedTeam._id,
      teamName: selectedTeam.name,
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteTeam({ needId, teamId: deleteModal.teamId })).unwrap();
      navigate("/dashboard/teams");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm("آیا از حذف این عضو اطمینان دارید؟ (این عملیات غیرقابل بازگشت است)")) {
      try {
        await dispatch(removeMember({ needId, teamId, userId })).unwrap();
      } catch (error) {
        console.error("Remove member error:", error);
      }
    }
  };

  // Utility: Status Styles (Engineering Look)
  const getStatusStyles = (status) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      paused: "bg-amber-50 text-amber-700 border-amber-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
      disbanded: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return styles[status] || "bg-slate-100 text-slate-600 border-slate-200";
  };

  const getStatusLabel = (status) => {
    const map = { active: "فعال", paused: "متوقف", completed: "تکمیل", disbanded: "منحل" };
    return map[status] || status;
  };

  const getRoleLabel = (role) => {
    const map = { leader: "رهبر تیم", co_leader: "معاون", member: "عضو" };
    return map[role] || role;
  };

  const getFocusAreaLabel = (area) => {
    const map = {
      education: "آموزش",
      medical: "پزشکی",
      construction: "عمرانی",
      financial: "مالی",
      social: "اجتماعی",
      coordination: "هماهنگی",
      awareness: "آگاهی‌رسانی",
      legal: "حقوقی",
      logistics: "لجستیک",
      other: "سایر",
    };
    return map[area] || area;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-slate-50 border border-slate-200 rounded-md">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-[#007acc] rounded-full animate-spin"></div>
          <span className="text-[12px] font-mono text-slate-500">LOADING_DATA...</span>
        </div>
      </div>
    );
  }

  if (!selectedTeam) {
    return (
      <div className="p-4 border border-rose-200 bg-rose-50 rounded-md text-rose-700 text-sm font-mono">
        ERROR: TEAM_NOT_FOUND
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-3">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/teams"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{selectedTeam.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-mono text-slate-400">ID: {selectedTeam._id}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getStatusStyles(
                  selectedTeam.status
                )}`}
              >
                {getStatusLabel(selectedTeam.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/dashboard/teams/${needId}/${teamId}/edit`}>
            <button className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-all">
              <PencilIcon className="w-3.5 h-3.5" />
              <span>ویرایش</span>
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-rose-700 bg-white border border-rose-200 rounded hover:bg-rose-50 transition-all"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            <span>حذف</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column: Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Description Panel */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
                <HashtagIcon className="w-4 h-4 text-slate-400" />
                توضیحات و جزئیات
              </h3>
              {selectedTeam.focusArea && (
                <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded">
                  {getFocusAreaLabel(selectedTeam.focusArea)}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-[13px] leading-relaxed text-slate-600 text-justify">
                {selectedTeam.description || "توضیحاتی ثبت نشده است."}
              </p>

              {selectedTeam.tags && selectedTeam.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  {selectedTeam.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-[11px] bg-slate-100 text-slate-600 rounded border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-slate-400" />
                لیست اعضا
                <span className="ml-2 px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[10px] font-mono">
                  {selectedTeam.members?.length || 0}
                </span>
              </h3>
              <button className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-white bg-[#007acc] hover:bg-[#0062a3] rounded transition-colors shadow-sm">
                <UserPlusIcon className="w-3.5 h-3.5" />
                افزودن عضو
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 text-[11px] font-medium text-slate-500">کاربر</th>
                    <th className="px-4 py-2 text-[11px] font-medium text-slate-500">نقش</th>
                    <th className="px-4 py-2 text-[11px] font-medium text-slate-500">تاریخ عضویت</th>
                    <th className="px-4 py-2 text-[11px] font-medium text-slate-500 w-10">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedTeam.members && selectedTeam.members.length > 0 ? (
                    selectedTeam.members.map((member) => (
                      <tr
                        key={member.user?._id || member.user}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-200 border border-slate-300 overflow-hidden flex-shrink-0">
                              <img
                                src={member.user?.profilePicture || "/assets/images/default-avatar.png"}
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-[13px] font-medium text-slate-800">
                                {member.user?.name || "کاربر ناشناس"}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {member.user?.email || "No Email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                              member.role === "leader"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : member.role === "co_leader"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {getRoleLabel(member.role)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-[11px] font-mono text-slate-500">
                            {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("fa-IR") : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-left">
                          {member.role !== "leader" && (
                            <button
                              onClick={() => handleRemoveMember(member.user?._id || member.user)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="حذف عضو"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[12px] text-slate-500 italic">
                        هیچ عضوی یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Stats & Meta */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Stats Grid */}
          <div className="bg-white border border-slate-200 rounded-md p-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
              آمار عملکرد
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                <div className="text-[10px] text-slate-500 mb-1">ظرفیت اعضا</div>
                <div className="text-lg font-mono font-semibold text-slate-700">
                  {selectedTeam.members?.length || 0}
                  <span className="text-slate-400 text-sm">/{selectedTeam.maxMembers}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                <div className="text-[10px] text-slate-500 mb-1">وظایف تکمیل شده</div>
                <div className="text-lg font-mono font-semibold text-emerald-600">
                  {selectedTeam.tasksCompletedByTeam || 0}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-[11px] text-slate-500">
                  <CalendarIcon className="w-3.5 h-3.5" /> تاریخ ایجاد
                </span>
                <span className="text-[11px] font-mono text-slate-700">
                  {new Date(selectedTeam.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ChartBarIcon className="w-3.5 h-3.5" /> آخرین بروزرسانی
                </span>
                <span className="text-[11px] font-mono text-slate-700">
                  {new Date(selectedTeam.updatedAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
            </div>
          </div>

          {/* Related Need Card */}
          {selectedTeam.need && (
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <BriefcaseIcon className="w-3.5 h-3.5" />
                  نیاز مرتبط
                </h4>
              </div>
              <div className="p-4">
                <h5 className="text-[13px] font-semibold text-slate-800 mb-2 line-clamp-1">
                  {selectedTeam.need.title || "بدون عنوان"}
                </h5>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3 line-clamp-3">
                  {selectedTeam.need.description || "توضیحاتی موجود نیست."}
                </p>
                <Link to={`/dashboard/needs/${selectedTeam.need._id || selectedTeam.need}`}>
                  <button className="w-full py-1.5 text-[11px] font-medium text-[#007acc] bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors">
                    مشاهده جزئیات نیاز
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, teamId: null, teamName: "" })}
        onConfirm={confirmDelete}
        title="حذف تیم"
        message={`آیا از حذف تیم "${deleteModal.teamName}" اطمینان دارید؟ تمامی داده‌های مرتبط از بین خواهند رفت.`}
      />
    </div>
  );
};

export default TeamDetails;
