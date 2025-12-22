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
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid, XCircleIcon as XCircleSolid } from "@heroicons/react/24/solid";
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

  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    request: null,
  });

  const [approveModal, setApproveModal] = useState({
    isOpen: false,
    requestId: null,
    requestTitle: "",
    adminNotes: "",
  });

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    requestId: null,
    requestTitle: "",
    adminNotes: "",
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

  // نمایش جزئیات درخواست
  const handleViewDetails = (request) => {
    setDetailsModal({
      isOpen: true,
      request: request,
    });
  };

  // تایید درخواست
  const handleApprove = (request) => {
    setApproveModal({
      isOpen: true,
      requestId: request._id,
      requestTitle: request.title,
      adminNotes: "",
    });
  };

  const confirmApprove = async () => {
    try {
      await dispatch(
        updateHelpRequestStatus({
          id: approveModal.requestId,
          status: "approved",
          adminNotes: approveModal.adminNotes,
        })
      ).unwrap();
      setApproveModal({
        isOpen: false,
        requestId: null,
        requestTitle: "",
        adminNotes: "",
      });
    } catch (error) {
      console.error("خطا در تایید درخواست:", error);
    }
  };

  // رد درخواست
  const handleReject = (request) => {
    setRejectModal({
      isOpen: true,
      requestId: request._id,
      requestTitle: request.title,
      adminNotes: "",
    });
  };

  const confirmReject = async () => {
    try {
      await dispatch(
        updateHelpRequestStatus({
          id: rejectModal.requestId,
          status: "rejected",
          adminNotes: rejectModal.adminNotes,
        })
      ).unwrap();
      setRejectModal({
        isOpen: false,
        requestId: null,
        requestTitle: "",
        adminNotes: "",
      });
    } catch (error) {
      console.error("خطا در رد درخواست:", error);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8 text-center md:text-right">
        <Typography variant="h2" className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
          مدیریت درخواست‌های کمک
        </Typography>
        <Typography className="text-gray-600 text-sm md:text-base">
          پیگیری و مدیریت درخواست‌های کمک دریافتی از کاربران
        </Typography>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
          {[
            { label: "کل", value: stats.total || 0, color: "from-blue-500 to-blue-600", icon: "📊", textColor: "text-blue-600" },
            { label: "در انتظار", value: stats.pending || 0, color: "from-amber-500 to-orange-500", icon: "⏳", textColor: "text-amber-600" },
            { label: "در حال پیگیری", value: stats.in_progress || 0, color: "from-cyan-500 to-blue-500", icon: "🔄", textColor: "text-cyan-600" },
            { label: "تکمیل", value: stats.completed || 0, color: "from-green-500 to-emerald-600", icon: "✅", textColor: "text-green-600" },
            { label: "رد شده", value: stats.rejected || 0, color: "from-red-500 to-pink-600", icon: "❌", textColor: "text-red-600" },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
              <div className="relative p-4 md:p-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className="text-3xl md:text-4xl">{stat.icon}</div>
                  <div className="text-center md:text-right">
                    <Typography variant="small" className={`${stat.textColor} font-bold text-xs md:text-sm`}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" className="font-black text-gray-800 mt-1">
                      {stat.value}
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Main Content Card */}
      <Card className="shadow-2xl border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-4 md:p-8">
          {/* Filters Section */}
          <div className="mb-6 pb-6 border-b-2 border-gray-100">
            <Typography variant="h5" className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
              فیلترها و جستجو
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="فیلتر بر اساس وضعیت"
                value={filters.status}
                onChange={handleStatusChange}
                className="border-2 border-gray-200"
              >
                <Option value="">همه درخواست‌ها</Option>
                <Option value="pending">در انتظار بررسی</Option>
                <Option value="approved">تایید شده</Option>
                <Option value="in_progress">در حال پیگیری</Option>
                <Option value="completed">تکمیل شده</Option>
                <Option value="rejected">رد شده</Option>
              </Select>

              <Input
                label="جستجو در عنوان یا نام"
                icon={<MagnifyingGlassIcon className="w-5 h-5" />}
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="border-2 border-gray-200"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                </div>
              </div>
              <Typography className="mt-4 text-gray-600 font-medium">در حال بارگذاری...</Typography>
            </div>
          ) : (
            <>
              {/* Cards Grid for Mobile, Table for Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <th className="px-4 py-4 text-right font-bold">عنوان</th>
                      <th className="px-4 py-4 text-right font-bold">نام</th>
                      <th className="px-4 py-4 text-right font-bold">تماس</th>
                      <th className="px-4 py-4 text-right font-bold">وضعیت</th>
                      <th className="px-4 py-4 text-right font-bold">تاریخ</th>
                      <th className="px-4 py-4 text-center font-bold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {helpRequests && Array.isArray(helpRequests) && helpRequests.length > 0 ? (
                      helpRequests.map((request, idx) => (
                        <tr
                          key={request._id}
                          className={`border-b hover:bg-blue-50 transition-colors ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-4">
                            <Typography className="font-bold text-gray-800 text-sm">
                              {request.title}
                            </Typography>
                          </td>
                          <td className="px-4 py-4">
                            <Typography className="text-gray-700 text-sm">
                              {request.guestName}
                            </Typography>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <Typography className="text-xs text-gray-600 flex items-center gap-1">
                                <PhoneIcon className="w-3 h-3" />
                                {request.guestPhone}
                              </Typography>
                              <Typography className="text-xs text-gray-500 flex items-center gap-1">
                                <EnvelopeIcon className="w-3 h-3" />
                                {request.guestEmail}
                              </Typography>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Chip
                              value={getStatusLabel(request.status)}
                              color={getStatusColor(request.status)}
                              size="sm"
                              className="font-bold"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <Typography className="text-xs text-gray-600">
                              {new Date(request.createdAt).toLocaleDateString("fa-IR")}
                            </Typography>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1 justify-center">
                              <IconButton
                                size="sm"
                                color="blue"
                                variant="gradient"
                                onClick={() => handleViewDetails(request)}
                                className="shadow-md"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </IconButton>
                              {request.status === "pending" && (
                                <>
                                  <IconButton
                                    size="sm"
                                    color="green"
                                    variant="gradient"
                                    onClick={() => handleApprove(request)}
                                    className="shadow-md"
                                  >
                                    <CheckCircleIcon className="w-4 h-4" />
                                  </IconButton>
                                  <IconButton
                                    size="sm"
                                    color="red"
                                    variant="gradient"
                                    onClick={() => handleReject(request)}
                                    className="shadow-md"
                                  >
                                    <XCircleIcon className="w-4 h-4" />
                                  </IconButton>
                                </>
                              )}
                              <IconButton
                                size="sm"
                                color="red"
                                variant="outlined"
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
                        <td colSpan="6" className="p-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="text-6xl">🔍</div>
                            <Typography variant="h6" className="text-gray-700 font-bold">
                              درخواستی یافت نشد
                            </Typography>
                            <Typography className="text-gray-500">
                              فیلترها را تغییر دهید یا منتظر درخواست‌های جدید باشید
                            </Typography>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden space-y-4">
                {helpRequests && Array.isArray(helpRequests) && helpRequests.length > 0 ? (
                  helpRequests.map((request) => (
                    <Card key={request._id} className="p-4 shadow-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <Typography className="font-bold text-gray-800 flex-1">
                          {request.title}
                        </Typography>
                        <Chip
                          value={getStatusLabel(request.status)}
                          color={getStatusColor(request.status)}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-2 mb-3">
                        <Typography className="text-sm text-gray-600">
                          <span className="font-semibold">نام:</span> {request.guestName}
                        </Typography>
                        <Typography className="text-xs text-gray-500 flex items-center gap-1">
                          <PhoneIcon className="w-3 h-3" />
                          {request.guestPhone}
                        </Typography>
                        <Typography className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString("fa-IR")}
                        </Typography>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" color="blue" onClick={() => handleViewDetails(request)} className="flex-1">
                          مشاهده
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <IconButton size="sm" color="green" onClick={() => handleApprove(request)}>
                              <CheckCircleIcon className="w-5 h-5" />
                            </IconButton>
                            <IconButton size="sm" color="red" onClick={() => handleReject(request)}>
                              <XCircleIcon className="w-5 h-5" />
                            </IconButton>
                          </>
                        )}
                        <IconButton size="sm" color="red" variant="outlined" onClick={() => handleDelete(request._id, request.title)}>
                          <TrashIcon className="w-5 h-5" />
                        </IconButton>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <Typography variant="h6" className="text-gray-700 mb-2">درخواستی یافت نشد</Typography>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t-2 border-gray-100 gap-4">
                <Typography className="text-sm text-gray-600">
                  صفحه <span className="font-bold text-blue-600">{filters.page}</span> از{" "}
                  <span className="font-bold">{pagination.totalPages || 1}</span>
                  <span className="mr-4">
                    کل: <span className="font-bold text-purple-600">{pagination.total || 0}</span>
                  </span>
                </Typography>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={filters.page <= 1}
                    variant="outlined"
                    color="blue"
                  >
                    قبلی
                  </Button>
                  <Button
                    size="sm"
                    onClick={goToNextPage}
                    disabled={filters.page >= (pagination.totalPages || 1)}
                    variant="gradient"
                    color="blue"
                  >
                    بعدی
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, requestId: null, requestTitle: "" })}
        onConfirm={confirmDelete}
        title="حذف درخواست کمک"
        message={`آیا از حذف درخواست "${deleteModal.requestTitle}" اطمینان دارید؟`}
      />

      {/* Approve Modal */}
      <Dialog
        open={approveModal.isOpen}
        handler={() => setApproveModal({ ...approveModal, isOpen: false })}
        size="md"
        className="rounded-2xl"
      >
        <DialogHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-2xl">
          <CheckCircleSolid className="w-6 h-6 ml-2" />
          تایید درخواست
        </DialogHeader>
        <DialogBody divider className="space-y-4">
          <Typography className="text-gray-700">
            آیا از تایید درخواست <span className="font-bold text-green-600">"{approveModal.requestTitle}"</span> اطمینان دارید؟
          </Typography>
          <div>
            <Textarea
              label="یادداشت ادمین (اختیاری)"
              value={approveModal.adminNotes}
              onChange={(e) => setApproveModal({ ...approveModal, adminNotes: e.target.value })}
              rows={4}
              className="border-2"
            />
          </div>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button
            variant="outlined"
            color="gray"
            onClick={() => setApproveModal({ ...approveModal, isOpen: false })}
          >
            انصراف
          </Button>
          <Button variant="gradient" color="green" onClick={confirmApprove}>
            تایید نهایی
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reject Modal */}
      <Dialog
        open={rejectModal.isOpen}
        handler={() => setRejectModal({ ...rejectModal, isOpen: false })}
        size="md"
        className="rounded-2xl"
      >
        <DialogHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-t-2xl">
          <XCircleSolid className="w-6 h-6 ml-2" />
          رد درخواست
        </DialogHeader>
        <DialogBody divider className="space-y-4">
          <Typography className="text-gray-700">
            آیا از رد درخواست <span className="font-bold text-red-600">"{rejectModal.requestTitle}"</span> اطمینان دارید؟
          </Typography>
          <div>
            <Textarea
              label="دلیل رد (اختیاری)"
              value={rejectModal.adminNotes}
              onChange={(e) => setRejectModal({ ...rejectModal, adminNotes: e.target.value })}
              rows={4}
              className="border-2"
              placeholder="توضیح دهید چرا این درخواست رد می‌شود..."
            />
          </div>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button
            variant="outlined"
            color="gray"
            onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
          >
            انصراف
          </Button>
          <Button variant="gradient" color="red" onClick={confirmReject}>
            رد نهایی
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Details Modal */}
      <Dialog
        open={detailsModal.isOpen}
        handler={() => setDetailsModal({ isOpen: false, request: null })}
        size="xl"
        className="rounded-2xl"
      >
        <DialogHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
          <DocumentTextIcon className="w-6 h-6 ml-2" />
          جزئیات درخواست کمک
        </DialogHeader>
        <DialogBody divider className="max-h-[70vh] overflow-y-auto">
          {detailsModal.request && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                  {detailsModal.request.title}
                </Typography>
                <div className="flex items-center gap-2">
                  <Chip
                    value={getStatusLabel(detailsModal.request.status)}
                    color={getStatusColor(detailsModal.request.status)}
                    className="font-bold"
                  />
                  <Typography className="text-xs text-gray-500 flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(detailsModal.request.createdAt).toLocaleString("fa-IR")}
                  </Typography>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <Typography className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  شرح درخواست
                </Typography>
                <Typography className="text-gray-700 leading-relaxed text-justify">
                  {detailsModal.request.description}
                </Typography>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-blue-100 p-4 rounded-xl">
                  <Typography className="text-xs font-bold text-gray-500 mb-2">نام درخواست‌کننده</Typography>
                  <Typography className="font-bold text-gray-800">{detailsModal.request.guestName}</Typography>
                </div>

                <div className="bg-white border-2 border-blue-100 p-4 rounded-xl">
                  <Typography className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                    <PhoneIcon className="w-4 h-4" />
                    شماره تماس
                  </Typography>
                  <Typography className="font-bold text-gray-800 direction-ltr text-right">
                    {detailsModal.request.guestPhone}
                  </Typography>
                </div>

                <div className="bg-white border-2 border-blue-100 p-4 rounded-xl md:col-span-2">
                  <Typography className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                    <EnvelopeIcon className="w-4 h-4" />
                    ایمیل
                  </Typography>
                  <Typography className="font-bold text-gray-800 direction-ltr text-right">
                    {detailsModal.request.guestEmail}
                  </Typography>
                </div>
              </div>

              {/* Admin Notes */}
              {detailsModal.request.adminNotes && (
                <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl">
                  <Typography className="font-bold text-yellow-800 mb-2">یادداشت ادمین:</Typography>
                  <Typography className="text-gray-700">{detailsModal.request.adminNotes}</Typography>
                </div>
              )}

              {/* Media */}
              {detailsModal.request.media && detailsModal.request.media.length > 0 && (
                <div>
                  <Typography className="font-bold text-gray-700 mb-4">
                    تصاویر/ویدیوها ({detailsModal.request.media.length})
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {detailsModal.request.media.map((media, index) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                        <img
                          src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${media.desktop || media}`}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="blue"
            onClick={() => setDetailsModal({ isOpen: false, request: null })}
            className="shadow-lg"
          >
            بستن
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default HelpRequests;
