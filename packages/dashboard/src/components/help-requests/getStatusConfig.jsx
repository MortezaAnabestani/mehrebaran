import { CheckCircleIcon, XCircleIcon, PhoneIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

export const getStatusConfig = (status) => {
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
