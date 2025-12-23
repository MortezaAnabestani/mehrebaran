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
  CardHeader,
  CardBody,
  Button,
  Input,
  Select,
  Option,
  Typography,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Tooltip,
  Avatar,
  Chip,
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
  ChartBarIcon,
  ArrowPathIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolid,
  XCircleIcon as XCircleSolid,
  InformationCircleIcon as InfoSolid,
} from "@heroicons/react/24/solid";
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

  useEffect(() => {
    loadData();
  }, [dispatch, filters.page, filters.status, filters.searchQuery]);

  // --- Handlers ---
  const handleStatusChange = (value) => {
    setFilters({ ...filters, status: value, page: 1 });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, searchQuery: e.target.value, page: 1 });
  };

  const handleRefresh = () => {
    loadData();
  };

  const goToNextPage = () => {
    if (filters.page < pagination.totalPages) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  const goToPrevPage = () => {
    if (filters.page > 1) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
  };

  const handleDelete = (id, title) => {
    setDeleteModal({ isOpen: true, requestId: id, requestTitle: title });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteHelpRequest(deleteModal.requestId)).unwrap();
      setDeleteModal({ isOpen: false, requestId: null, requestTitle: "" });
    } catch (error) {
      console.error("خطا در حذف درخواست:", error);
    }
  };

  const handleViewDetails = (request) => {
    setDetailsModal({ isOpen: true, request: request });
  };

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

  // --- Helpers ---
  const getStatusConfig = (status) => {
    // Added 'solidBg' to explicitly define the background color class for mobile view stripes
    const configs = {
      pending: {
        label: "در انتظار بررسی",
        color: "orange",
        solidBg: "bg-orange-500",
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: <DocumentTextIcon className="w-4 h-4" />,
      },
      approved: {
        label: "تایید شده",
        color: "blue",
        solidBg: "bg-blue-500",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: <CheckCircleIcon className="w-4 h-4" />,
      },
      in_progress: {
        label: "در حال پیگیری",
        color: "cyan",
        solidBg: "bg-cyan-500",
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        border: "border-cyan-200",
        icon: <PhoneIcon className="w-4 h-4" />,
      },
      completed: {
        label: "تکمیل شده",
        color: "green",
        solidBg: "bg-green-500",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: <CheckCircleSolid className="w-4 h-4" />,
      },
      rejected: {
        label: "رد شده",
        color: "red",
        solidBg: "bg-red-500",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: <XCircleIcon className="w-4 h-4" />,
      },
    };
    return (
      configs[status] || {
        label: status,
        color: "gray",
        solidBg: "bg-gray-500",
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: null,
      }
    );
  };

  // --- Components ---
  const StatCard = ({ title, value, icon, color }) => (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div
        className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full opacity-5 bg-${color}-500 blur-2xl transition-all group-hover:opacity-10`}
      ></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <Typography variant="small" className="font-medium text-gray-500 mb-2">
            {title}
          </Typography>
          <Typography variant="h2" color="blue-gray" className="font-bold tracking-tight">
            {value}
          </Typography>
        </div>
        <div
          className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 shadow-sm ring-1 ring-${color}-100`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="animate-pulse">
          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </td>
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-16"></div>
              </div>
            </div>
          </td>
          <td className="p-4">
            <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
          </td>
          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="p-4">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans pb-24">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-1 bg-[#007acc] rounded-full"></div>
            <Typography variant="h3" color="blue-gray" className="font-extrabold tracking-tight">
              مدیریت درخواست‌های کمک
            </Typography>
          </div>
          <Typography className="text-gray-500 font-normal max-w-2xl text-lg">
            پنل جامع بررسی و مدیریت درخواست‌های ارسالی کاربران.
          </Typography>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outlined"
            className="border-gray-300 text-gray-600 flex items-center gap-2"
            onClick={handleRefresh}
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            بروزرسانی
          </Button>
          <Button className="bg-[#007acc] shadow-blue-200 shadow-lg flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4" />
            گزارش‌گیری
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard
            title="کل درخواست‌ها"
            value={stats.total || 0}
            icon={<ChartBarIcon className="w-7 h-7" />}
            color="blue"
          />
          <StatCard
            title="در انتظار بررسی"
            value={stats.pending || 0}
            icon={<DocumentTextIcon className="w-7 h-7" />}
            color="orange"
          />
          <StatCard
            title="در حال پیگیری"
            value={stats.in_progress || 0}
            icon={<PhoneIcon className="w-7 h-7" />}
            color="cyan"
          />
          <StatCard
            title="تکمیل شده"
            value={stats.completed || 0}
            icon={<CheckCircleIcon className="w-7 h-7" />}
            color="green"
          />
          <StatCard
            title="رد شده"
            value={stats.rejected || 0}
            icon={<XCircleIcon className="w-7 h-7" />}
            color="red"
          />
        </div>
      )}

      {/* Main Content Card */}
      <Card className="h-full w-full shadow-xl shadow-gray-100/50 border border-gray-200 rounded-3xl overflow-hidden bg-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none p-6 border-b border-gray-100 bg-white/50 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-96 relative">
              <Input
                placeholder="جستجو در درخواست‌ها" // Changed label to placeholder
                icon={<MagnifyingGlassIcon className="h-5 w-5 text-[#1e1e1e]" />} // Changed icon color
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="!border !border-[#cccccc] bg-[#cccccc] text-[#1e1e1e] shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-[#1e1e1e] focus:!border-[#007acc] focus:!border-t focus:ring-[#007acc]/10" // Updated border, background, text, and focus colors
                labelProps={{
                  className: "hidden", // Hide the label
                }}
                containerProps={{ className: "min-w-[100px]" }}
              />
            </div>
            <div className="flex w-full md:w-auto items-center gap-3">
              <div className="w-full md:w-64">
                <Select
                  label="فیلتر وضعیت" // Changed from placeholder to label
                  value={filters.status}
                  onChange={handleStatusChange}
                  className="!border !border-[#cccccc] bg-[#cccccc] text-[#1e1e1e] shadow-lg shadow-gray-900/5 ring-4 ring-transparent focus:!border-[#007acc] focus:!border-t focus:ring-[#007acc]/10" // Updated border, background, text, and focus colors
                  labelProps={{
                    className:
                      "!text-[#1e1e1e] before:!border-gray-300 after:!border-gray-300 peer-focus:!text-[#007acc] peer-focus:before:!border-[#007acc] peer-focus:after:!border-[#007acc]", // Ensure label is visible and styled
                  }}
                  menuProps={{ className: "p-2 rounded-xl shadow-lg border border-[#cccccc] bg-white" }} // Updated menu border color and added bg-white
                  arrow={<FunnelIcon className="h-5 w-5 text-[#007acc]" />} // Changed arrow icon color
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                >
                  <Option value="" className="text-[#1e1e1e] hover:bg-[#007acc]/10 focus:bg-[#007acc]/10">
                    همه وضعیت‌ها
                  </Option>
                  <Option
                    value="pending"
                    className="flex items-center gap-2 text-orange-600 hover:bg-[#007acc]/10 focus:bg-[#007acc]/10"
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>در انتظار بررسی
                  </Option>
                  <Option
                    value="approved"
                    className="flex items-center gap-2 text-blue-600 hover:bg-[#007acc]/10 focus:bg-[#007acc]/10"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>تایید شده
                  </Option>
                  <Option
                    value="in_progress"
                    className="flex items-center gap-2 text-cyan-600 hover:bg-[#007acc]/10 focus:bg-[#007acc]/10"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>در حال پیگیری
                  </Option>
                  <Option
                    value="completed"
                    className="flex items-center gap-2 text-green-600 hover:bg-[#007acc]/10 focus:bg-[#007acc]/10"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>تکمیل شده
                  </Option>
                  <Option
                    value="rejected"
                    className="flex items-center gap-2 text-red-600 hover:bg-[#007acc]/10 focus:bg-[#007acc]/10"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>رد شده
                  </Option>
                </Select>
              </div>
              <Tooltip content="فیلترهای بیشتر">
                <IconButton
                  variant="text"
                  color="blue-gray"
                  className="rounded-xl bg-gray-50 hover:bg-gray-100"
                >
                  <FunnelIcon className="w-5 h-5" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-4 min-h-[400px]">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-max table-auto text-right">
              <thead>
                <tr>
                  {["عنوان درخواست", "درخواست‌کننده", "وضعیت", "تاریخ ثبت", "عملیات"].map((head) => (
                    <th
                      key={head}
                      className="border-b border-gray-100 bg-gray-50/80 p-5 first:rounded-tr-none last:rounded-tl-none"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none opacity-70 text-xs uppercase tracking-wider"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : helpRequests && helpRequests.length > 0 ? (
                  helpRequests.map((request, index) => {
                    const isLast = index === helpRequests.length - 1;
                    const classes = isLast ? "p-5" : "p-5 border-b border-gray-50";
                    const statusConfig = getStatusConfig(request.status);

                    return (
                      <tr key={request._id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className={classes}>
                          <div className="flex flex-col gap-1">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold text-sm group-hover:text-[#007acc] transition-colors"
                            >
                              {request.title || "بدون عنوان"}
                            </Typography>
                            <Typography
                              variant="small"
                              className="text-gray-400 font-normal truncate max-w-[220px] text-xs"
                            >
                              {request.description
                                ? `${request.description.substring(0, 40)}...`
                                : "توضیحاتی وجود ندارد"}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar
                                src={`https://ui-avatars.com/api/?name=${request.guestName}&background=random&color=fff&bold=true`}
                                alt={request.guestName}
                                size="sm"
                                variant="rounded"
                                className="rounded-xl shadow-sm"
                              />
                              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                <div className="bg-green-500 w-2.5 h-2.5 rounded-full border border-white"></div>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <Typography variant="small" color="blue-gray" className="font-bold">
                                {request.guestName || "نام نامشخص"}
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-gray-500 font-normal flex items-center gap-1 text-xs font-mono"
                              >
                                {request.guestPhone || "شماره نامشخص"}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div
                            className={`w-max px-3 py-1.5 rounded-full border flex items-center gap-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`}></span>
                            <Typography variant="small" className="font-bold text-[11px]">
                              {statusConfig.label}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography variant="small" className="text-gray-700 font-medium text-xs">
                              {new Date(request.createdAt).toLocaleDateString("fa-IR")}
                            </Typography>
                            <Typography variant="small" className="text-gray-400 text-[10px]">
                              {new Date(request.createdAt).toLocaleTimeString("fa-IR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-1">
                            <Tooltip
                              content="مشاهده جزئیات"
                              className="bg-gray-900 text-xs py-1 px-2 rounded-md"
                            >
                              <IconButton
                                variant="text"
                                color="blue-gray"
                                className="rounded-full hover:bg-white hover:shadow-md hover:text-[#007acc] transition-all"
                                onClick={() => handleViewDetails(request)}
                              >
                                <EyeIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>

                            {request.status === "pending" && (
                              <>
                                <Tooltip
                                  content="تایید درخواست"
                                  className="bg-green-600 text-xs py-1 px-2 rounded-md"
                                >
                                  <IconButton
                                    variant="text"
                                    color="green"
                                    className="rounded-full hover:bg-green-50 hover:shadow-md transition-all"
                                    onClick={() => handleApprove(request)}
                                  >
                                    <CheckCircleIcon className="h-5 w-5" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  content="رد درخواست"
                                  className="bg-red-600 text-xs py-1 px-2 rounded-md"
                                >
                                  <IconButton
                                    variant="text"
                                    color="red"
                                    className="rounded-full hover:bg-red-50 hover:shadow-md transition-all"
                                    onClick={() => handleReject(request)}
                                  >
                                    <XCircleIcon className="h-5 w-5" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}

                            <Tooltip content="حذف" className="bg-red-600 text-xs py-1 px-2 rounded-md">
                              <IconButton
                                variant="text"
                                color="red"
                                className="rounded-full hover:bg-red-50 hover:shadow-md transition-all"
                                onClick={() => handleDelete(request._id, request.title)}
                              >
                                <TrashIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="bg-gray-50 p-6 rounded-full mb-4 shadow-inner">
                          <DocumentTextIcon className="h-12 w-12 text-gray-300" />
                        </div>
                        <Typography variant="h6" className="font-medium text-gray-500 mb-1">
                          هیچ درخواستی یافت نشد
                        </Typography>
                        <Typography className="text-sm font-normal text-gray-400">
                          با تغییر فیلترها دوباره تلاش کنید
                        </Typography>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Cards) */}
          <div className="md:hidden space-y-4 px-4 pb-4 pt-4">
            {!loading &&
              helpRequests &&
              helpRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                return (
                  <div
                    key={request._id}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden"
                  >
                    {/* Fixed dynamic class issue by using solidBg from config */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${statusConfig.solidBg}`}></div>
                    <div className="flex justify-between items-start mb-4 pl-2">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${request.guestName}&background=random&color=fff`}
                          size="sm"
                          variant="rounded"
                          className="rounded-lg"
                        />
                        <div>
                          <Typography className="font-bold text-sm text-gray-800">
                            {request.guestName || "نام نامشخص"}
                          </Typography>
                          <Typography className="text-[10px] text-gray-400">
                            {new Date(request.createdAt).toLocaleDateString("fa-IR")}
                          </Typography>
                        </div>
                      </div>
                      <Chip
                        value={statusConfig.label}
                        size="sm"
                        variant="ghost"
                        color={statusConfig.color}
                        className="rounded-full px-2 py-1 text-[10px]"
                      />
                    </div>
                    <Typography className="font-bold text-gray-900 mb-2 text-sm">
                      {request.title || "بدون عنوان"}
                    </Typography>
                    <Typography className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                      {request.description || "توضیحاتی وجود ندارد"}
                    </Typography>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outlined"
                        className="flex-1 border-gray-200 text-gray-600 text-xs py-2"
                        onClick={() => handleViewDetails(request)}
                      >
                        جزئیات
                      </Button>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <IconButton
                            size="sm"
                            color="green"
                            variant="gradient"
                            className="rounded-lg shadow-green-100"
                            onClick={() => handleApprove(request)}
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </IconButton>
                          <IconButton
                            size="sm"
                            color="red"
                            variant="gradient"
                            className="rounded-lg shadow-red-100"
                            onClick={() => handleReject(request)}
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            {(!helpRequests || helpRequests.length === 0) && !loading && (
              <div className="text-center py-10 text-gray-500">
                <Typography>هیچ درخواستی یافت نشد</Typography>
              </div>
            )}
          </div>
        </CardBody>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 p-4 bg-gray-50">
          <Typography variant="small" color="blue-gray" className="font-medium text-xs">
            نمایش صفحه <span className="font-bold text-[#007acc]">{filters.page}</span> از{" "}
            {pagination.totalPages || 1}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="text"
              size="sm"
              onClick={goToPrevPage}
              disabled={filters.page <= 1}
              className="text-gray-600 hover:bg-white hover:shadow-sm"
            >
              قبلی
            </Button>
            <Button
              variant="gradient"
              color="blue"
              size="sm"
              onClick={goToNextPage}
              disabled={filters.page >= (pagination.totalPages || 1)}
              className="shadow-blue-200"
            >
              بعدی
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, requestId: null, requestTitle: "" })}
        onConfirm={confirmDelete}
        title="حذف درخواست"
        message={`آیا از حذف درخواست "${deleteModal.requestTitle}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
      />

      {/* Approve Modal */}
      <Dialog
        open={approveModal.isOpen}
        handler={() => setApproveModal({ ...approveModal, isOpen: false })}
        size="sm"
        className="rounded-3xl"
        animate={{
          mount: { scale: 1, y: 0, opacity: 1 },
          unmount: { scale: 0.95, y: -20, opacity: 0 },
        }}
      >
        <DialogHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
          <div className="flex items-center gap-3 text-green-600">
            <div className="p-3 bg-green-50 rounded-2xl ring-4 ring-green-50/50">
              <CheckCircleSolid className="w-6 h-6" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray">
                تایید درخواست
              </Typography>
              <Typography variant="small" className="text-gray-400 font-normal">
                تغییر وضعیت به تایید شده
              </Typography>
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="py-6 px-6">
          <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
            <Typography className="font-normal text-gray-600 text-sm">
              شما در حال تایید درخواست{" "}
              <span className="font-bold text-gray-900">"{approveModal.requestTitle}"</span> هستید.
            </Typography>
          </div>
          <Textarea
            label="یادداشت ادمین (اختیاری)"
            value={approveModal.adminNotes}
            onChange={(e) => setApproveModal({ ...approveModal, adminNotes: e.target.value })}
            color="green"
            className="!border-gray-200 focus:!border-green-500 rounded-xl"
          />
        </DialogBody>
        <DialogFooter className="pt-0 px-6 pb-6">
          <Button
            variant="text"
            color="gray"
            onClick={() => setApproveModal({ ...approveModal, isOpen: false })}
            className="mr-2 rounded-xl hover:bg-gray-100"
          >
            انصراف
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={confirmApprove}
            className="rounded-xl shadow-green-200 shadow-lg"
          >
            تایید نهایی
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reject Modal */}
      <Dialog
        open={rejectModal.isOpen}
        handler={() => setRejectModal({ ...rejectModal, isOpen: false })}
        size="sm"
        className="rounded-3xl"
        animate={{
          mount: { scale: 1, y: 0, opacity: 1 },
          unmount: { scale: 0.95, y: -20, opacity: 0 },
        }}
      >
        <DialogHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
          <div className="flex items-center gap-3 text-red-600">
            <div className="p-3 bg-red-50 rounded-2xl ring-4 ring-red-50/50">
              <XCircleSolid className="w-6 h-6" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray">
                رد درخواست
              </Typography>
              <Typography variant="small" className="text-gray-400 font-normal">
                تغییر وضعیت به رد شده
              </Typography>
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="py-6 px-6">
          <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100">
            <Typography className="font-normal text-red-800 text-sm">
              آیا از رد درخواست <span className="font-bold">"{rejectModal.requestTitle}"</span> اطمینان دارید؟
            </Typography>
          </div>
          <Textarea
            label="دلیل رد (اختیاری)"
            value={rejectModal.adminNotes}
            onChange={(e) => setRejectModal({ ...rejectModal, adminNotes: e.target.value })}
            color="red"
            className="!border-gray-200 focus:!border-red-500 rounded-xl"
          />
        </DialogBody>
        <DialogFooter className="pt-0 px-6 pb-6">
          <Button
            variant="text"
            color="gray"
            onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
            className="mr-2 rounded-xl hover:bg-gray-100"
          >
            انصراف
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={confirmReject}
            className="rounded-xl shadow-red-200 shadow-lg"
          >
            رد درخواست
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Details Modal */}
      <Dialog
        open={detailsModal.isOpen}
        handler={() => setDetailsModal({ isOpen: false, request: null })}
        size="lg"
        className="rounded-3xl overflow-hidden"
        animate={{
          mount: { scale: 1, y: 0, opacity: 1 },
          unmount: { scale: 0.95, y: -20, opacity: 0 },
        }}
      >
        <DialogHeader className="bg-white border-b border-gray-100 p-6 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#007acc] to-purple-500"></div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-[#007acc]">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  جزئیات درخواست
                </Typography>
                <Typography variant="small" className="text-gray-400 font-normal font-mono text-xs mt-0.5">
                  ID: {detailsModal.request?._id}
                </Typography>
              </div>
            </div>
            <IconButton
              variant="text"
              color="gray"
              onClick={() => setDetailsModal({ isOpen: false, request: null })}
              className="rounded-full hover:bg-gray-100"
            >
              <XCircleIcon className="w-7 h-7 text-gray-400" />
            </IconButton>
          </div>
        </DialogHeader>

        <DialogBody className="p-0 max-h-[75vh] overflow-y-auto bg-gray-50/30">
          {detailsModal.request && (
            <div className="p-6 md:p-8 space-y-8">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-1">
                  <Typography variant="h4" color="blue-gray" className="mb-3 font-bold leading-tight">
                    {detailsModal.request.title}
                  </Typography>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      {new Date(detailsModal.request.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                      <InfoSolid className="w-4 h-4 text-gray-400" />
                      {new Date(detailsModal.request.createdAt).toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                {(() => {
                  const config = getStatusConfig(detailsModal.request.status);
                  return (
                    <div
                      className={`px-5 py-2.5 rounded-2xl border flex flex-col items-center justify-center min-w-[140px] ${config.bg} ${config.border}`}
                    >
                      <div className={`p-2 rounded-full bg-white mb-1 ${config.text}`}>{config.icon}</div>
                      <Typography className={`font-bold text-sm ${config.text}`}>{config.label}</Typography>
                    </div>
                  );
                })()}
              </div>

              {/* User Info Grid */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#007acc] rounded-full"></span>
                  اطلاعات درخواست‌کننده
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <Typography
                      variant="small"
                      className="text-gray-400 mb-2 flex items-center gap-1 text-xs uppercase tracking-wider"
                    >
                      نام و نام خانوادگی
                    </Typography>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={`https://ui-avatars.com/api/?name=${detailsModal.request.guestName}&background=random`}
                        size="sm"
                      />
                      <Typography color="blue-gray" className="font-bold">
                        {detailsModal.request.guestName}
                      </Typography>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <Typography
                      variant="small"
                      className="text-gray-400 mb-2 flex items-center gap-1 text-xs uppercase tracking-wider"
                    >
                      شماره تماس
                    </Typography>
                    <Typography color="blue-gray" className="font-bold dir-ltr text-right font-mono text-lg">
                      {detailsModal.request.guestPhone}
                    </Typography>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <Typography
                      variant="small"
                      className="text-gray-400 mb-2 flex items-center gap-1 text-xs uppercase tracking-wider"
                    >
                      ایمیل
                    </Typography>
                    <Typography color="blue-gray" className="font-bold truncate">
                      {detailsModal.request.guestEmail || "---"}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-[#007acc]" />
                  شرح کامل درخواست
                </Typography>
                <div className="text-gray-700 leading-8 text-justify text-sm md:text-base">
                  {detailsModal.request.description}
                </div>
              </div>

              {/* Admin Notes */}
              {detailsModal.request.adminNotes && (
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-100 rounded-full opacity-50"></div>
                  <Typography
                    variant="h6"
                    className="text-amber-900 mb-3 flex items-center gap-2 relative z-10"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    یادداشت ادمین
                  </Typography>
                  <Typography className="text-amber-800 text-sm leading-relaxed relative z-10 bg-white/50 p-4 rounded-xl border border-amber-100/50">
                    {detailsModal.request.adminNotes}
                  </Typography>
                </div>
              )}

              {/* Media Gallery */}
              {detailsModal.request.media && detailsModal.request.media.length > 0 && (
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                    مستندات و فایل‌های پیوست
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {detailsModal.request.media.map((media, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer shadow-sm hover:shadow-lg transition-all"
                      >
                        <img
                          src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${
                            media.desktop || media
                          }`}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                          <Button
                            size="sm"
                            variant="text"
                            className="text-white flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4"
                          >
                            <EyeIcon className="w-4 h-4" /> مشاهده
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogBody>
        <DialogFooter className="border-t border-gray-100 p-4 bg-white">
          <Button
            variant="gradient"
            color="blue"
            onClick={() => setDetailsModal({ isOpen: false, request: null })}
            className="w-full md:w-auto rounded-xl shadow-blue-100"
          >
            بستن پنجره
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default HelpRequests;
