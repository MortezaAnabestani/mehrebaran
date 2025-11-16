import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Checkbox,
  Input,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Chip,
} from "@material-tailwind/react";
import {
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        size="sm"
        variant="outlined"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        قبلی
      </Button>
      <Typography variant="small" className="text-gray-700">
        صفحه {currentPage.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
      </Typography>
      <Button
        size="sm"
        variant="outlined"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        بعدی
      </Button>
    </div>
  );
}

// Needs Moderation Tab
function NeedsModerationTab() {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 20 });
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchNeeds();
  }, [filters.status, filters.page]);

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const response = await api.get(
        `/admin/moderation/needs?${params}`
      );

      if (response.data.success) {
        setNeeds(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching needs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (status: string) => {
    if (selectedNeeds.length === 0) {
      alert("لطفاً حداقل یک نیاز را انتخاب کنید");
      return;
    }

    if (status === "rejected" && !rejectionReason) {
      setRejectDialogOpen(true);
      return;
    }

    try {
      await api.put(
        `/admin/moderation/needs/bulk-status`,
        {
          needIds: selectedNeeds,
          status,
          reason: status === "rejected" ? rejectionReason : undefined,
        }
      );

      setSelectedNeeds([]);
      setRejectionReason("");
      setRejectDialogOpen(false);
      fetchNeeds();
    } catch (error) {
      console.error("Error updating needs:", error);
      alert("خطا در به‌روزرسانی نیازها");
    }
  };

  const toggleNeed = (needId: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(needId) ? prev.filter((id) => id !== needId) : [...prev, needId]
    );
  };

  const toggleAll = () => {
    if (selectedNeeds.length === needs.length) {
      setSelectedNeeds([]);
    } else {
      setSelectedNeeds(needs.map((need: any) => need._id));
    }
  };

  const statusColors = {
    pending: "amber",
    active: "green",
    rejected: "red",
    completed: "blue",
  };

  const statusLabels = {
    pending: "در انتظار",
    active: "فعال",
    rejected: "رد شده",
    completed: "تکمیل شده",
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="فیلتر بر اساس وضعیت"
              value={filters.status}
              onChange={(val) => setFilters({ ...filters, status: val || "", page: 1 })}
            >
              <Option value="">همه</Option>
              <Option value="pending">در انتظار</Option>
              <Option value="active">فعال</Option>
              <Option value="rejected">رد شده</Option>
            </Select>

            <div className="relative">
              <Input
                label="جستجو"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>

            <Button
              onClick={fetchNeeds}
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
            >
              {loading ? "در حال بارگذاری..." : "اعمال فیلتر"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Bulk Actions */}
      {selectedNeeds.length > 0 && (
        <Card className="bg-blue-50">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <Typography variant="small" className="font-semibold">
                {selectedNeeds.length.toLocaleString("fa-IR")} نیاز انتخاب شده
              </Typography>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="green"
                  onClick={() => handleBulkAction("active")}
                  className="flex items-center gap-1"
                >
                  <CheckIcon className="h-4 w-4" />
                  تایید
                </Button>
                <Button
                  size="sm"
                  color="red"
                  onClick={() => handleBulkAction("rejected")}
                  className="flex items-center gap-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                  رد
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Needs List */}
      <Card>
        <CardBody className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-right">
                  <Checkbox checked={selectedNeeds.length === needs.length} onChange={toggleAll} />
                </th>
                <th className="p-4 text-right text-sm font-semibold">عنوان</th>
                <th className="p-4 text-right text-sm font-semibold">ایجادکننده</th>
                <th className="p-4 text-right text-sm font-semibold">دسته‌بندی</th>
                <th className="p-4 text-right text-sm font-semibold">وضعیت</th>
                <th className="p-4 text-right text-sm font-semibold">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {needs.length > 0 ? (
                needs.map((need: any) => (
                  <tr key={need._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedNeeds.includes(need._id)}
                        onChange={() => toggleNeed(need._id)}
                      />
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="font-medium">
                        {need.title}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-600">
                        {need.createdBy?.fullName || need.createdBy?.username || "ناشناس"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-600">
                        {need.category?.name || "-"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Chip
                        value={statusLabels[need.status] || need.status}
                        color={statusColors[need.status] || "gray"}
                        size="sm"
                      />
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-600">
                        {new Date(need.createdAt).toLocaleDateString("fa-IR")}
                      </Typography>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Typography variant="small" className="text-gray-500">
                      {loading ? "در حال بارگذاری..." : "نیازی یافت نشد"}
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div className="p-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} handler={() => setRejectDialogOpen(false)}>
        <DialogHeader>دلیل رد نیاز</DialogHeader>
        <DialogBody>
          <Textarea
            label="دلیل رد را وارد کنید"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="outlined" onClick={() => setRejectDialogOpen(false)}>
            انصراف
          </Button>
          <Button color="red" onClick={() => handleBulkAction("rejected")}>
            رد نیاز
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

// Comments Moderation Tab
function CommentsModerationTab() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    isApproved: "",
    search: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 20 });

  useEffect(() => {
    fetchComments();
  }, [filters.isApproved, filters.page]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.isApproved !== "") params.append("isApproved", filters.isApproved);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const response = await api.get(
        `/admin/moderation/comments?${params}`
      );

      if (response.data.success) {
        setComments(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (isApproved: boolean) => {
    if (selectedComments.length === 0) {
      alert("لطفاً حداقل یک نظر را انتخاب کنید");
      return;
    }

    try {
      await api.put(
        `/admin/moderation/comments/bulk-approval`,
        {
          commentIds: selectedComments,
          isApproved,
        }
      );

      setSelectedComments([]);
      fetchComments();
    } catch (error) {
      console.error("Error updating comments:", error);
      alert("خطا در به‌روزرسانی نظرات");
    }
  };

  const toggleComment = (commentId: string) => {
    setSelectedComments((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
    );
  };

  const toggleAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map((comment: any) => comment._id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="فیلتر بر اساس وضعیت"
              value={filters.isApproved}
              onChange={(val) => setFilters({ ...filters, isApproved: val || "", page: 1 })}
            >
              <Option value="">همه</Option>
              <Option value="false">در انتظار تایید</Option>
              <Option value="true">تایید شده</Option>
            </Select>

            <div className="relative">
              <Input
                label="جستجو"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>

            <Button
              onClick={fetchComments}
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
            >
              {loading ? "در حال بارگذاری..." : "اعمال فیلتر"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Bulk Actions */}
      {selectedComments.length > 0 && (
        <Card className="bg-blue-50">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <Typography variant="small" className="font-semibold">
                {selectedComments.length.toLocaleString("fa-IR")} نظر انتخاب شده
              </Typography>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="green"
                  onClick={() => handleBulkAction(true)}
                  className="flex items-center gap-1"
                >
                  <CheckIcon className="h-4 w-4" />
                  تایید
                </Button>
                <Button
                  size="sm"
                  color="red"
                  onClick={() => handleBulkAction(false)}
                  className="flex items-center gap-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                  رد
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Comments List */}
      <Card>
        <CardBody className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-right">
                  <Checkbox
                    checked={selectedComments.length === comments.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="p-4 text-right text-sm font-semibold">محتوا</th>
                <th className="p-4 text-right text-sm font-semibold">کاربر</th>
                <th className="p-4 text-right text-sm font-semibold">نیاز</th>
                <th className="p-4 text-right text-sm font-semibold">وضعیت</th>
                <th className="p-4 text-right text-sm font-semibold">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {comments.length > 0 ? (
                comments.map((comment: any) => (
                  <tr key={comment._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedComments.includes(comment._id)}
                        onChange={() => toggleComment(comment._id)}
                      />
                    </td>
                    <td className="p-4 max-w-md">
                      <Typography variant="small" className="line-clamp-2">
                        {comment.content}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-600">
                        {comment.user?.fullName || comment.user?.username || "ناشناس"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-600">
                        {comment.need?.title || "-"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Chip
                        value={comment.isApproved ? "تایید شده" : "در انتظار"}
                        color={comment.isApproved ? "green" : "amber"}
                        size="sm"
                      />
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-600">
                        {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                      </Typography>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Typography variant="small" className="text-gray-500">
                      {loading ? "در حال بارگذاری..." : "نظری یافت نشد"}
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div className="p-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

// Donations Moderation Tab
function DonationsModerationTab() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 20 });

  useEffect(() => {
    fetchDonations();
  }, [filters.status, filters.page]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const response = await api.get(
        `/admin/moderation/donations?${params}`
      );

      if (response.data.success) {
        setDonations(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (donationId: string, status: string) => {
    try {
      await api.put(
        `/admin/moderation/donations/${donationId}/status`,
        { status }
      );

      fetchDonations();
    } catch (error) {
      console.error("Error updating donation:", error);
      alert("خطا در به‌روزرسانی کمک");
    }
  };

  const statusColors = {
    pending: "amber",
    completed: "green",
    failed: "red",
  };

  const statusLabels = {
    pending: "در انتظار",
    completed: "تکمیل شده",
    failed: "ناموفق",
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="فیلتر بر اساس وضعیت"
              value={filters.status}
              onChange={(val) => setFilters({ ...filters, status: val || "", page: 1 })}
            >
              <Option value="">همه</Option>
              <Option value="pending">در انتظار</Option>
              <Option value="completed">تکمیل شده</Option>
              <Option value="failed">ناموفق</Option>
            </Select>

            <div className="relative">
              <Input
                label="جستجو"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>

            <Button
              onClick={fetchDonations}
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
            >
              {loading ? "در حال بارگذاری..." : "اعمال فیلتر"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Donations List */}
      <Card>
        <CardBody className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-right text-sm font-semibold">مبلغ</th>
                <th className="p-4 text-right text-sm font-semibold">کمک‌کننده</th>
                <th className="p-4 text-right text-sm font-semibold">نیاز</th>
                <th className="p-4 text-right text-sm font-semibold">وضعیت</th>
                <th className="p-4 text-right text-sm font-semibold">تاریخ</th>
                <th className="p-4 text-right text-sm font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.map((donation: any) => (
                  <tr key={donation._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Typography variant="small" className="font-semibold">
                        {donation.amount?.toLocaleString("fa-IR")} تومان
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-600">
                        {donation.donor?.fullName || donation.donor?.username || "ناشناس"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-600">
                        {donation.need?.title || "-"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Chip
                        value={statusLabels[donation.status] || donation.status}
                        color={statusColors[donation.status] || "gray"}
                        size="sm"
                      />
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-600">
                        {new Date(donation.createdAt).toLocaleDateString("fa-IR")}
                      </Typography>
                    </td>
                    <td className="p-4">
                      {donation.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="green"
                            onClick={() => handleUpdateStatus(donation._id, "completed")}
                          >
                            تایید
                          </Button>
                          <Button
                            size="sm"
                            color="red"
                            onClick={() => handleUpdateStatus(donation._id, "failed")}
                          >
                            رد
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Typography variant="small" className="text-gray-500">
                      {loading ? "در حال بارگذاری..." : "کمکی یافت نشد"}
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div className="p-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState("needs");

  const tabs = [
    { label: "نیازها", value: "needs", icon: DocumentTextIcon },
    { label: "نظرات", value: "comments", icon: ChatBubbleLeftIcon },
    { label: "کمک‌ها", value: "donations", icon: CurrencyDollarIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h3" className="font-bold text-gray-800">
          مدیریت محتوا
        </Typography>
        <Typography variant="small" className="text-gray-600 mt-1">
          بررسی و تایید محتوای کاربران
        </Typography>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
          <TabsHeader className="bg-gray-100">
            {tabs.map(({ label, value, icon: Icon }) => (
              <Tab key={value} value={value} className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {label}
              </Tab>
            ))}
          </TabsHeader>

          <TabsBody>
            <TabPanel value="needs" className="p-6">
              <NeedsModerationTab />
            </TabPanel>

            <TabPanel value="comments" className="p-6">
              <CommentsModerationTab />
            </TabPanel>

            <TabPanel value="donations" className="p-6">
              <DonationsModerationTab />
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>
    </div>
  );
}
