import React from "react";
import { Typography } from "@material-tailwind/react";
import {
  ChartBarIcon,
  DocumentTextIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const colorVariants = {
  blue: {
    wrapper: "bg-blue-50 text-blue-600 ring-blue-100",
    iconBg: "bg-blue-500",
    glow: "bg-blue-500",
  },
  orange: {
    wrapper: "bg-orange-50 text-orange-600 ring-orange-100",
    iconBg: "bg-orange-500",
    glow: "bg-orange-500",
  },
  cyan: {
    wrapper: "bg-cyan-50 text-cyan-600 ring-cyan-100",
    iconBg: "bg-cyan-500",
    glow: "bg-cyan-500",
  },
  green: {
    wrapper: "bg-green-50 text-green-600 ring-green-100",
    iconBg: "bg-green-500",
    glow: "bg-green-500",
  },
  red: {
    wrapper: "bg-red-50 text-red-600 ring-red-100",
    iconBg: "bg-red-500",
    glow: "bg-red-500",
  },
};

const StatCard = ({ title, value, icon, colorKey }) => {
  const theme = colorVariants[colorKey] || colorVariants.blue;

  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* افکت درخشش پس‌زمینه */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-500 ${theme.glow}`}
      ></div>

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col">
          <Typography variant="small" className="font-medium text-xs text-gray-500 mb-1">
            {title}
          </Typography>
          <Typography variant="h3" color="blue-gray" className="font-bold text-2xl tracking-tight">
            {value}
          </Typography>
        </div>

        <div className={`p-2.5 rounded-xl shadow-sm ring-1 ring-inset ${theme.wrapper} transition-colors`}>
          {React.cloneElement(icon, { className: "w-6 h-6" })}
        </div>
      </div>
    </div>
  );
};

const HelpRequestStats = ({ stats }) => {
  // جلوگیری از کرش کردن در صورت نبود دیتا
  const safeStats = stats || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
      <StatCard title="کل درخواست‌ها" value={safeStats.total || 0} icon={<ChartBarIcon />} colorKey="blue" />
      <StatCard
        title="در انتظار بررسی"
        value={safeStats.pending || 0}
        icon={<DocumentTextIcon />}
        colorKey="orange"
      />
      <StatCard
        title="در حال پیگیری"
        value={safeStats.in_progress || 0}
        icon={<PhoneIcon />}
        colorKey="cyan"
      />
      <StatCard
        title="تکمیل شده"
        value={safeStats.completed || 0}
        icon={<CheckCircleIcon />}
        colorKey="green"
      />
      <StatCard title="رد شده" value={safeStats.rejected || 0} icon={<XCircleIcon />} colorKey="red" />
    </div>
  );
};

export default HelpRequestStats;
