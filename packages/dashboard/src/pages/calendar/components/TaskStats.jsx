const TaskStats = ({ stats }) => {
  // پیکربندی داده‌ها با استایل‌های فانکشنال و رنگ‌های وضعیت
  const statsData = [
    {
      id: "total",
      label: "کل وظایف",
      value: stats.total || 0,
      // استفاده از رنگ اصلی برند #007acc
      accentClass: "border-[#007acc] text-[#007acc]",
      bgClass: "bg-blue-50/50",
    },
    {
      id: "completed",
      label: "انجام شده",
      value: stats.completed || 0,
      accentClass: "border-emerald-500 text-emerald-600",
      bgClass: "bg-emerald-50/50",
    },
    {
      id: "inProgress",
      label: "در حال انجام",
      value: stats.inProgress || 0,
      accentClass: "border-amber-500 text-amber-600",
      bgClass: "bg-amber-50/50",
    },
    {
      id: "todo",
      label: "باقیمانده",
      value: stats.todo || 0,
      accentClass: "border-slate-400 text-slate-600",
      bgClass: "bg-slate-50/50",
    },
    {
      id: "overdue",
      label: "عقب افتاده",
      value: stats.overdue || 0,
      accentClass: "border-rose-500 text-rose-600",
      bgClass: "bg-rose-50/50",
    },
  ];

  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className={`
              relative flex flex-col justify-between
              p-3 rounded-md border border-slate-200
              bg-white hover:bg-slate-50 transition-colors duration-200
              border-l-[3px] ${stat.accentClass.split(" ")[0]}
            `}
          >
            {/* لیبل با سایز کوچک و فونت مدیوم */}
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1">
              {stat.label}
            </span>

            {/* مقدار عددی با فونت مونو برای حس مهندسی */}
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-mono font-semibold tracking-tight text-slate-800`}>
                {stat.value}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">عدد</span>
            </div>

            {/* المان تزئینی تکنیکال در گوشه */}
            <div className="absolute top-2 left-2 opacity-20">
              <div
                className={`w-1.5 h-1.5 rounded-full ${stat.accentClass
                  .split(" ")[0]
                  .replace("border", "bg")}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStats;
