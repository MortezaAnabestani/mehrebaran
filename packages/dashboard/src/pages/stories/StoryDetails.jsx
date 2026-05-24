import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchStoryById, fetchViewers, deleteStory } from "../../features/storiesSlice";
import {
  ArrowRightIcon,
  TrashIcon,
  EyeIcon,
  HeartIcon,
  ClockIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const StoryDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storyId } = useParams();

  const { selectedStory, storyViewers, loading } = useSelector((state) => state.stories);
  const [deleteModal, setDeleteModal] = useState(false);

  // بارگذاری داده‌ها
  useEffect(() => {
    if (storyId) {
      const loadData = async () => {
        try {
          await Promise.all([
            dispatch(fetchStoryById(storyId)).unwrap(),
            dispatch(fetchViewers(storyId)).unwrap(),
          ]);
        } catch (error) {
          console.error("خطا در بارگذاری استوری:", error);
        }
      };
      loadData();
    }
  }, [dispatch, storyId]);

  // هندلر حذف
  const handleDelete = async () => {
    try {
      await dispatch(deleteStory(storyId)).unwrap();
      navigate("/dashboard/stories");
    } catch (error) {
      console.error("خطا در حذف استوری:", error);
    }
  };

  // هلپرها
  const getTypeLabel = (type) => {
    const map = { image: "تصویر", video: "ویدیو", text: "متن" };
    return map[type] || type;
  };

  const getPrivacyLabel = (privacy) => {
    const map = {
      public: "عمومی",
      followers: "دنبال‌کنندگان",
      close_friends: "دوستان نزدیک",
      custom: "سفارشی",
    };
    return map[privacy] || privacy;
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "public":
        return <GlobeAltIcon className="w-3.5 h-3.5" />;
      case "close_friends":
        return <LockClosedIcon className="w-3.5 h-3.5" />;
      default:
        return <UserGroupIcon className="w-3.5 h-3.5" />;
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    if (diff <= 0) return "منقضی شده";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours} ساعت` : `${minutes} دقیقه`;
  };

  // کامپوننت لودینگ مهندسی
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-[#007acc] rounded-full animate-spin"></div>
        <span className="text-[11px] font-mono text-slate-400">LOADING DATA...</span>
      </div>
    );
  }

  // حالت عدم یافتن
  if (!selectedStory) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-700 text-[13px] font-medium">
            استوری مورد نظر یافت نشد یا حذف شده است.
          </span>
        </div>
      </div>
    );
  }

  const isExpired = new Date(selectedStory.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Section */}
        <header className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/stories"
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-slate-500"
            >
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <div className="h-4 w-px bg-slate-200"></div>
            <div>
              <h1 className="text-[14px] font-bold text-slate-800">جزئیات استوری</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  ID: {storyId.slice(-8)}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                    isExpired
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}
                >
                  {isExpired ? "EXPIRED" : "ACTIVE"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setDeleteModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-[11px] font-medium transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            <span>حذف استوری</span>
          </button>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column: Media Preview (4 Cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <div className="p-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <DevicePhoneMobileIcon className="w-3.5 h-3.5" />
                  پیش‌نمایش مدیا
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {getTypeLabel(selectedStory.type)}
                </span>
              </div>

              <div className="relative aspect-[9/16] bg-slate-100 flex items-center justify-center overflow-hidden group">
                {selectedStory.type === "image" && selectedStory.media?.url ? (
                  <img src={selectedStory.media.url} alt="story" className="w-full h-full object-contain" />
                ) : selectedStory.type === "video" && selectedStory.media?.url ? (
                  <video src={selectedStory.media.url} controls className="w-full h-full object-contain" />
                ) : selectedStory.type === "text" ? (
                  <div
                    className="w-full h-full flex items-center justify-center p-6 text-center"
                    style={{
                      backgroundColor: selectedStory.backgroundColor || "#3B82F6",
                      color: selectedStory.textColor || "#FFFFFF",
                    }}
                  >
                    <span className="text-lg font-bold break-words w-full">{selectedStory.text}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 text-[11px]">بدون مدیا</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Data & Stats (8 Cols) */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* Stats Overview Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  label: "بازدید کل",
                  value: selectedStory.viewsCount || 0,
                  icon: EyeIcon,
                  color: "text-blue-600",
                },
                {
                  label: "ری‌اکشن‌ها",
                  value: selectedStory.reactionsCount || 0,
                  icon: HeartIcon,
                  color: "text-rose-500",
                },
                {
                  label: "زمان باقی‌مانده",
                  value: getTimeRemaining(selectedStory.expiresAt),
                  icon: ClockIcon,
                  color: "text-amber-600",
                  isText: true,
                },
                {
                  label: "وضعیت حریم خصوصی",
                  value: getPrivacyLabel(selectedStory.privacy),
                  icon: () => getPrivacyIcon(selectedStory.privacy),
                  color: "text-slate-600",
                  isText: true,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-md p-3 flex flex-col justify-between h-20"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500 font-medium">{stat.label}</span>
                    <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  </div>
                  <span
                    className={`text-[16px] font-bold ${
                      stat.isText ? "text-[12px]" : "font-mono"
                    } text-slate-800`}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Details & Settings Panel */}
            <div className="bg-white border border-slate-200 rounded-md">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <ChartBarIcon className="w-3.5 h-3.5 text-slate-400" />
                <h3 className="text-[11px] font-bold text-slate-700">اطلاعات تکمیلی</h3>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Metadata */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-medium uppercase">کپشن (Caption)</span>
                    <p className="text-[12px] text-slate-700 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100 min-h-[40px]">
                      {selectedStory.caption || "بدون کپشن"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">تاریخ ایجاد</span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[12px] font-mono">
                          {new Date(selectedStory.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">ساعت ایجاد</span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[12px] font-mono">
                          {new Date(selectedStory.createdAt).toLocaleTimeString("fa-IR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Configuration */}
                <div className="space-y-3">
                  <span className="text-[10px] text-slate-400 font-medium uppercase block mb-2">
                    تنظیمات تعامل
                  </span>

                  <div className="flex items-center justify-between p-2 rounded border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-slate-500" />
                      <span className="text-[11px] text-slate-700">اجازه پاسخ‌دهی</span>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedStory.allowReplies ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <ShareIcon className="w-4 h-4 text-slate-500" />
                      <span className="text-[11px] text-slate-700">اجازه اشتراک‌گذاری</span>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedStory.allowSharing ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Viewers & Reactions Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Viewers List */}
              <div className="bg-white border border-slate-200 rounded-md flex flex-col h-80">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                    <h3 className="text-[11px] font-bold text-slate-700">لیست بازدیدکنندگان</h3>
                  </div>
                  <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 rounded-sm font-mono">
                    {storyViewers?.length || 0}
                  </span>
                </div>

                <div className="overflow-y-auto flex-1 p-0">
                  {storyViewers && storyViewers.length > 0 ? (
                    <table className="w-full text-right">
                      <thead className="bg-slate-50 sticky top-0 text-[10px] text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                          <th className="px-3 py-2 font-normal">کاربر</th>
                          <th className="px-3 py-2 font-normal">زمان</th>
                          <th className="px-3 py-2 font-normal text-left">مدت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {storyViewers.map((view) => (
                          <tr key={view._id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={view.user?.profilePicture || "/assets/images/default-avatar.png"}
                                  alt=""
                                  className="w-5 h-5 rounded-full bg-slate-200 object-cover border border-slate-100"
                                />
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-medium text-slate-700">
                                    {view.user?.name || "کاربر"}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-mono">
                                    @{view.user?.username}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-[10px] text-slate-500 font-mono">
                              {new Date(view.viewedAt).toLocaleTimeString("fa-IR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-3 py-2 text-[10px] text-slate-500 font-mono text-left">
                              {view.viewDuration ? `${view.viewDuration}s` : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                      <UsersIcon className="w-8 h-8 opacity-20" />
                      <span className="text-[11px]">هنوز بازدیدی ثبت نشده است</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reactions Grid */}
              <div className="bg-white border border-slate-200 rounded-md flex flex-col h-80">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <HeartIcon className="w-3.5 h-3.5 text-slate-400" />
                    <h3 className="text-[11px] font-bold text-slate-700">واکنش‌ها</h3>
                  </div>
                  <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 rounded-sm font-mono">
                    {selectedStory.reactions?.length || 0}
                  </span>
                </div>

                <div className="p-3 overflow-y-auto flex-1">
                  {selectedStory.reactions && selectedStory.reactions.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedStory.reactions.map((reaction) => (
                        <div
                          key={reaction._id}
                          className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded hover:border-slate-200 transition-colors"
                        >
                          <span className="text-lg leading-none">{reaction.emoji}</span>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-[11px] font-medium text-slate-700 truncate">
                              {reaction.user?.name || "کاربر"}
                            </span>
                            <span className="text-[9px] text-slate-400 truncate">
                              {new Date(reaction.createdAt || Date.now()).toLocaleTimeString("fa-IR")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                      <HeartIcon className="w-8 h-8 opacity-20" />
                      <span className="text-[11px]">بدون واکنش</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmDelete
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="حذف استوری"
        message="آیا از حذف این استوری اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
      />
    </div>
  );
};

export default StoryDetails;
