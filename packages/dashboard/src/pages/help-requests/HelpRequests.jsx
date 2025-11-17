import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHelpRequests,
  fetchHelpRequestStats,
  updateHelpRequestStatus,
  deleteHelpRequest,
} from "../../features/helpRequestsSlice";
import {
  Card,
  Button,
  Input,
  Select,
  Option,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
  PencilSquareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const HelpRequests = () => {
  const dispatch = useDispatch();
  const { helpRequests, stats, loading, pagination } = useSelector((state) => state.helpRequests);

  const [filters, setFilters] = useState({
    status: "",
    searchQuery: "",
    page: 1,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    requestId: null,
    requestTitle: "",
  });

  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    requestId: null,
    currentStatus: "",
    newStatus: "",
    adminNotes: "",
  });

  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    request: null,
  });

  // بارگذاری درخواست‌ها و آمار
  useEffect(() => {
    const loadData = async () => {
      try {
        const params = {
          page: filters.page,
        };

        if (filters.status) params.status = filters.status;
        if (filters.searchQuery) params.search = filters.searchQuery;

        await dispatch(fetchHelpRequests(params)).unwrap();
        await dispatch(fetchHelpRequestStats()).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری داده‌ها:", error);
      }
    };

    loadData();
  }, [dispatch, filters.page, filters.status, filters.searchQuery]);

  // تغییر وضعیت فیلتر
  const handleStatusChange = (value) => {
    setFilters({
      ...filters,
      status: value,
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

  // رفتن به صفحه بعد
  const goToNextPage = () => {
    if (filters.page < pagination.totalPages) {
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

  // حذف درخواست
  const handleDelete = (id, title) => {
    setDeleteModal({
      isOpen: true,
      requestId: id,
      requestTitle: title,
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteHelpRequest(deleteModal.requestId)).unwrap();
      setDeleteModal({ isOpen: false, requestId: null, requestTitle: "" });
    } catch (error) {
      console.error("خطا در حذف درخواست:", error);
    }
  };

  // باز کردن مودال تغییر وضعیت
  const handleStatusUpdate = (request) => {
    setStatusModal({
      isOpen: true,
      requestId: request._id,
      currentStatus: request.status,
      newStatus: request.status,
      adminNotes: request.adminNotes || "",
    });
  };

  // ذخیره تغییرات وضعیت
  const confirmStatusUpdate = async () => {
    try {
      await dispatch(
        updateHelpRequestStatus({
          id: statusModal.requestId,
          status: statusModal.newStatus,
          adminNotes: statusModal.adminNotes,
        })
      ).unwrap();
      setStatusModal({
        isOpen: false,
        requestId: null,
        currentStatus: "",
        newStatus: "",
        adminNotes: "",
      });
    } catch (error) {
      console.error("خطا در به‌روزرسانی وضعیت:", error);
    }
  };

  // نمایش جزئیات درخواست
  const handleViewDetails = (request) => {
    setDetailsModal({
      isOpen: true,
      request: request,
    });
  };

  // تبدیل status به فارسی
  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "در انتظار بررسی",
      approved: "تایید شده",
      in_progress: "در حال پیگیری",
      completed: "تکمیل شده",
      rejected: "رد شده",
    };
    return statusMap[status] || status;
  };

  // رنگ chip برای status
  const getStatusColor = (status) => {
    const colorMap = {
      pending: "amber",
      approved: "blue",
      in_progress: "cyan",
      completed: "green",
      rejected: "red",
    };
    return colorMap[status] || "gray";
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="text-gray-600">
                  کل درخواست‌ها
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.total || 0}
                </Typography>
              </div>
              <ChartBarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="text-amber-600">
                  در انتظار
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.pending || 0}
                </Typography>
              </div>
              <ChartBarIcon className="w-8 h-8 text-amber-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="text-cyan-600">
                  در حال پیگیری
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.in_progress || 0}
                </Typography>
              </div>
              <ChartBarIcon className="w-8 h-8 text-cyan-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="text-green-600">
                  تکمیل شده
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.completed || 0}
                </Typography>
              </div>
              <ChartBarIcon className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="text-red-600">
                  رد شده
                </Typography>
                <Typography variant="h4" color="blue-gray">
                  {stats.rejected || 0}
                </Typography>
              </div>
              <ChartBarIcon className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>
      )}

      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" color="blue-gray">
            مدیریت درخواست‌های کمک
          </Typography>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Select label="وضعیت" value={filters.status} onChange={handleStatusChange}>
              <Option value="">همه</Option>
              <Option value="pending">در انتظار بررسی</Option>
              <Option value="approved">تایید شده</Option>
              <Option value="in_progress">در حال پیگیری</Option>
              <Option value="completed">تکمیل شده</Option>
              <Option value="rejected">رد شده</Option>
            </Select>
          </div>

          <div>
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
                        نام درخواست‌کننده
                      </Typography>
                    </th>
                    <th className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        ایمیل
                      </Typography>
                    </th>
                    <th className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        وضعیت
                      </Typography>
                    </th>
                    <th className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        تاریخ ثبت
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
                  {helpRequests && Array.isArray(helpRequests) && helpRequests.length > 0 ? (
                    helpRequests.map((request) => (
                      <tr key={request._id} className="border-b border-blue-gray-50 hover:bg-blue-gray-50">
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {request.title}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {request.guestName}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="text-xs">
                            {request.guestEmail}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Chip
                            value={getStatusLabel(request.status)}
                            color={getStatusColor(request.status)}
                            size="sm"
                          />
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {new Date(request.createdAt).toLocaleDateString("fa-IR")}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <IconButton
                              color="blue"
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              color="green"
                              size="sm"
                              onClick={() => handleStatusUpdate(request)}
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              color="red"
                              size="sm"
                              onClick={() => handleDelete(request._id, request.title)}
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
                          درخواستی یافت نشد
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <Typography variant="small" color="blue-gray">
                صفحه {filters.page} از {pagination.totalPages || 1} - کل: {pagination.total || 0}
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
                  disabled={filters.page >= (pagination.totalPages || 1)}
                  variant="outlined"
                >
                  بعدی
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, requestId: null, requestTitle: "" })}
        onConfirm={confirmDelete}
        title="حذف درخواست کمک"
        message={`آیا از حذف درخواست "${deleteModal.requestTitle}" اطمینان دارید؟`}
      />

      {/* Status Update Modal */}
      <Dialog open={statusModal.isOpen} handler={() => setStatusModal({ ...statusModal, isOpen: false })} size="md">
        <DialogHeader>به‌روزرسانی وضعیت درخواست</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Select
              label="وضعیت جدید"
              value={statusModal.newStatus}
              onChange={(val) => setStatusModal({ ...statusModal, newStatus: val })}
            >
              <Option value="pending">در انتظار بررسی</Option>
              <Option value="approved">تایید شده</Option>
              <Option value="in_progress">در حال پیگیری</Option>
              <Option value="completed">تکمیل شده</Option>
              <Option value="rejected">رد شده</Option>
            </Select>
          </div>
          <div>
            <Textarea
              label="یادداشت ادمین"
              value={statusModal.adminNotes}
              onChange={(e) => setStatusModal({ ...statusModal, adminNotes: e.target.value })}
              rows={4}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
            className="ml-2"
          >
            انصراف
          </Button>
          <Button variant="gradient" color="green" onClick={confirmStatusUpdate}>
            ذخیره
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Details Modal */}
      <Dialog
        open={detailsModal.isOpen}
        handler={() => setDetailsModal({ isOpen: false, request: null })}
        size="lg"
      >
        <DialogHeader>جزئیات درخواست کمک</DialogHeader>
        <DialogBody divider className="space-y-4 max-h-[70vh] overflow-y-auto">
          {detailsModal.request && (
            <>
              <div>
                <Typography variant="small" className="font-bold text-gray-700 mb-1">
                  عنوان:
                </Typography>
                <Typography>{detailsModal.request.title}</Typography>
              </div>

              <div>
                <Typography variant="small" className="font-bold text-gray-700 mb-1">
                  توضیحات:
                </Typography>
                <Typography className="text-sm">{detailsModal.request.description}</Typography>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="font-bold text-gray-700 mb-1">
                    نام درخواست‌کننده:
                  </Typography>
                  <Typography>{detailsModal.request.guestName}</Typography>
                </div>

                <div>
                  <Typography variant="small" className="font-bold text-gray-700 mb-1">
                    ایمیل:
                  </Typography>
                  <Typography className="text-sm">{detailsModal.request.guestEmail}</Typography>
                </div>
              </div>

              {detailsModal.request.guestPhone && (
                <div>
                  <Typography variant="small" className="font-bold text-gray-700 mb-1">
                    تلفن:
                  </Typography>
                  <Typography>{detailsModal.request.guestPhone}</Typography>
                </div>
              )}

              <div>
                <Typography variant="small" className="font-bold text-gray-700 mb-1">
                  وضعیت:
                </Typography>
                <Chip
                  value={getStatusLabel(detailsModal.request.status)}
                  color={getStatusColor(detailsModal.request.status)}
                  size="sm"
                  className="w-fit"
                />
              </div>

              {detailsModal.request.adminNotes && (
                <div>
                  <Typography variant="small" className="font-bold text-gray-700 mb-1">
                    یادداشت ادمین:
                  </Typography>
                  <Typography className="text-sm">{detailsModal.request.adminNotes}</Typography>
                </div>
              )}

              {detailsModal.request.media && detailsModal.request.media.length > 0 && (
                <div>
                  <Typography variant="small" className="font-bold text-gray-700 mb-2">
                    تصاویر/ویدیوها ({detailsModal.request.media.length}):
                  </Typography>
                  <div className="grid grid-cols-3 gap-2">
                    {detailsModal.request.media.map((media, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${media.desktop}`}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <Typography variant="small" className="font-bold text-gray-700 mb-1">
                    تاریخ ثبت:
                  </Typography>
                  <Typography className="text-sm">
                    {new Date(detailsModal.request.createdAt).toLocaleString("fa-IR")}
                  </Typography>
                </div>

                {detailsModal.request.reviewedAt && (
                  <div>
                    <Typography variant="small" className="font-bold text-gray-700 mb-1">
                      تاریخ بررسی:
                    </Typography>
                    <Typography className="text-sm">
                      {new Date(detailsModal.request.reviewedAt).toLocaleString("fa-IR")}
                    </Typography>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="blue"
            onClick={() => setDetailsModal({ isOpen: false, request: null })}
          >
            بستن
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default HelpRequests;
