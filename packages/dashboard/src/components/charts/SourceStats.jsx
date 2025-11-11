import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ثابت‌های قابل تنظیم
const CHART_CONFIG = {
  height: 450,
  margin: { top: 20, right: 20, left: 160, bottom: 20 },
  barCategoryGap: "20%",
  barSize: 20,
  barRadius: [10, 10, 10, 10],
  pieInnerRadius: 120, // شعاع داخلی برای نمودار دونات
  pieOuterRadius: 200, // شعاع خارجی
  colors: ["#34D399", "#10B981", "#059669", "#047857", "#065F46", "#064E3B", "#34D3D0", "#10B9B5", "#059696"],
  textColors: {
    title: "#333",
    axis: "#555",
    label: "#555",
  },
};

/**
 * کامپوننت نمایش آمار UTM Campaigns
 * @param {Object} props - ویژگی‌های کامپوننت
 * @param {Array} props.utmData - آرایه‌ای از داده‌های UTM
 * @returns {JSX.Element} - کامپوننت نمودار
 */
const SourceStats = ({ utmData = [] }) => {
  const [chartType, setChartType] = useState("bar"); // 'bar' یا 'pie'

  // فرمت کردن داده‌ها برای نمایش در نمودار
  const formatData = (data) => {
    return data.map((item) => {
      const { utmSource = "", utmMedium = "", utmCampaign = "" } = item._id || {};
      return {
        name: `${utmSource || "بدون منبع"} / ${utmMedium || "بدون مدیوم"} / ${utmCampaign || "بدون کمپین"}`,
        shortName: `${utmSource || "?"} / ${utmCampaign || "?"}`,
        value: item.count || 0,
        rawData: item._id,
      };
    });
  };

  // مرتب‌سازی داده‌ها بر اساس تعداد (نزولی)
  const sortedData = React.useMemo(() => {
    return formatData(utmData).sort((a, b) => b.value - a.value);
  }, [utmData]);

  // تابع رندر سفارشی برای Tooltip
  const renderTooltipContent = ({ payload }) => {
    if (!payload || payload.length === 0) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-md rounded-lg border border-gray-100">
        <p className="font-semibold text-gray-700">{data.name}</p>
        <p className="text-sm text-gray-600">
          تعداد بازدید: <span className="font-bold text-green-600">{data.value}</span>
        </p>
      </div>
    );
  };

  // کامپوننت سفارشی برای نمایش برچسب سمت چپ در نمودار میله‌ای
  const CustomLeftLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text x={x - 10} y={y + width / 900 + 12} textAnchor="end" fill="#333" fontSize={12} fontWeight="500">
        {value}
      </text>
    );
  };

  // کامپوننت سفارشی برای نمایش برچسب‌های نمودار دونات
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="shadow-md py-5 bg-white p-4 border border-gray-300 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              chartType === "bar" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            نمودار میله‌ای
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              chartType === "pie" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            نمودار حلقه‌ای
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-700">
          کی از کجا؟ <span className="text-sm">(آمار کمپین‌ها)</span>
        </h2>
      </div>

      {sortedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
          {chartType === "bar" ? (
            <BarChart
              layout="vertical"
              data={sortedData}
              margin={CHART_CONFIG.margin}
              barCategoryGap={CHART_CONFIG.barCategoryGap}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: CHART_CONFIG.textColors.axis }}
              />

              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={0}
                tick={{ fontSize: 12, fill: CHART_CONFIG.textColors.axis }}
              />

              <Tooltip content={renderTooltipContent} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />

              <Bar
                dataKey="value"
                fill="url(#colorUv)"
                radius={CHART_CONFIG.barRadius}
                barSize={CHART_CONFIG.barSize}
              >
                <LabelList dataKey="shortName" position="left" content={<CustomLeftLabel />} />

                <LabelList
                  dataKey="value"
                  position="right"
                  style={{
                    fill: CHART_CONFIG.textColors.label,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                />
              </Bar>

              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={CHART_CONFIG.colors[0]} />
                  <stop offset="100%" stopColor={CHART_CONFIG.colors[1]} />
                </linearGradient>
              </defs>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={CHART_CONFIG.pieOuterRadius}
                innerRadius={CHART_CONFIG.pieInnerRadius}
                dataKey="value"
                nameKey="shortName"
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_CONFIG.colors[index % CHART_CONFIG.colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltipContent} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value, entry, index) => {
                  const data = sortedData[index];
                  return `${data.shortName} (${data.value})`;
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          هیچ داده‌ای برای نمایش وجود ندارد
        </div>
      )}
    </div>
  );
};

// اعتبارسنجی props
SourceStats.propTypes = {
  utmData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.shape({
        utmSource: PropTypes.string,
        utmMedium: PropTypes.string,
        utmCampaign: PropTypes.string,
      }),
      count: PropTypes.number,
    })
  ),
};

export default React.memo(SourceStats);
