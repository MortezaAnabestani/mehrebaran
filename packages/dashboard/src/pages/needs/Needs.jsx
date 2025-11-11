import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchNeeds, deleteNeed } from "../../features/needsSlice";
import { Card, Button, Input, Select, Option, Typography, Chip, IconButton } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon, PlusIcon } from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const Needs = () => {
  const dispatch = useDispatch();
  const { needs, loading, totalPages, total } = useSelector((state) => state.needs);

  const [filters, setFilters] = useState({
    status: "",
    urgencyLevel: "",
    searchQuery: "",
    limit: 10,
    page: 1,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    needId: null,
    needTitle: "",
  });

  // بارگذاری نیازها
  useEffect(() => {
    const loadNeeds = async () => {
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
        };

        if (filters.status) params.status = filters.status;
        if (filters.urgencyLevel) params.urgencyLevel = filters.urgencyLevel;
        if (filters.searchQuery) params.title = filters.searchQuery;

        await dispatch(fetchNeeds(params)).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری نیازها:", error);
      }
    };

    loadNeeds();
  }, [dispatch, filters.page, filters.limit, filters.status, filters.urgencyLevel, filters.searchQuery]);

  // تغییر وضعیت فیلتر
  const handleStatusChange = (value) => {
    setFilters({
      ...filters,
      status: value,
      page: 1,
    });
  };

  // تغییر سطح فوریت
  const handleUrgencyChange = (value) => {
    setFilters({
      ...filters,
      urgencyLevel: value,
      page: 1,
    });
  };

  // تغییر متن جستجو
  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      searchQuery: e.target.value,
      page: 1,
    });
  };

  // تغییر تعداد آیتم‌ها
  const handleLimitChange = (value) => {
    setFilters({
      ...filters,
      limit: parseInt(value),
      page: 1,
    });
  };

  // رفتن به صفحه بعد
  const goToNextPage = () => {
    if (filters.page < totalPages) {
      setFilters({
        ...filters,
        page: filters.page + 1,
      });
    }
  };

  // رفتن به صفحه قبل
  const goToPrevPage = () => {
    if (filters.page > 1) {
      setFilters({
        ...filters,
        page: filters.page - 1,
      });
    }
  };

  // حذف نیاز
  const handleDelete = (id, title) => {
    setDeleteModal({
      isOpen: true,
      needId: id,
      needTitle: title,
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteNeed(deleteModal.needId)).unwrap();
      setDeleteModal({ isOpen: false, needId: null, needTitle: "" });
    } catch (error) {
      console.error("خطا در حذف نیاز:", error);
    }
  };

  // تبدیل status به فارسی
  const getStatusLabel = (status) => {
    const statusMap = {
      draft: "پیش‌نویس",
      pending: "در انتظار",
      under_review: "در حال بررسی",
      approved: "تایید شده",
      in_progress: "در حال انجام",
      completed: "تکمیل شده",
      rejected: "رد شده",
      archived: "آرشیو شده",
      cancelled: "لغو شده",
    };
    return statusMap[status] || status;
  };

  // تبدیل urgencyLevel به فارسی
  const getUrgencyLabel = (level) => {
    const levelMap = {
      low: "کم",
      medium: "متوسط",
      high: "زیاد",
      critical: "بحرانی",
    };
    return levelMap[level] || level;
  };

  // رنگ chip برای urgencyLevel
  const getUrgencyColor = (level) => {
    const colorMap = {
      low: "green",
      medium: "yellow",
      high: "orange",
      critical: "red",
    };
    return colorMap[level] || "gray";
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" color="blue-gray">
            مدیریت نیازها
          </Typography>
          <Link to="/dashboard/needs/create">
            <Button color="blue" className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              ایجاد نیاز جدید
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Select label="وضعیت" value={filters.status} onChange={handleStatusChange}>
              <Option value="">همه</Option>
              <Option value="draft">پیش‌نویس</Option>
              <Option value="pending">در انتظار</Option>
              <Option value="under_review">در حال بررسی</Option>
              <Option value="approved">تایید شده</Option>
              <Option value="in_progress">در حال انجام</Option>
              <Option value="completed">تکمیل شده</Option>
              <Option value="rejected">رد شده</Option>
            </Select>
          </div>

          <div>
            <Select label="سطح فوریت" value={filters.urgencyLevel} onChange={handleUrgencyChange}>
              <Option value="">همه</Option>
              <Option value="low">کم</Option>
              <Option value="medium">متوسط</Option>
              <Option value="high">زیاد</Option>
              <Option value="critical">بحرانی</Option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="جستجو"
              icon={<MagnifyingGlassIcon className="w-5 h-5" />}
              value={filters.searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-right">
                <thead>
                  <tr className="border-b border-blue-gray-100 bg-blue-gray-50">
                    <th className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        عنوان
                      </Typography>
                    </th>
                    <th className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        وضعیت
                      </Typography>
                    </th>
                    <th className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        سطح فوریت
                      </Typography>
                    </th>
                    <th className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        حمایت‌کنندگان
                      </Typography>
                    </th>
                    <th className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        پیشرفت
                      </Typography>
                    </th>
                    <th className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        عملیات
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {needs && Array.isArray(needs) && needs.length > 0 ? (
                    needs.map((need) => (
                      <tr key={need._id} className="border-b border-blue-gray-50 hover:bg-blue-gray-50">
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {need.title}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Chip
                            value={getStatusLabel(need.status)}
                            color={need.status === "completed" ? "green" : need.status === "rejected" ? "red" : "blue"}
                            size="sm"
                          />
                        </td>
                        <td className="p-4">
                          <Chip
                            value={getUrgencyLabel(need.urgencyLevel)}
                            color={getUrgencyColor(need.urgencyLevel)}
                            size="sm"
                          />
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {need.supporters?.length || 0}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {need.overallProgress || 0}%
                          </Typography>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link to={`/dashboard/needs/${need._id}`}>
                              <IconButton color="blue" size="sm">
                                <EyeIcon className="w-4 h-4" />
                              </IconButton>
                            </Link>
                            <Link to={`/dashboard/needs/edit/${need._id}`}>
                              <IconButton color="green" size="sm">
                                <PencilIcon className="w-4 h-4" />
                              </IconButton>
                            </Link>
                            <IconButton
                              color="red"
                              size="sm"
                              onClick={() => handleDelete(need._id, need.title)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center">
                        <Typography variant="small" color="blue-gray">
                          نیازی یافت نشد
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2">
                <Typography variant="small" color="blue-gray">
                  تعداد در صفحه:
                </Typography>
                <Select value={filters.limit.toString()} onChange={handleLimitChange} className="w-20">
                  <Option value="5">5</Option>
                  <Option value="10">10</Option>
                  <Option value="15">15</Option>
                  <Option value="20">20</Option>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <Typography variant="small" color="blue-gray">
                  {filters.page}/{totalPages || 1} از {total || 0}
                </Typography>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={filters.page <= 1}
                    variant="outlined"
                  >
                    قبلی
                  </Button>
                  <Button
                    size="sm"
                    onClick={goToNextPage}
                    disabled={filters.page >= (totalPages || 1)}
                    variant="outlined"
                  >
                    بعدی
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, needId: null, needTitle: "" })}
        onConfirm={confirmDelete}
        title="حذف نیاز"
        message={`آیا از حذف نیاز "${deleteModal.needTitle}" اطمینان دارید؟`}
      />
    </div>
  );
};

export default Needs;
