import React from "react";
import PropTypes from "prop-types";
import { CardHeader, Input, Select, Option, Tooltip, IconButton, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

const HelpRequestFilters = ({ filters, onSearchChange, onStatusChange }) => {
  const hasActiveFilters = filters.searchQuery || filters.status;

  const handleClearFilters = () => {
    if (onSearchChange) onSearchChange({ target: { value: "" } });
    if (onStatusChange) onStatusChange("");
  };

  return (
    <CardHeader
      floated={false}
      shadow={false}
      className="rounded-none p-4 md:p-6 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/30 relative z-50"
    >
      {/* Header با نمایش تعداد فیلترهای فعال */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-[#007acc]" />
          <Typography variant="h6" className="font-bold text-gray-800">
            فیلترها
          </Typography>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs font-bold bg-[#007acc] text-white rounded-full">فعال</span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
            پاک کردن همه
          </button>
        )}
      </div>

      {/* بخش فیلترها */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* بخش جستجو */}
        <div className="flex-1 md:max-w-md">
          <div className="relative">
            <Input
              placeholder="عنوان، نام کاربر، شرح..."
              value={filters.searchQuery}
              onChange={onSearchChange}
              className="!border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:!border-[#007acc] focus:!ring-2 focus:!ring-[#007acc]/20 pr-10"
              labelProps={{
                className: "text-gray-600 peer-focus:text-[#007acc] peer-placeholder-shown:text-gray-500",
              }}
              containerProps={{ className: "min-w-0" }}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* بخش انتخاب وضعیت */}
        <div className="w-full md:w-72">
          <Select
            value={filters.status}
            onChange={onStatusChange}
            className="!border-gray-300 bg-white text-gray-900 shadow-sm focus:!border-[#007acc] focus:!ring-2 focus:!ring-[#007acc]/20"
            labelProps={{
              className: "text-gray-600 peer-focus:text-[#007acc]",
            }}
            menuProps={{
              className: "p-1 rounded-xl shadow-2xl border border-gray-200 bg-white max-h-80 overflow-y-auto z-[9999]",
            }}
            containerProps={{
              className: "min-w-0",
            }}
            animate={{
              mount: { y: 0, opacity: 1, scale: 1 },
              unmount: { y: -20, opacity: 0, scale: 0.95 },
            }}
            selected={(element) =>
              element &&
              React.cloneElement(element, {
                disabled: true,
                className: "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
              })
            }
          >
            <Option
              value=""
              className="rounded-lg mb-1 font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 py-1">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                همه وضعیت‌ها
              </div>
            </Option>
            <Option value="pending" className="rounded-lg mb-1 hover:bg-orange-50 transition-colors">
              <div className="flex items-center gap-2 text-orange-700 py-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm"></span>
                در انتظار بررسی
              </div>
            </Option>
            <Option value="approved" className="rounded-lg mb-1 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-2 text-blue-700 py-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm"></span>
                تایید شده
              </div>
            </Option>
            <Option value="in_progress" className="rounded-lg mb-1 hover:bg-cyan-50 transition-colors">
              <div className="flex items-center gap-2 text-cyan-700 py-1">
                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-sm"></span>
                در حال پیگیری
              </div>
            </Option>
            <Option value="completed" className="rounded-lg mb-1 hover:bg-green-50 transition-colors">
              <div className="flex items-center gap-2 text-green-700 py-1">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></span>
                تکمیل شده
              </div>
            </Option>
            <Option value="rejected" className="rounded-lg hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-2 text-red-700 py-1">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span>
                رد شده
              </div>
            </Option>
          </Select>
        </div>

        {/* دکمه فیلتر پیشرفته */}
        <Tooltip
          content="فیلترهای پیشرفته (به زودی)"
          className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-xl"
          placement="bottom"
        >
          <IconButton
            variant="outlined"
            dir="ltr"
            className="rounded-xl border-2 border-gray-200 bg-white hover:bg-[#007acc] hover:border-[#007acc] hover:text-white text-gray-600 transition-all duration-200 shadow-sm hover:shadow-md h-11 w-11"
          >
            <FunnelIcon className="w-5 h-5" />
          </IconButton>
        </Tooltip>
      </div>
    </CardHeader>
  );
};

HelpRequestFilters.propTypes = {
  filters: PropTypes.shape({
    searchQuery: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default HelpRequestFilters;
