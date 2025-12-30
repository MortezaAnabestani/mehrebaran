import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

// --- UI COMPONENTS (Functional Design System) ---

const Badge = ({ children, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    red: "bg-rose-50 text-rose-600 border-rose-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-md";

  const variants = {
    primary: "bg-[#007acc] text-white hover:bg-[#0062a3] shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    danger: "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
  };

  const sizes = {
    sm: "h-7 px-2 text-[11px]",
    md: "h-8 px-3 text-[12px]",
    lg: "h-10 px-4 text-[13px]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative w-full">
    {Icon && <Icon className="absolute right-2.5 top-2 h-4 w-4 text-slate-400" />}
    <input
      className={`w-full h-8 rounded-md border border-slate-300 bg-white text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all ${
        Icon ? "pr-9 pl-2" : "px-2"
      }`}
      {...props}
    />
  </div>
);

const Select = ({ options, ...props }) => (
  <div className="relative w-full">
    <select
      className="w-full h-8 rounded-md border border-slate-300 bg-white text-[12px] text-slate-900 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] px-2 outline-none appearance-none"
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="absolute left-2 top-2.5 pointer-events-none">
      <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-4">
    <span className="text-[11px] text-slate-500">
      صفحه <span className="font-medium text-slate-900">{currentPage}</span> از{" "}
      <span className="font-medium text-slate-900">{totalPages}</span>
    </span>
    <div className="flex gap-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronRightIcon className="h-3 w-3" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronLeftIcon className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

// --- SUB-PAGES ---

function NeedsModerationTab() {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [filters, setFilters] = useState({ status: "", search: "", page: 1, limit: 20 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchNeeds();
  }, [filters.status, filters.page]);

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      const response = await api.get(`/admin/moderation/needs?${params}`);
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

  const handleBulkAction = async (status) => {
    if (selectedNeeds.length === 0) return;
    if (status === "rejected" && !rejectionReason) {
      setRejectDialogOpen(true);
      return;
    }
    try {
      await api.put(`/admin/moderation/needs/bulk-status`, {
        needIds: selectedNeeds,
        status,
        reason: status === "rejected" ? rejectionReason : undefined,
      });
      setSelectedNeeds([]);
      setRejectionReason("");
      setRejectDialogOpen(false);
      fetchNeeds();
    } catch (error) {
      alert("خطا در عملیات");
    }
  };

  const toggleNeed = (id) => {
    setSelectedNeeds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelectedNeeds(selectedNeeds.length === needs.length ? [] : needs.map((n) => n._id));
  };

  const statusConfig = {
    pending: { label: "در انتظار", color: "amber" },
    active: { label: "فعال", color: "green" },
    rejected: { label: "رد شده", color: "red" },
    completed: { label: "تکمیل", color: "blue" },
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-2 bg-slate-50 p-3 rounded-md border border-slate-200">
        <div className="w-full md:w-48">
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            options={[
              { value: "", label: "همه وضعیت‌ها" },
              { value: "pending", label: "در انتظار" },
              { value: "active", label: "فعال" },
              { value: "rejected", label: "رد شده" },
            ]}
          />
        </div>
        <div className="w-full md:w-64">
          <Input
            icon={MagnifyingGlassIcon}
            placeholder="جستجو در عنوان..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <Button variant="secondary" onClick={fetchNeeds} disabled={loading}>
            <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {selectedNeeds.length > 0 && (
            <>
              <Button variant="success" onClick={() => handleBulkAction("active")}>
                <CheckIcon className="h-4 w-4 ml-1" /> تایید ({selectedNeeds.length})
              </Button>
              <Button variant="danger" onClick={() => handleBulkAction("rejected")}>
                <XMarkIcon className="h-4 w-4 ml-1" /> رد ({selectedNeeds.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
        <table className="w-full text-right border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-300"
                  checked={selectedNeeds.length === needs.length && needs.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">عنوان نیاز</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">کاربر</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">دسته‌بندی</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">وضعیت</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">تاریخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {needs.length > 0 ? (
              needs.map((need) => (
                <tr key={need._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                      checked={selectedNeeds.includes(need._id)}
                      onChange={() => toggleNeed(need._id)}
                    />
                  </td>
                  <td className="p-3 text-[12px] font-medium text-slate-800">{need.title}</td>
                  <td className="p-3 text-[12px] text-slate-600">{need.createdBy?.fullName || "ناشناس"}</td>
                  <td className="p-3 text-[12px] text-slate-500 font-mono">{need.category?.name || "-"}</td>
                  <td className="p-3">
                    <Badge color={statusConfig[need.status]?.color}>
                      {statusConfig[need.status]?.label || need.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-[11px] text-slate-400 font-mono">
                    {new Date(need.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[12px] text-slate-500">
                  داده‌ای یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {pagination.totalPages > 1 && (
          <div className="px-3 pb-3">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setFilters({ ...filters, page: p })}
            />
          </div>
        )}
      </div>

      {/* Reject Dialog (Simple Modal) */}
      {rejectDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 w-full max-w-md p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">دلیل رد درخواست</h3>
            <textarea
              className="w-full p-2 text-[12px] border border-slate-300 rounded-md focus:border-[#007acc] outline-none"
              rows={4}
              placeholder="توضیحات..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setRejectDialogOpen(false)}>
                انصراف
              </Button>
              <Button variant="danger" onClick={() => handleBulkAction("rejected")}>
                تایید رد
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentsModerationTab() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", page: 1, limit: 20 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  useEffect(() => {
    fetchComments();
  }, [filters.page]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      const response = await api.get(`/admin/moderation/comments?${params}`);
      if (response.data.success) {
        setComments(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 bg-slate-50 p-3 rounded-md border border-slate-200">
        <div className="w-full md:w-64">
          <Input
            icon={MagnifyingGlassIcon}
            placeholder="جستجو در نظرات..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Button variant="secondary" onClick={fetchComments} disabled={loading}>
          <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
        <table className="w-full text-right border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 text-[11px] font-semibold text-slate-500 w-1/2">محتوا</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">کاربر</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">هدف</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">تاریخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comments.map((comment) => (
              <tr key={comment._id} className="hover:bg-slate-50">
                <td className="p-3 text-[12px] text-slate-700 leading-relaxed">{comment.content}</td>
                <td className="p-3 text-[12px] text-slate-600">{comment.user?.fullName || "ناشناس"}</td>
                <td className="p-3 text-[12px] text-slate-500">{comment.target?.title || "-"}</td>
                <td className="p-3 text-[11px] text-slate-400 font-mono">
                  {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[12px] text-slate-500">
                  نظری یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {pagination.totalPages > 1 && (
          <div className="px-3 pb-3">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setFilters({ ...filters, page: p })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DonationsModerationTab() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "", search: "", page: 1, limit: 20 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  useEffect(() => {
    fetchDonations();
  }, [filters.status, filters.page]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      const response = await api.get(`/admin/moderation/donations?${params}`);
      if (response.data.success) {
        setDonations(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/moderation/donations/${id}/status`, { status });
      fetchDonations();
    } catch (error) {
      alert("خطا در بروزرسانی");
    }
  };

  const statusConfig = {
    pending: { label: "در انتظار", color: "amber" },
    completed: { label: "تکمیل شده", color: "green" },
    failed: { label: "ناموفق", color: "red" },
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-2 bg-slate-50 p-3 rounded-md border border-slate-200">
        <div className="w-full md:w-48">
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            options={[
              { value: "", label: "همه وضعیت‌ها" },
              { value: "pending", label: "در انتظار" },
              { value: "completed", label: "تکمیل شده" },
              { value: "failed", label: "ناموفق" },
            ]}
          />
        </div>
        <div className="w-full md:w-64">
          <Input
            icon={MagnifyingGlassIcon}
            placeholder="جستجو..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="flex-1 flex justify-end">
          <Button variant="secondary" onClick={fetchDonations} disabled={loading}>
            <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
        <table className="w-full text-right border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 text-[11px] font-semibold text-slate-500">مبلغ</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">کمک‌کننده</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">نیاز</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">وضعیت</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">تاریخ</th>
              <th className="p-3 text-[11px] font-semibold text-slate-500">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {donations.map((donation) => (
              <tr key={donation._id} className="hover:bg-slate-50">
                <td className="p-3 text-[12px] font-mono font-medium text-slate-800">
                  {donation.amount?.toLocaleString("fa-IR")}{" "}
                  <span className="text-[10px] text-slate-500">تومان</span>
                </td>
                <td className="p-3 text-[12px] text-slate-600">{donation.donor?.fullName || "ناشناس"}</td>
                <td className="p-3 text-[12px] text-slate-500">{donation.need?.title || "-"}</td>
                <td className="p-3">
                  <Badge color={statusConfig[donation.status]?.color}>
                    {statusConfig[donation.status]?.label || donation.status}
                  </Badge>
                </td>
                <td className="p-3 text-[11px] text-slate-400 font-mono">
                  {new Date(donation.createdAt).toLocaleDateString("fa-IR")}
                </td>
                <td className="p-3">
                  {donation.status === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleUpdateStatus(donation._id, "completed")}
                      >
                        تایید
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleUpdateStatus(donation._id, "failed")}
                      >
                        رد
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[12px] text-slate-500">
                  کمکی یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {pagination.totalPages > 1 && (
          <div className="px-3 pb-3">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setFilters({ ...filters, page: p })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState("needs");

  const tabs = [
    { id: "needs", label: "نیازها", icon: DocumentTextIcon },
    { id: "comments", label: "نظرات", icon: ChatBubbleLeftIcon },
    { id: "donations", label: "کمک‌ها", icon: CurrencyDollarIcon },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">مدیریت محتوا</h1>
          <p className="text-[12px] text-slate-500 mt-1">بررسی و نظارت بر فعالیت‌های کاربران و تراکنش‌ها</p>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="space-y-4">
        <div className="border-b border-slate-200">
          <nav className="flex gap-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-[13px] transition-all
                    ${
                      isActive
                        ? "border-[#007acc] text-[#007acc]"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }
                  `}
                >
                  <tab.icon
                    className={`ml-2 h-4 w-4 ${
                      isActive ? "text-[#007acc]" : "text-slate-400 group-hover:text-slate-500"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === "needs" && <NeedsModerationTab />}
          {activeTab === "comments" && <CommentsModerationTab />}
          {activeTab === "donations" && <DonationsModerationTab />}
        </div>
      </div>
    </div>
  );
}
