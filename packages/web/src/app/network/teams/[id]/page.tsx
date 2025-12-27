"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import SmartButton from "@/components/ui/SmartButton";
import TaskCard from "@/components/network/TaskCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { teamService } from "@/services/team.service";
import { taskService, ITask } from "@/services/task.service";
import { useAuth } from "@/contexts/AuthContext";
import { ITeam } from "common-types";

// --- Utility Components for Skeuomorphic Design ---

const SkeuoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section
    className={`bg-white rounded-2xl border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] ${className}`}
  >
    {children}
  </section>
);

const KanbanColumn = ({
  title,
  count,
  colorClass,
  children,
}: {
  title: string;
  count: number;
  colorClass: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col h-full">
    <div className={`flex items-center justify-between mb-3 px-1 ${colorClass}`}>
      <h3 className="font-bold text-sm">{title}</h3>
      <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm border border-white/20">
        {count}
      </span>
    </div>
    {/* Recessed Tray Effect */}
    <div className="flex-1 bg-slate-100/80 rounded-xl p-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)] border border-slate-200/50 space-y-3 min-h-[200px]">
      {children}
    </div>
  </div>
);

const TeamDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const teamId = params.id as string;

  // State
  const [team, setTeam] = useState<ITeam | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data
  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await teamService.getTeamById(teamId);
      setTeam(response.data);

      const statsResponse = await teamService.getTeamStats(teamId);
      setStats(statsResponse.data);

      if (response.data.need && typeof response.data.need === "string") {
        const tasksResponse = await taskService.getTasks(response.data.need);
        setTasks(tasksResponse.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch team:", err);
      setError(err.message || "خطا در دریافت اطلاعات تیم");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTeam();
    }
  }, [teamId]);

  // Helpers
  const getTasksByStatus = (status: string): ITask[] => tasks.filter((task) => task.status === status);

  const isMember = (): boolean => {
    if (!team || !user) return false;
    return (
      team.members?.some((m) => {
        const userId = typeof m.user === "object" ? m.user._id : m.user;
        return userId?.toString() === user._id?.toString();
      }) || false
    );
  };

  const isLeader = (): boolean => {
    if (!team || !user) return false;
    return (
      team.members?.some((m) => {
        const userId = typeof m.user === "object" ? m.user._id : m.user;
        return userId?.toString() === user._id?.toString() && (m.role === "leader" || m.role === "co_leader");
      }) || false
    );
  };

  const getFocusAreaLabel = (focusArea: string): string => {
    const labels: Record<string, string> = {
      fundraising: "جمع‌آوری کمک",
      logistics: "لجستیک",
      communication: "ارتباطات",
      technical: "فنی",
      volunteer: "داوطلب",
      coordination: "هماهنگی",
      documentation: "مستندسازی",
      general: "عمومی",
    };
    return labels[focusArea] || focusArea;
  };

  // Loading State
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen bg-[#f4f7f9]">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#007acc] mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">باران که می‌بارد، تو در راهی...لاعات تیم...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error State
  if (error || !team) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen bg-[#f4f7f9]">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">خطا در دریافت اطلاعات</h2>
            <p className="text-slate-500 mb-6">{error || "تیم مورد نظر یافت نشد"}</p>
            <SmartButton variant="mblue" size="md" onClick={() => router.push("/network/teams")}>
              بازگشت به لیست تیم‌ها
            </SmartButton>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const needId = typeof team.need === "string" ? team.need : team.need?._id?.toString();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f4f7f9] pb-12 text-slate-800 font-sans">
        {/* Header / Breadcrumbs */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div className="w-11/12 max-w-7xl mx-auto py-4">
            <nav aria-label="Breadcrumb" className="text-sm font-medium">
              <ol className="flex items-center gap-2 text-slate-500">
                <li>
                  <Link href="/network" className="hover:text-[#007acc] transition-colors">
                    شبکه نیازسنجی
                  </Link>
                </li>
                <li className="text-slate-300">/</li>
                <li>
                  <Link href="/network/teams" className="hover:text-[#007acc] transition-colors">
                    تیم‌ها
                  </Link>
                </li>
                <li className="text-slate-300">/</li>
                <li className="text-[#007acc] font-bold" aria-current="page">
                  {team.name}
                </li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="w-11/12 max-w-7xl mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Sidebar (Info, Stats, Members) */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Team Info Card */}
              <SkeuoCard className="p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#007acc] to-[#005fa3]"></div>

                <h1 className="font-extrabold text-2xl mb-3 text-slate-800">{team.name}</h1>

                {team.description && (
                  <p className="text-sm text-slate-600 mb-5 leading-relaxed border-b border-slate-100 pb-4">
                    {team.description}
                  </p>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">حوزه فعالیت</span>
                    <span className="text-xs bg-blue-50 text-[#007acc] px-3 py-1.5 rounded-lg font-bold shadow-sm">
                      {getFocusAreaLabel(team.focusArea)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">وضعیت</span>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm flex items-center gap-1 ${
                        team.status === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {team.status === "active" && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      )}
                      {team.status === "active" ? "فعال" : team.status}
                    </span>
                  </div>
                </div>

                {team.tags && team.tags.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 mb-2">برچسب‌ها</p>
                    <div className="flex flex-wrap gap-2">
                      {team.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  {!isMember() && team.status === "active" && !team.isPrivate && (
                    <SmartButton
                      variant="morange"
                      size="md"
                      className="w-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      پیوستن به تیم
                    </SmartButton>
                  )}
                  {isLeader() && (
                    <SmartButton
                      variant="mblue"
                      size="md"
                      className="w-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      مدیریت تیم
                    </SmartButton>
                  )}
                </div>
              </SkeuoCard>

              {/* Stats Card */}
              {stats && (
                <SkeuoCard className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#007acc] rounded-full"></span>
                    آمار عملکرد
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs text-slate-500">اعضای فعال</span>
                      <span className="font-bold text-[#007acc] text-lg">{stats.activeMembers}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                        <span className="block text-xs text-slate-500 mb-1">تخصیص یافته</span>
                        <span className="font-bold text-slate-700">{stats.tasksAssigned}</span>
                      </div>
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                        <span className="block text-xs text-emerald-600 mb-1">انجام شده</span>
                        <span className="font-bold text-emerald-700">{stats.tasksCompleted}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500">پیشرفت کلی</span>
                        <span className="font-bold text-[#007acc]">{stats.teamProgress || 0}%</span>
                      </div>
                      {/* Skeuomorphic Progress Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#007acc] to-[#40a9ff] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                          style={{ width: `${stats.teamProgress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </SkeuoCard>
              )}

              {/* Members Card */}
              <SkeuoCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-800">اعضا</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                    {team.members?.length || 0}
                  </span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {team.members?.slice(0, 10).map((member, index) => {
                    const userName =
                      typeof member.user === "object" && member.user && "name" in member.user
                        ? member.user.name
                        : "کاربر";
                    const isLeaderRole = member.role === "leader" || member.role === "co_leader";

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-slate-50 ${
                          !member.isActive ? "opacity-50 grayscale" : ""
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                            isLeaderRole ? "bg-gradient-to-br from-[#007acc] to-[#005fa3]" : "bg-slate-400"
                          }`}
                        >
                          {userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate">{userName}</p>
                          <p className="text-[10px] text-slate-500">
                            {member.role === "leader"
                              ? "رهبر تیم"
                              : member.role === "co_leader"
                              ? "هم‌رهبر"
                              : "عضو تیم"}
                          </p>
                        </div>
                        {(member.tasksCompleted ?? 0) > 0 && (
                          <div className="flex flex-col items-center bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                            <span className="text-[10px] text-emerald-600 font-bold">
                              {member.tasksCompleted}
                            </span>
                            <span className="text-[8px] text-emerald-400">تسک</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {team.members && team.members.length > 10 && (
                  <button className="w-full mt-4 text-xs text-[#007acc] hover:underline text-center">
                    مشاهده همه اعضا
                  </button>
                )}
              </SkeuoCard>
            </aside>

            {/* RIGHT COLUMN: Kanban Board */}
            <div className="lg:col-span-9">
              <SkeuoCard className="p-6 h-full min-h-[600px] bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="font-bold text-2xl text-slate-800">تسک‌های تیم</h2>
                    <p className="text-sm text-slate-500 mt-1">مدیریت و پیگیری وضعیت وظایف</p>
                  </div>
                  {isMember() && needId && (
                    <SmartButton variant="morange" size="sm" className="shadow-lg shadow-orange-200">
                      + افزودن تسک جدید
                    </SmartButton>
                  )}
                </div>

                {/* Kanban Board Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  {/* Pending */}
                  <KanbanColumn
                    title="در انتظار"
                    count={getTasksByStatus("pending").length}
                    colorClass="text-slate-600"
                  >
                    {getTasksByStatus("pending").map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        needId={needId || ""}
                        onUpdate={fetchTeam}
                        isDraggable
                      />
                    ))}
                    {getTasksByStatus("pending").length === 0 && (
                      <div className="h-full flex items-center justify-center opacity-30">
                        <p className="text-xs text-slate-500">خالی</p>
                      </div>
                    )}
                  </KanbanColumn>

                  {/* In Progress */}
                  <KanbanColumn
                    title="در حال انجام"
                    count={getTasksByStatus("in_progress").length}
                    colorClass="text-[#007acc]"
                  >
                    {getTasksByStatus("in_progress").map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        needId={needId || ""}
                        onUpdate={fetchTeam}
                        isDraggable
                      />
                    ))}
                  </KanbanColumn>

                  {/* Review */}
                  <KanbanColumn
                    title="بررسی"
                    count={getTasksByStatus("review").length}
                    colorClass="text-purple-600"
                  >
                    {getTasksByStatus("review").map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        needId={needId || ""}
                        onUpdate={fetchTeam}
                        isDraggable
                      />
                    ))}
                  </KanbanColumn>

                  {/* Completed */}
                  <KanbanColumn
                    title="تکمیل شده"
                    count={getTasksByStatus("completed").length}
                    colorClass="text-emerald-600"
                  >
                    {getTasksByStatus("completed").map((task) => (
                      <TaskCard key={task._id} task={task} needId={needId || ""} onUpdate={fetchTeam} />
                    ))}
                  </KanbanColumn>
                </div>

                {/* Blocked Tasks Section */}
                {getTasksByStatus("blocked").length > 0 && (
                  <div className="mt-8 p-4 bg-red-50/50 border border-red-100 rounded-xl shadow-sm">
                    <h3 className="font-bold text-sm mb-3 text-red-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      تسک‌های مسدود شده ({getTasksByStatus("blocked").length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getTasksByStatus("blocked").map((task) => (
                        <TaskCard key={task._id} task={task} needId={needId || ""} onUpdate={fetchTeam} />
                      ))}
                    </div>
                  </div>
                )}
              </SkeuoCard>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default TeamDetailPage;
