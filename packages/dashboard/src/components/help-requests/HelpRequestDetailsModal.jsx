import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  PaperClipIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/solid";
import { getStatusConfig } from "./getStatusConfig";

const HelpRequestDetailsModal = ({ isOpen, onClose, request }) => {
  if (!request) return null;

  const statusConfig = getStatusConfig(request.status);

  // تابع کمکی برای نمایش تاریخ و ساعت
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("fa-IR"),
      time: date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const { date, time } = formatDate(request.createdAt);

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="xl"
      className="bg-transparent shadow-none w-8/10"
      dismiss={{
        enabled: true,
        escapeKey: true,
        outsidePress: true,
      }}
      animate={{
        mount: { scale: 1, y: 0, opacity: 1 },
        unmount: { scale: 0.95, y: 20, opacity: 0 },
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md -z-10 rounded-3xl"></div>
      <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* --- Header Section --- */}
        <DialogHeader className="relative flex flex-col gap-4 border-b border-gray-200/50 p-6 bg-white/40">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.icon}
                </div>
                <Typography variant="h4" color="blue-gray" className="font-bold tracking-tight">
                  {request.title}
                </Typography>
              </div>
              <Typography className="text-gray-500 text-xs font-mono mt-1 mr-12">
                ID: <span className="select-all">{request._id}</span>
              </Typography>
            </div>

            <IconButton
              variant="text"
              color="blue-gray"
              onClick={onClose}
              className="bg-white/50 hover:bg-white/80 rounded-full transition-colors"
              dir="ltr"
            >
              <XMarkIcon className="h-6 w-6" />
            </IconButton>
          </div>

          {/* Meta Data Bar */}
          <div className="flex flex-wrap items-center gap-3 mr-12">
            <Chip
              value={statusConfig.label}
              className={`${statusConfig.bg} ${statusConfig.text} border-none normal-case text-sm py-1 px-3 rounded-lg`}
            />
            <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-1.5 text-gray-600 text-sm bg-white/50 px-3 py-1 rounded-lg border border-white/60 shadow-sm">
              <CalendarDaysIcon className="w-4 h-4 text-[#007acc]" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-sm bg-white/50 px-3 py-1 rounded-lg border border-white/60 shadow-sm">
              <ClockIcon className="w-4 h-4 text-[#007acc]" />
              <span>{time}</span>
            </div>
          </div>
        </DialogHeader>

        {/* --- Body Section --- */}
        <DialogBody className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Description Card */}
              <div className="bg-white/60 border border-white/60 rounded-2xl p-6 shadow-sm backdrop-blur-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 w-1 h-full bg-[#007acc]"></div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-[#007acc]" />
                  شرح درخواست
                </Typography>
                <Typography className="text-gray-700 text-justify leading-8 text-sm md:text-base font-normal">
                  {request.description}
                </Typography>
              </div>

              {/* Admin Notes (Conditional) */}
              {request.adminNotes && (
                <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-amber-200 rounded-full blur-2xl opacity-40"></div>
                  <Typography
                    variant="small"
                    className="font-bold text-amber-800 mb-2 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    یادداشت ادمین
                  </Typography>
                  <p className="text-amber-900 text-sm relative z-10 leading-relaxed">{request.adminNotes}</p>
                </div>
              )}

              {/* Media Gallery */}
              {request.media && request.media.length > 0 && (
                <div className="bg-white/40 border border-white/40 rounded-2xl p-5">
                  <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2 text-sm">
                    <PaperClipIcon className="w-4 h-4 text-[#007acc]" />
                    فایل‌های پیوست ({request.media.length})
                  </Typography>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {request.media.map((media, index) => (
                      <div
                        key={index}
                        className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm cursor-pointer"
                      >
                        <img
                          src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${
                            media.desktop || media
                          }`}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#007acc]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <Button
                            size="sm"
                            className="bg-white text-[#007acc] flex items-center gap-2 shadow-lg hover:shadow-xl"
                          >
                            <EyeIcon className="w-3 h-3" /> نمایش
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: User Info (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-gradient-to-b from-white/80 to-white/40 border border-white/60 rounded-2xl p-5 shadow-sm sticky top-0">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-3"
                >
                  <UserIcon className="w-5 h-5 text-[#007acc]" />
                  اطلاعات درخواست‌کننده
                </Typography>

                <div className="flex flex-col items-center mb-6">
                  <div className="p-1 rounded-full border-2 border-[#007acc]/20 mb-3">
                    <Avatar
                      src={`https://ui-avatars.com/api/?name=${request.guestName}&background=007acc&color=fff&bold=true`}
                      size="xl"
                      className="shadow-lg"
                    />
                  </div>
                  <Typography variant="h5" color="blue-gray" className="font-bold text-center">
                    {request.guestName}
                  </Typography>
                  <Typography variant="small" className="text-gray-500 font-normal">
                    کاربر مهمان
                  </Typography>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/50 p-3 rounded-xl border border-white/50 flex items-center gap-3 hover:bg-white/80 transition-colors">
                    <div className="p-2 bg-blue-50 rounded-lg text-[#007acc]">
                      <PhoneIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography variant="small" className="text-gray-500 text-[10px] mb-0.5">
                        شماره تماس
                      </Typography>
                      <Typography
                        color="blue-gray"
                        className="font-bold text-sm font-mono dir-ltr text-right truncate"
                      >
                        {request.guestPhone}
                      </Typography>
                    </div>
                  </div>

                  <div className="bg-white/50 p-3 rounded-xl border border-white/50 flex items-center gap-3 hover:bg-white/80 transition-colors">
                    <div className="p-2 bg-blue-50 rounded-lg text-[#007acc]">
                      <EnvelopeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography variant="small" className="text-gray-500 text-[10px] mb-0.5">
                        ایمیل
                      </Typography>
                      <Tooltip content={request.guestEmail || "ثبت نشده"}>
                        <Typography color="blue-gray" className="font-bold text-sm truncate">
                          {request.guestEmail || "---"}
                        </Typography>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>

        {/* --- Footer Section --- */}
        <DialogFooter className="bg-white/60 border-t border-gray-200/50 p-4 backdrop-blur-md flex justify-between items-center">
          <Typography variant="small" className="text-gray-400 font-normal hidden sm:block">
            سیستم مدیریت درخواست‌ها
          </Typography>
          <Button
            size="md"
            className="bg-[#007acc] hover:bg-[#0062a3] shadow-lg shadow-blue-500/20 rounded-xl w-full sm:w-auto"
            onClick={onClose}
          >
            بستن پنجره
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};

export default HelpRequestDetailsModal;
