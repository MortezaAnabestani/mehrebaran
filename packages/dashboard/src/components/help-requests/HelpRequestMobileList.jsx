import { Typography, Avatar, Chip, Button, IconButton } from "@material-tailwind/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { getStatusConfig } from "./getStatusConfig";

const HelpRequestMobileList = ({ loading, requests, onView, onApprove, onReject }) => {
  return (
    <div className="md:hidden space-y-4 px-4 pb-4 pt-4">
      {!loading &&
        requests &&
        requests.map((request) => {
          const statusConfig = getStatusConfig(request.status);
          return (
            <div
              key={request._id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden"
            >
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
                  onClick={() => onView(request)}
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
                      onClick={() => onApprove(request)}
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="red"
                      variant="gradient"
                      className="rounded-lg shadow-red-100"
                      onClick={() => onReject(request)}
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      {(!requests || requests.length === 0) && !loading && (
        <div className="text-center py-10 text-gray-500">
          <Typography>هیچ درخواستی یافت نشد</Typography>
        </div>
      )}
    </div>
  );
};

export default HelpRequestMobileList;
