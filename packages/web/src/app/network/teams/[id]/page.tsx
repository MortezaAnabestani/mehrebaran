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

  // دریافت اطلاعات تیم
  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await teamService.getTeamById(teamId);
      setTeam(response.data);

      // دریافت آمار
      const statsResponse = await teamService.getTeamStats(teamId);
      setStats(statsResponse.data);

      // دریافت تسک‌ها (اگر تیم needId داشته باشد)
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

  // گروه‌بندی تسک‌ها بر اساس status
  const getTasksByStatus = (status: string): ITask[] => {
    return tasks.filter((task) => task.status === status);
  };

  // بررسی اینکه آیا کاربر عضو تیم است
  const isMember = (): boolean => {
    if (!team || !user) return false;
    return team.members?.some((m) => {
      const userId = typeof m.user === "object" ? m.user._id : m.user;
      return userId?.toString() === user._id?.toString();
    }) || false;
  };

  // بررسی اینکه آیا کاربر leader است
  const isLeader = (): boolean => {
    if (!team || !user) return false;
    return team.members?.some((m) => {
      const userId = typeof m.user === "object" ? m.user._id : m.user;
      return userId?.toString() === user._id?.toString() && (m.role === "leader" || m.role === "co_leader");
    }) || false;
  };

  // ترجمه focusArea
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

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mblue mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !team) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || "تیم یافت نشد"}</p>
            <SmartButton variant="mblue" size="sm" onClick={() => router.push("/network/teams")}>
              بازگشت به تیم‌ها
            </SmartButton>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const needId = typeof team.need === "string" ? team.need : team.need?._id;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mgray/5 pb-10">
        {/* Header */}
        <div className="bg-white border-b border-mgray/20 py-4">
          <div className="w-9/10 md:w-8/10 mx-auto">
            <div className="mb-4 text-sm">
              <Link href="/network" className="text-mblue hover:underline">
                شبکه نیازسنجی
              </Link>
              <span className="mx-2 text-gray-500">←</span>
              <Link href="/network/teams" className="text-mblue hover:underline">
                تیم‌ها
              </Link>
              <span className="mx-2 text-gray-500">←</span>
              <span className="text-gray-700">{team.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-9/10 md:w-8/10 mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Team Info Card */}
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                <h2 className="font-bold text-xl mb-4">{team.name}</h2>
                {team.description && (
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">{team.description}</p>
                )}

                {/* Focus Area */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">حوزه فعالیت:</p>
                  <span className="text-sm bg-mblue/10 text-mblue px-3 py-1 rounded-md inline-block">
                    {getFocusAreaLabel(team.focusArea)}
                  </span>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">وضعیت:</p>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-md inline-block font-bold">
                    {team.status === "active" ? "فعال" : team.status}
                  </span>
                </div>

                {/* Tags */}
                {team.tags && team.tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">برچسب‌ها:</p>
                    <div className="flex flex-wrap gap-2">
                      {team.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-mgray text-gray-700 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {!isMember() && team.status === "active" && !team.isPrivate && (
                  <SmartButton variant="morange" size="md" className="w-full">
                    پیوستن به تیم
                  </SmartButton>
                )}
                {isLeader() && (
                  <SmartButton variant="mblue" size="md" className="w-full">
                    مدیریت تیم
                  </SmartButton>
                )}
              </div>

              {/* Stats Card */}
              {stats && (
                <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                  <h3 className="font-bold text-lg mb-4">آمار تیم</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">اعضای فعال:</span>
                      <span className="font-bold text-mblue">{stats.activeMembers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">تسک‌های تخصیص:</span>
                      <span className="font-bold">{stats.tasksAssigned}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">تسک‌های انجام شده:</span>
                      <span className="font-bold text-green-600">{stats.tasksCompleted}</span>
                    </div>
                    <div className="pt-3 border-t border-mgray/20">
                      <p className="text-xs text-gray-600 mb-2">پیشرفت کلی:</p>
                      <div className="w-full bg-mgray/30 rounded-full h-3 overflow-hidden mb-1">
                        <div
                          className="bg-mblue h-full rounded-full"
                          style={{ width: `${stats.teamProgress || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center font-bold text-mblue">{stats.teamProgress || 0}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Members Card */}
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                <h3 className="font-bold text-lg mb-4">اعضا ({team.members?.length || 0})</h3>
                <div className="space-y-3">
                  {team.members?.slice(0, 10).map((member, index) => {
                    const userName =
                      typeof member.user === "object" ? member.user.name : "کاربر";
                    const roleLabel =
                      member.role === "leader"
                        ? "رهبر"
                        : member.role === "co_leader"
                        ? "هم‌رهبر"
                        : "عضو";

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 ${!member.isActive ? "opacity-50" : ""}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-mblue text-white flex items-center justify-center font-bold">
                          {userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{userName}</p>
                          <p className="text-xs text-gray-600">{roleLabel}</p>
                        </div>
                        {member.tasksCompleted > 0 && (
                          <span className="text-xs text-gray-500">✓ {member.tasksCompleted}</span>
                        )}
                      </div>
                    );
                  })}
                  {team.members && team.members.length > 10 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{team.members.length - 10} عضو دیگر
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main Column - Task Board */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-xl">تسک‌های تیم</h2>
                  {isMember() && needId && (
                    <SmartButton variant="morange" size="sm">
                      + افزودن تسک
                    </SmartButton>
                  )}
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Pending Column */}
                  <div className="bg-gray-50 rounded-md p-4">
                    <h3 className="font-bold text-sm mb-4 text-gray-700">
                      در انتظار ({getTasksByStatus("pending").length})
                    </h3>
                    <div className="space-y-3">
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
                        <p className="text-xs text-gray-500 text-center py-4">تسکی وجود ندارد</p>
                      )}
                    </div>
                  </div>

                  {/* In Progress Column */}
                  <div className="bg-blue-50 rounded-md p-4">
                    <h3 className="font-bold text-sm mb-4 text-blue-700">
                      در حال انجام ({getTasksByStatus("in_progress").length})
                    </h3>
                    <div className="space-y-3">
                      {getTasksByStatus("in_progress").map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          needId={needId || ""}
                          onUpdate={fetchTeam}
                          isDraggable
                        />
                      ))}
                      {getTasksByStatus("in_progress").length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-4">تسکی وجود ندارد</p>
                      )}
                    </div>
                  </div>

                  {/* Review Column */}
                  <div className="bg-purple-50 rounded-md p-4">
                    <h3 className="font-bold text-sm mb-4 text-purple-700">
                      در حال بررسی ({getTasksByStatus("review").length})
                    </h3>
                    <div className="space-y-3">
                      {getTasksByStatus("review").map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          needId={needId || ""}
                          onUpdate={fetchTeam}
                          isDraggable
                        />
                      ))}
                      {getTasksByStatus("review").length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-4">تسکی وجود ندارد</p>
                      )}
                    </div>
                  </div>

                  {/* Completed Column */}
                  <div className="bg-green-50 rounded-md p-4">
                    <h3 className="font-bold text-sm mb-4 text-green-700">
                      تکمیل شده ({getTasksByStatus("completed").length})
                    </h3>
                    <div className="space-y-3">
                      {getTasksByStatus("completed").map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          needId={needId || ""}
                          onUpdate={fetchTeam}
                        />
                      ))}
                      {getTasksByStatus("completed").length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-4">تسکی وجود ندارد</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Blocked Tasks */}
                {getTasksByStatus("blocked").length > 0 && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <h3 className="font-bold text-sm mb-3 text-red-700">
                      تسک‌های مسدود شده ({getTasksByStatus("blocked").length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getTasksByStatus("blocked").map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          needId={needId || ""}
                          onUpdate={fetchTeam}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeamDetailPage;
