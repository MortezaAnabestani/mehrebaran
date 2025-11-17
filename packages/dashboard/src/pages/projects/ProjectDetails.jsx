import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchProjectById, deleteProject, incrementProjectView } from "../../features/projectsSlice";
import { Card, Button, Typography, Chip, Progress } from "@material-tailwind/react";
import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  EyeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProject, loading } = useSelector((state) => state.projects);
  const [deleteModal, setDeleteModal] = useState(false);

  // بارگذاری پروژه و افزایش تعداد بازدید
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

  // حذف پروژه
  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      console.log("پروژه با موفقیت حذف شد");
      navigate("/dashboard/projects");
    } catch (error) {
      console.error(error || "خطایی در حذف پروژه رخ داده است");
      alert(error || "خطایی در حذف پروژه رخ داده است");
    }
  };

  // محاسبه درصد پیشرفت مالی
  const getFinancialProgress = () => {
    if (!selectedProject || !selectedProject.targetAmount || selectedProject.targetAmount === 0) return 0;
    return Math.min((selectedProject.amountRaised / selectedProject.targetAmount) * 100, 100);
  };

  // محاسبه درصد پیشرفت داوطلب
  const getVolunteerProgress = () => {
    if (!selectedProject || !selectedProject.targetVolunteer || selectedProject.targetVolunteer === 0)
      return 0;
    return Math.min((selectedProject.collectedVolunteer / selectedProject.targetVolunteer) * 100, 100);
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
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // محاسبه روزهای باقی‌مانده
  const getDaysRemaining = () => {
    if (!selectedProject) return 0;
    const now = new Date();
    const end = new Date(selectedProject.deadline);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <Typography variant="h5" color="red">
            پروژه یافت نشد
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/projects">
                <Button variant="text" className="flex items-center gap-2">
                  <ArrowRightIcon className="w-5 h-5" />
                  بازگشت
                </Button>
              </Link>
              <div>
                <Typography variant="h4" color="blue-gray">
                  {selectedProject.title}
                </Typography>
                {selectedProject.subtitle && (
                  <Typography variant="small" color="gray" className="mt-1">
                    {selectedProject.subtitle}
                  </Typography>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Chip
                value={getStatusLabel(selectedProject.status)}
                color={getStatusColor(selectedProject.status)}
              />
              <Link to={`/dashboard/projects/edit/${selectedProject._id}`}>
                <Button color="amber" className="flex items-center gap-2">
                  <PencilIcon className="w-5 h-5" />
                  ویرایش
                </Button>
              </Link>
              <Button color="red" className="flex items-center gap-2" onClick={() => setDeleteModal(true)}>
                <TrashIcon className="w-5 h-5" />
                حذف
              </Button>
            </div>
          </div>
        </Card>

        {/* Featured Image & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Image */}
          <Card className="lg:col-span-2 overflow-hidden">
            <img
              src={
                `${import.meta.env.VITE_SERVER_PUBLIC_UPLOADS}${selectedProject.featuredImage.desktop}` ||
                "/placeholder-project.jpg"
              }
              alt={selectedProject.featuredImage?.alt || selectedProject.title}
              className="w-full h-96 object-cover"
            />
            {selectedProject.featuredImage?.caption && (
              <div className="p-4">
                <Typography variant="small" color="gray">
                  {selectedProject.featuredImage.caption}
                </Typography>
              </div>
            )}
          </Card>

          {/* Progress Stats */}
          <div className="space-y-6">
            {/* Financial Progress */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
                <Typography variant="h6" color="blue-gray">
                  پیشرفت مالی
                </Typography>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <Typography variant="small" color="gray">
                    جمع‌آوری شده
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    {Math.round(getFinancialProgress())}%
                  </Typography>
                </div>
                <Progress value={getFinancialProgress()} color="green" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">
                    مبلغ جمع‌آوری شده:
                  </Typography>
                  <Typography variant="small" color="green" className="font-bold">
                    {formatAmount(selectedProject.amountRaised)}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">
                    مبلغ هدف:
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    {formatAmount(selectedProject.targetAmount)}
                  </Typography>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <Typography variant="small" color="gray">
                    باقی‌مانده:
                  </Typography>
                  <Typography variant="small" color="red">
                    {formatAmount(selectedProject.targetAmount - selectedProject.amountRaised)}
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Volunteer Progress */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <UsersIcon className="w-6 h-6 text-blue-500" />
                <Typography variant="h6" color="blue-gray">
                  پیشرفت داوطلب
                </Typography>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <Typography variant="small" color="gray">
                    جمع‌آوری شده
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    {Math.round(getVolunteerProgress())}%
                  </Typography>
                </div>
                <Progress value={getVolunteerProgress()} color="blue" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">
                    داوطلب جمع‌آوری شده:
                  </Typography>
                  <Typography variant="small" color="blue" className="font-bold">
                    {selectedProject.collectedVolunteer} نفر
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">
                    تعداد هدف:
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    {selectedProject.targetVolunteer} نفر
                  </Typography>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <Typography variant="small" color="gray">
                    باقی‌مانده:
                  </Typography>
                  <Typography variant="small" color="red">
                    {selectedProject.targetVolunteer - selectedProject.collectedVolunteer} نفر
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Deadline & Views */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <Typography variant="small" color="gray">
                      زمان باقی‌مانده
                    </Typography>
                  </div>
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    {getDaysRemaining()} روز
                  </Typography>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EyeIcon className="w-5 h-5 text-gray-500" />
                    <Typography variant="small" color="gray">
                      تعداد بازدید
                    </Typography>
                  </div>
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    {selectedProject.views || 0}
                  </Typography>
                </div>

                <div className="pt-4 border-t">
                  <Typography variant="small" color="gray" className="mb-1">
                    تاریخ پایان:
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    {formatDate(selectedProject.deadline)}
                  </Typography>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Description & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description */}
          <Card className="lg:col-span-2 p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              توضیحات پروژه
            </Typography>
            <Typography variant="paragraph" color="gray" className="whitespace-pre-line">
              {selectedProject.description}
            </Typography>
          </Card>

          {/* Meta Info */}
          <Card className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              اطلاعات تکمیلی
            </Typography>

            <div className="space-y-4">
              <div>
                <Typography variant="small" color="gray" className="mb-1">
                  دسته‌بندی:
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {selectedProject.category?.name || "نامشخص"}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="gray" className="mb-1">
                  تاریخ ایجاد:
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {formatDate(selectedProject.createdAt)}
                </Typography>
              </div>

              {selectedProject.updatedAt && (
                <div>
                  <Typography variant="small" color="gray" className="mb-1">
                    آخرین ویرایش:
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    {formatDate(selectedProject.updatedAt)}
                  </Typography>
                </div>
              )}

              {selectedProject.slug && (
                <div>
                  <Typography variant="small" color="gray" className="mb-1">
                    Slug:
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="font-mono">
                    {selectedProject.slug}
                  </Typography>
                </div>
              )}
            </div>

            {selectedProject.status === "completed" && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-6 h-6 text-blue-500" />
                  <Typography variant="small" color="blue" className="font-bold">
                    این پروژه با موفقیت تکمیل شده است!
                  </Typography>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Gallery */}
        {selectedProject.gallery && selectedProject.gallery.length > 0 && (
          <Card className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              گالری تصاویر
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedProject.gallery.map((image, index) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt || `تصویر ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                      <Typography variant="small" color="white">
                        {image.caption}
                      </Typography>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="حذف پروژه"
        message={`آیا از حذف پروژه "${selectedProject.title}" اطمینان دارید؟`}
      />
    </div>
  );
};

export default ProjectDetails;
