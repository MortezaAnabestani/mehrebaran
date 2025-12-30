import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProjects, deleteProject } from "../../features/projectsSlice";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    projectId: null,
    projectTitle: "",
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = (project) => {
    setDeleteModal({
      isOpen: true,
      projectId: project._id,
      projectTitle: project.title,
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProject(deleteModal.projectId)).unwrap();
      setDeleteModal({ isOpen: false, projectId: null, projectTitle: "" });
    } catch (error) {
      console.error("خطا در حذف پروژه:", error);
    }
  };

  // Helpers
  const getFinancialProgress = (project) => {
    if (!project.targetAmount || project.targetAmount === 0) return 0;
    return Math.min((project.amountRaised / project.targetAmount) * 100, 100);
  };

  const getVolunteerProgress = (project) => {
    if (!project.targetVolunteer || project.targetVolunteer === 0) return 0;
    return Math.min((project.collectedVolunteer / project.targetVolunteer) * 100, 100);
  };

  const getStatusStyles = (status) => {
    const styles = {
      draft: "bg-slate-100 text-slate-600 border-slate-200",
      active: "bg-emerald-50 text-emerald-600 border-emerald-200",
      completed: "bg-blue-50 text-blue-600 border-blue-200",
    };
    return styles[status] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: "پیش‌نویس",
      active: "فعال",
      completed: "تکمیل",
    };
    return labels[status] || status;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return "نامشخص";
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "منقضی";
    if (diff === 0) return "امروز";
    return `${diff} روز`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-[#007acc]" />
            مدیریت پروژه‌ها
          </h1>
          <p className="text-[11px] text-slate-500 mt-1">لیست تمام کمپین‌ها و وضعیت پیشرفت آن‌ها</p>
        </div>
        <Link to="/dashboard/projects/create">
          <button className="flex items-center gap-2 bg-[#007acc] hover:bg-[#006bb3] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-sm">
            <PlusIcon className="w-4 h-4" />
            ایجاد پروژه جدید
          </button>
        </Link>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-12 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="col-span-12 md:col-span-6 lg:col-span-4 h-64 bg-slate-100 rounded-md animate-pulse border border-slate-200"
            ></div>
          ))}
        </div>
      ) : (
        <>
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-12 gap-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 bg-white border border-slate-200 rounded-md overflow-hidden hover:border-[#007acc]/50 transition-colors group flex flex-col"
                >
                  {/* Card Image & Status */}
                  <div className="relative h-36 bg-slate-100 border-b border-slate-100">
                    {project.featuredImage?.desktop ? (
                      <img
                        src={`${import.meta.env.VITE_SERVER_PUBLIC_UPLOADS}${project.featuredImage.desktop}`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-project.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <span className="text-[10px] text-slate-400">بدون تصویر</span>
                      </div>
                    )}
                    <div
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusStyles(
                        project.status
                      )}`}
                    >
                      {getStatusLabel(project.status)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 flex-1 flex flex-col gap-3">
                    {/* Title */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-1" title={project.title}>
                        {project.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {project.subtitle || "بدون زیرعنوان"}
                      </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-slate-50">
                      {/* Financial */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <CurrencyDollarIcon className="w-3 h-3" /> مالی
                          </span>
                          <span className="font-mono text-slate-700">
                            {Math.round(getFinancialProgress(project))}%
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${getFinancialProgress(project)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>{formatAmount(project.amountRaised)}</span>
                          <span>/ {formatAmount(project.targetAmount)}</span>
                        </div>
                      </div>

                      {/* Volunteer */}
                      <div className="space-y-1 border-r border-slate-100 pr-2 mr-[-1px]">
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <UsersIcon className="w-3 h-3" /> داوطلب
                          </span>
                          <span className="font-mono text-slate-700">
                            {Math.round(getVolunteerProgress(project))}%
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#007acc] rounded-full"
                            style={{ width: `${getVolunteerProgress(project)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>{project.collectedVolunteer}</span>
                          <span>/ {project.targetVolunteer}</span>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <EyeIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{project.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{getDaysRemaining(project.deadline)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex gap-2">
                    <Link to={`/dashboard/projects/${project._id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 hover:border-[#007acc] hover:text-[#007acc] py-1.5 rounded transition-all">
                        <EyeIcon className="w-3.5 h-3.5" />
                        مشاهده
                      </button>
                    </Link>
                    <Link to={`/dashboard/projects/edit/${project._id}`}>
                      <button className="p-1.5 text-slate-600 bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 rounded transition-all">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(project)}
                      className="p-1.5 text-slate-600 bg-white border border-slate-200 hover:border-red-400 hover:text-red-600 rounded transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <PlusIcon className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-900">هنوز پروژه‌ای ایجاد نشده است</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">برای شروع فعالیت، اولین پروژه خود را بسازید</p>
              <Link to="/dashboard/projects/create">
                <button className="bg-[#007acc] text-white text-xs px-4 py-2 rounded-md hover:bg-[#006bb3] transition-colors">
                  ایجاد اولین پروژه
                </button>
              </Link>
            </div>
          )}
        </>
      )}

      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, projectId: null, projectTitle: "" })}
        onConfirm={confirmDelete}
        title="حذف پروژه"
        message={`آیا از حذف پروژه "${deleteModal.projectTitle}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
      />
    </div>
  );
};

export default Projects;
