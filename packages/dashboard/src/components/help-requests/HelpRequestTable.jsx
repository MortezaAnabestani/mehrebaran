import { Typography, Avatar, Tooltip, IconButton } from "@material-tailwind/react";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { getStatusConfig } from "./getStatusConfig";

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

const HelpRequestTable = ({ loading, requests, onView, onApprove, onReject, onDelete }) => {
  return (
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
          ) : requests && requests.length > 0 ? (
            requests.map((request, index) => {
              const isLast = index === requests.length - 1;
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
                  <td className={classes} dir="ltr">
                    <div className="flex items-center gap-1">
                      <Tooltip content="مشاهده جزئیات" className="bg-gray-900 text-xs py-1 px-2 rounded-md">
                        <IconButton
                          variant="text"
                          color="blue-gray"
                          className="rounded-full hover:bg-white hover:shadow-md hover:text-[#007acc] transition-all"
                          onClick={() => onView(request)}
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
                              onClick={() => onApprove(request)}
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="رد درخواست" className="bg-red-600 text-xs py-1 px-2 rounded-md">
                            <IconButton
                              variant="text"
                              color="red"
                              className="rounded-full hover:bg-red-50 hover:shadow-md transition-all"
                              onClick={() => onReject(request)}
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
                          onClick={() => onDelete(request._id, request.title)}
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
  );
};

export default HelpRequestTable;
