import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchProjectById, deleteProject, incrementProjectView } from "../../features/projectsSlice";
import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  EyeIcon,
  CheckCircleIcon,
  TagIcon,
  ClockIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProject, loading } = useSelector((state) => state.projects);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      const loadProject = async () => {
        try {
          await dispatch(fetchProjectById(id)).unwrap();
          await dispatch(incrementProjectView(id)).unwrap();
        } catch (error) {
          console.error("خطا در بارگذاری پروژه:", error);
        }
      };
      loadProject();
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      navigate("/dashboard/projects");
    } catch (error) {
      alert(error || "خطایی در حذف پروژه رخ داده است");
    }
  };

  // Utility Functions
  const getFinancialProgress = () => {
    if (!selectedProject?.targetAmount) return 0;
    return Math.min((selectedProject.amountRaised / selectedProject.targetAmount) * 100, 100);
  };

  const getVolunteerProgress = () => {
    if (!selectedProject?.targetVolunteer) return 0;
    return Math.min((selectedProject.collectedVolunteer / selectedProject.targetVolunteer) * 100, 100);
  };

  const formatAmount = (amount) => new Intl.NumberFormat("fa-IR").format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const getDaysRemaining = () => {
    if (!selectedProject) return 0;
    const now = new Date();
    const end = new Date(selectedProject.deadline);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-slate-100 text-slate-600 border-slate-200",
      active: "bg-emerald-50 text-emerald-600 border-emerald-200",
      completed: "bg-blue-50 text-blue-600 border-blue-200",
    };
    const labels = { draft: "پیش‌نویس", active: "فعال", completed: "تکمیل شده" };

    return (
      <span
        className={`px-2 py-0.5 text-[10px] font-medium border rounded-md ${styles[status] || styles.draft}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-mono">LOADING_DATA...</span>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600 text-sm flex items-center gap-2">
        <span className="font-mono">ERROR_404:</span> پروژه یافت نشد.
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 font-sans text-slate-800">
      {/* --- Top Toolbar --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/projects"
            className="p-1.5 hover:bg-slate-100 rounded-md border border-transparent hover:border-slate-200 transition-colors"
          >
            <ArrowRightIcon className="w-4 h-4 text-slate-500" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">{selectedProject.title}</h1>
              {getStatusBadge(selectedProject.status)}
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {selectedProject._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/projects/edit/${selectedProject._id}`}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
          >
            <PencilIcon className="w-3.5 h-3.5" />
            ویرایش
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-200 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            حذف
          </button>
        </div>
      </div>

      {/* --- Main Grid Layout --- */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {/* LEFT COLUMN (Content) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Featured Image */}
          <div className="relative w-full h-64 md:h-80 bg-slate-100 rounded-md border border-slate-200 overflow-hidden group">
            <img
              src={
                `${import.meta.env.VITE_SERVER_PUBLIC_UPLOADS}${selectedProject.featuredImage.desktop}` ||
                "/placeholder-project.jpg"
              }
              alt={selectedProject.featuredImage?.alt}
              className="w-full h-full object-cover"
            />
            {selectedProject.featuredImage?.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm px-4 py-2 border-t border-white/10">
                <p className="text-[11px] text-slate-300 font-mono">
                  {selectedProject.featuredImage.caption}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="border border-slate-200 rounded-md bg-white">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">توضیحات پروژه</h3>
            </div>
            <div className="p-4">
              <p className="text-sm leading-7 text-slate-600 whitespace-pre-line text-justify">
                {selectedProject.description}
              </p>
            </div>
          </div>

          {/* Gallery */}
          {selectedProject.gallery && selectedProject.gallery.length > 0 && (
            <div className="border border-slate-200 rounded-md bg-white">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">گالری تصاویر</h3>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedProject.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded border border-slate-200 overflow-hidden group"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1">
                        <p className="text-[10px] text-white truncate text-center">{image.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Data Sidebar) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Financial Card */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">وضعیت مالی</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                {Math.round(getFinancialProgress())}%
              </span>
            </div>
            <div className="p-4 space-y-4">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${getFinancialProgress()}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                  <span className="block text-[10px] text-slate-400 mb-1">جمع‌آوری شده</span>
                  <span className="block text-sm font-mono font-medium text-emerald-600">
                    {formatAmount(selectedProject.amountRaised)}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                  <span className="block text-[10px] text-slate-400 mb-1">هدف</span>
                  <span className="block text-sm font-mono font-medium text-slate-700">
                    {formatAmount(selectedProject.targetAmount)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">باقی‌مانده:</span>
                <span className="text-xs font-mono text-red-500">
                  {formatAmount(Math.max(0, selectedProject.targetAmount - selectedProject.amountRaised))}{" "}
                  <span className="text-[10px] text-slate-400">تومان</span>
                </span>
              </div>
            </div>
          </div>

          {/* Volunteer Card */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">وضعیت داوطلبان</span>
              </div>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                {Math.round(getVolunteerProgress())}%
              </span>
            </div>
            <div className="p-4 space-y-4">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${getVolunteerProgress()}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  جذب شده:{" "}
                  <span className="font-mono text-slate-900">{selectedProject.collectedVolunteer}</span>
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-500">
                  هدف: <span className="font-mono text-slate-900">{selectedProject.targetVolunteer}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Meta Info Table */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">اطلاعات سیستمی</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between items-center p-3 hover:bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500">
                  <TagIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">دسته‌بندی</span>
                </div>
                <span className="text-[11px] font-medium text-slate-700">
                  {selectedProject.category?.name || "---"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 hover:bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">روزهای باقی‌مانده</span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-700">
                  {getDaysRemaining()} روز
                </span>
              </div>

              <div className="flex justify-between items-center p-3 hover:bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">تاریخ پایان</span>
                </div>
                <span className="text-[11px] font-mono text-slate-700">
                  {formatDate(selectedProject.deadline)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 hover:bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500">
                  <EyeIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">بازدید</span>
                </div>
                <span className="text-[11px] font-mono text-slate-700">{selectedProject.views || 0}</span>
              </div>

              <div className="flex justify-between items-center p-3 hover:bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500">
                  <HashtagIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Slug</span>
                </div>
                <span
                  className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]"
                  title={selectedProject.slug}
                >
                  {selectedProject.slug}
                </span>
              </div>
            </div>
          </div>

          {/* Completion Status */}
          {selectedProject.status === "completed" && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-700">پروژه تکمیل شده</p>
                <p className="text-[10px] text-blue-600 mt-1">تمامی اهداف این پروژه محقق شده است.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDelete
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="حذف پروژه"
        message={`آیا از حذف پروژه "${selectedProject.title}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
      />
    </div>
  );
};

export default ProjectDetails;
