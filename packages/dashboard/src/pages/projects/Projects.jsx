import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProjects, deleteProject } from "../../features/projectsSlice";
import {
  Card,
  Button,
  Typography,
  Chip,
  IconButton,
  Progress,
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
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

  // بارگذاری پروژه‌ها
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // حذف پروژه
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

  // محاسبه درصد پیشرفت مالی
  const getFinancialProgress = (project) => {
    if (!project.targetAmount || project.targetAmount === 0) return 0;
    return Math.min((project.amountRaised / project.targetAmount) * 100, 100);
  };

  // محاسبه درصد پیشرفت داوطلب
  const getVolunteerProgress = (project) => {
    if (!project.targetVolunteer || project.targetVolunteer === 0) return 0;
    return Math.min((project.collectedVolunteer / project.targetVolunteer) * 100, 100);
  };

  // رنگ وضعیت
  const getStatusColor = (status) => {
    const statusColors = {
      draft: "gray",
      active: "green",
      completed: "blue",
    };
    return statusColors[status] || "gray";
  };

  // متن وضعیت
  const getStatusLabel = (status) => {
    const statusLabels = {
      draft: "پیش‌نویس",
      active: "فعال",
      completed: "تکمیل شده",
    };
    return statusLabels[status] || status;
  };

  // فرمت مبلغ
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
  };

  // فرمت تاریخ
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fa-IR");
  };

  // محاسبه روزهای باقی‌مانده
  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "منقضی شده";
    if (diff === 0) return "امروز";
    return `${diff} روز`;
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" color="blue-gray">
            مدیریت پروژه‌ها
          </Typography>
          <Link to="/dashboard/projects/create">
            <Button color="blue" className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              ایجاد پروژه جدید
            </Button>
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project._id} className="overflow-hidden">
                    {/* Featured Image */}
                    <div className="relative h-48">
                      <img
                        src={project.featuredImage?.url || "/placeholder-project.jpg"}
                        alt={project.featuredImage?.alt || project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Chip
                          value={getStatusLabel(project.status)}
                          color={getStatusColor(project.status)}
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                      {/* Title */}
                      <div>
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                          {project.title}
                        </Typography>
                        {project.subtitle && (
                          <Typography variant="small" color="gray">
                            {project.subtitle}
                          </Typography>
                        )}
                      </div>

                      {/* Excerpt */}
                      {project.excerpt && (
                        <Typography variant="small" color="gray" className="line-clamp-2">
                          {project.excerpt}
                        </Typography>
                      )}

                      {/* Financial Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                            <Typography variant="small" color="gray">
                              پیشرفت مالی
                            </Typography>
                          </div>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {Math.round(getFinancialProgress(project))}%
                          </Typography>
                        </div>
                        <Progress
                          value={getFinancialProgress(project)}
                          color="green"
                          size="sm"
                        />
                        <div className="flex justify-between mt-1">
                          <Typography variant="small" color="gray">
                            {formatAmount(project.amountRaised)}
                          </Typography>
                          <Typography variant="small" color="gray">
                            از {formatAmount(project.targetAmount)}
                          </Typography>
                        </div>
                      </div>

                      {/* Volunteer Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <UsersIcon className="w-4 h-4 text-blue-500" />
                            <Typography variant="small" color="gray">
                              پیشرفت داوطلب
                            </Typography>
                          </div>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {Math.round(getVolunteerProgress(project))}%
                          </Typography>
                        </div>
                        <Progress
                          value={getVolunteerProgress(project)}
                          color="blue"
                          size="sm"
                        />
                        <div className="flex justify-between mt-1">
                          <Typography variant="small" color="gray">
                            {project.collectedVolunteer} نفر
                          </Typography>
                          <Typography variant="small" color="gray">
                            از {project.targetVolunteer} نفر
                          </Typography>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 py-3 border-t border-b">
                        <div className="flex items-center gap-2">
                          <EyeIcon className="w-4 h-4 text-gray-500" />
                          <Typography variant="small" color="gray">
                            {project.views || 0} بازدید
                          </Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <Typography variant="small" color="gray">
                            {getDaysRemaining(project.deadline)}
                          </Typography>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link to={`/dashboard/projects/${project._id}`} className="flex-1">
                          <Button size="sm" variant="outlined" color="blue" className="w-full">
                            مشاهده
                          </Button>
                        </Link>
                        <Link to={`/dashboard/projects/edit/${project._id}`}>
                          <IconButton size="sm" color="amber">
                            <PencilIcon className="w-4 h-4" />
                          </IconButton>
                        </Link>
                        <IconButton
                          size="sm"
                          color="red"
                          onClick={() => handleDelete(project)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </IconButton>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Typography variant="h6" color="gray">
                  هنوز پروژه‌ای ایجاد نشده است
                </Typography>
                <Typography variant="small" color="gray" className="mb-4">
                  با ایجاد پروژه، فعالیت‌های خیریه خود را مدیریت کنید
                </Typography>
                <Link to="/dashboard/projects/create">
                  <Button color="blue" className="flex items-center gap-2 mx-auto">
                    <PlusIcon className="w-5 h-5" />
                    ایجاد اولین پروژه
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, projectId: null, projectTitle: "" })}
        onConfirm={confirmDelete}
        title="حذف پروژه"
        message={`آیا از حذف پروژه "${deleteModal.projectTitle}" اطمینان دارید؟`}
      />
    </div>
  );
};

export default Projects;
