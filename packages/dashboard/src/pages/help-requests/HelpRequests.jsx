import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHelpRequests,
  fetchHelpRequestStats,
  updateHelpRequestStatus,
  deleteHelpRequest,
} from "../../features/helpRequestsSlice";
import { Card, CardBody, Button, Typography } from "@material-tailwind/react";
import { ArrowPathIcon, ChartBarIcon } from "@heroicons/react/24/outline";

// Components
import HelpRequestStats from "../../components/help-requests/HelpRequestStats";
import HelpRequestFilters from "../../components/help-requests/HelpRequestFilters";
import HelpRequestTable from "../../components/help-requests/HelpRequestTable";
import HelpRequestMobileList from "../../components/help-requests/HelpRequestMobileList";
import HelpRequestDetailsModal from "../../components/help-requests/HelpRequestDetailsModal";
import {
  ApproveRequestModal,
  RejectRequestModal,
} from "../../components/help-requests/HelpRequestActionModals";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const HelpRequests = () => {
  const dispatch = useDispatch();
  const { helpRequests, stats, loading, pagination } = useSelector((state) => state.helpRequests);

  // --- State ---
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

  // --- Effects ---
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

  // Delete Handlers
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

  // View Handlers
  const handleViewDetails = (request) => {
    setDetailsModal({ isOpen: true, request: request });
  };

  // Approve Handlers
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

  // Reject Handlers
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
      <HelpRequestStats stats={stats} />

      {/* Main Content Card */}
      <Card className="h-full w-full shadow-xl shadow-gray-100/50 border border-gray-200 rounded-3xl overflow-hidden bg-white">
        {/* Filters */}
        <HelpRequestFilters
          filters={filters}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />

        <CardBody className="px-0 pt-0 pb-4 min-h-[400px]">
          {/* Desktop Table */}
          <HelpRequestTable
            loading={loading}
            requests={helpRequests}
            onView={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />

          {/* Mobile View (Cards) */}
          <HelpRequestMobileList
            loading={loading}
            requests={helpRequests}
            onView={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </CardBody>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 p-4 bg-gray-50">
          <Typography variant="small" color="blue-gray" className="font-medium text-xs">
            نمایش صفحه <span className="font-bold text-[#007acc]">{filters.page}</span> از{" "}
            {pagination.totalPages || 1}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={goToPrevPage}
              disabled={filters.page <= 1}
              className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              قبلی
            </Button>
            <Button
              variant="gradient"
              color="blue"
              size="sm"
              onClick={goToNextPage}
              disabled={filters.page >= (pagination.totalPages || 1)}
              className="bg-[#007acc] shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              بعدی
            </Button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, requestId: null, requestTitle: "" })}
        onConfirm={confirmDelete}
        title="حذف درخواست"
        message={`آیا از حذف درخواست "${deleteModal.requestTitle}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
      />

      <ApproveRequestModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ ...approveModal, isOpen: false, adminNotes: "" })}
        onConfirm={confirmApprove}
        requestTitle={approveModal.requestTitle}
        adminNotes={approveModal.adminNotes}
        setAdminNotes={(val) => setApproveModal({ ...approveModal, adminNotes: val })}
      />

      <RejectRequestModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ ...rejectModal, isOpen: false, adminNotes: "" })}
        onConfirm={confirmReject}
        requestTitle={rejectModal.requestTitle}
        adminNotes={rejectModal.adminNotes}
        setAdminNotes={(val) => setRejectModal({ ...rejectModal, adminNotes: val })}
      />

      <HelpRequestDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, request: null })}
        request={detailsModal.request}
      />
    </div>
  );
};

export default HelpRequests;
