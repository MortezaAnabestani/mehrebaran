import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPointTransactions, fetchPointSummary } from "../../features/gamificationSlice";
import { Card, Button, Typography, Chip, Select, Option } from "@material-tailwind/react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const PointTransactions = () => {
  const dispatch = useDispatch();
  const { pointTransactions, pointSummary, loading, totalPages, total } = useSelector((state) => state.gamification);

  const [filters, setFilters] = useState({
    type: "", // earn, spend, bonus
    limit: 10,
    page: 1,
  });

  // بارگذاری تراکنش‌ها و خلاصه امتیازات
  useEffect(() => {
    const loadData = async () => {
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
        };

        if (filters.type) params.type = filters.type;

        await Promise.all([
          dispatch(fetchPointTransactions(params)).unwrap(),
          dispatch(fetchPointSummary()).unwrap(),
        ]);
      } catch (error) {
        console.error("خطا در بارگذاری تراکنش‌ها:", error);
      }
    };

    loadData();
  }, [dispatch, filters.page, filters.limit, filters.type]);

  // تغییر نوع تراکنش
  const handleTypeChange = (value) => {
    setFilters({
      ...filters,
      type: value,
      page: 1,
    });
  };

  // تغییر تعداد آیتم‌ها
  const handleLimitChange = (value) => {
    setFilters({
      ...filters,
      limit: parseInt(value),
      page: 1,
    });
  };

  // رفتن به صفحه بعد
  const goToNextPage = () => {
    if (filters.page < totalPages) {
      setFilters({
        ...filters,
        page: filters.page + 1,
      });
    }
  };

  // رفتن به صفحه قبل
  const goToPrevPage = () => {
    if (filters.page > 1) {
      setFilters({
        ...filters,
        page: filters.page - 1,
      });
    }
  };

  // تبدیل type به فارسی
  const getTypeLabel = (type) => {
    const typeMap = {
      earn: "کسب امتیاز",
      spend: "خرج امتیاز",
      bonus: "پاداش",
      award: "جایزه",
      deduct: "کسر",
    };
    return typeMap[type] || type;
  };

  // رنگ و آیکون برای type
  const getTypeStyle = (type) => {
    switch (type) {
      case "earn":
      case "bonus":
      case "award":
        return {
          color: "green",
          icon: <ArrowUpIcon className="w-4 h-4" />,
        };
      case "spend":
      case "deduct":
        return {
          color: "red",
          icon: <ArrowDownIcon className="w-4 h-4" />,
        };
      default:
        return {
          color: "gray",
          icon: null,
        };
    }
  };

  return (
    <div className="p-6">
      {/* Summary Card */}
      {pointSummary && (
        <Card className="p-6 mb-6">
          <Typography variant="h5" color="blue-gray" className="mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6" />
            خلاصه امتیازات
          </Typography>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                امتیاز کل
              </Typography>
              <Typography variant="h4" color="blue-gray">
                {pointSummary.totalPoints || 0}
              </Typography>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                کسب شده
              </Typography>
              <Typography variant="h4" color="green">
                +{pointSummary.totalEarned || 0}
              </Typography>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                خرج شده
              </Typography>
              <Typography variant="h4" color="red">
                -{pointSummary.totalSpent || 0}
              </Typography>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                پاداش‌های دریافتی
              </Typography>
              <Typography variant="h4" color="purple">
                {pointSummary.totalBonuses || 0}
              </Typography>
            </div>
          </div>
        </Card>
      )}

      {/* Transactions Card */}
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" color="blue-gray">
            تراکنش‌های امتیاز
          </Typography>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Select label="نوع تراکنش" value={filters.type} onChange={handleTypeChange}>
              <Option value="">همه</Option>
              <Option value="earn">کسب امتیاز</Option>
              <Option value="spend">خرج امتیاز</Option>
              <Option value="bonus">پاداش</Option>
              <Option value="award">جایزه</Option>
              <Option value="deduct">کسر</Option>
            </Select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Transactions List */}
            <div className="space-y-3">
              {pointTransactions && Array.isArray(pointTransactions) && pointTransactions.length > 0 ? (
                pointTransactions.map((transaction) => {
                  const typeStyle = getTypeStyle(transaction.type);
                  return (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Type Icon */}
                        <div className={`w-10 h-10 rounded-full bg-${typeStyle.color}-100 flex items-center justify-center`}>
                          {typeStyle.icon}
                        </div>

                        {/* Transaction Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Typography variant="h6" color="blue-gray">
                              {transaction.description || "تراکنش"}
                            </Typography>
                            <Chip
                              value={getTypeLabel(transaction.type)}
                              color={typeStyle.color}
                              size="sm"
                            />
                          </div>
                          {transaction.metadata && (
                            <Typography variant="small" color="gray">
                              {transaction.metadata.action && `عملیات: ${transaction.metadata.action}`}
                            </Typography>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <Typography variant="small" color="gray">
                              {new Date(transaction.createdAt).toLocaleString("fa-IR")}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-left">
                        <Typography
                          variant="h5"
                          color={typeStyle.color}
                          className="font-bold"
                        >
                          {transaction.type === "spend" || transaction.type === "deduct" ? "-" : "+"}
                          {transaction.points}
                        </Typography>
                        <Typography variant="small" color="gray">
                          امتیاز
                        </Typography>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <ChartBarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <Typography variant="h6" color="gray">
                    هیچ تراکنشی یافت نشد
                  </Typography>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2">
                <Typography variant="small" color="blue-gray">
                  تعداد در صفحه:
                </Typography>
                <Select value={filters.limit.toString()} onChange={handleLimitChange} className="w-20">
                  <Option value="5">5</Option>
                  <Option value="10">10</Option>
                  <Option value="15">15</Option>
                  <Option value="20">20</Option>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <Typography variant="small" color="blue-gray">
                  {filters.page}/{totalPages || 1} از {total || 0}
                </Typography>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={filters.page <= 1}
                    variant="outlined"
                  >
                    قبلی
                  </Button>
                  <Button
                    size="sm"
                    onClick={goToNextPage}
                    disabled={filters.page >= (totalPages || 1)}
                    variant="outlined"
                  >
                    بعدی
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default PointTransactions;
