import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getTopSharedItems,
  getItemShareStats,
} from "../../features/socialSlice";
import {
  Card,
  Button,
  Typography,
  Chip,
  Progress,
} from "@material-tailwind/react";
import {
  ShareIcon,
  ChartBarIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

const Shares = () => {
  const dispatch = useDispatch();
  const { topSharedItems, shareStats, loading } = useSelector((state) => state.social);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [timeRange, setTimeRange] = useState("week"); // week, month, all

  // بارگذاری محتوای پراشتراک
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(getTopSharedItems({ timeRange, limit: 50 })).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری محتوای پراشتراک:", error);
      }
    };

    loadData();
  }, [dispatch, timeRange]);

  // بارگذاری آمار اشتراک‌گذاری برای یک آیتم
  const handleViewStats = async (itemId) => {
    setSelectedItemId(itemId);
    try {
      await dispatch(getItemShareStats(itemId)).unwrap();
    } catch (error) {
      console.error("خطا در دریافت آمار اشتراک‌گذاری:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // نام پلتفرم به فارسی
  const getPlatformLabel = (platform) => {
    const platformMap = {
      telegram: "تلگرام",
      whatsapp: "واتساپ",
      twitter: "توییتر (X)",
      linkedin: "لینکدین",
      facebook: "فیسبوک",
      instagram: "اینستاگرام",
      email: "ایمیل",
      copy_link: "کپی لینک",
      other: "سایر",
    };
    return platformMap[platform] || platform;
  };

  // رنگ پلتفرم
  const getPlatformColor = (platform) => {
    const colorMap = {
      telegram: "blue",
      whatsapp: "green",
      twitter: "cyan",
      linkedin: "indigo",
      facebook: "blue",
      instagram: "pink",
      email: "red",
      copy_link: "gray",
      other: "gray",
    };
    return colorMap[platform] || "gray";
  };

  // محاسبه درصد اشتراک‌گذاری هر پلتفرم
  const calculatePlatformPercentage = (platform, total) => {
    if (!total || total === 0) return 0;
    const platformShares = shareStats?.platformBreakdown?.find(
      (p) => p._id === platform
    )?.count || 0;
    return Math.round((platformShares / total) * 100);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              آمار اشتراک‌گذاری محتوا
            </Typography>
            <Typography variant="small" color="gray">
              مشاهده محتوای پراشتراک و آمار پلتفرم‌های اشتراک‌گذاری
            </Typography>
          </div>

          {/* Time Range Filter */}
          <div className="flex gap-2">
            <Button
              size="sm"
              color={timeRange === "week" ? "blue" : "gray"}
              variant={timeRange === "week" ? "filled" : "outlined"}
              onClick={() => setTimeRange("week")}
            >
              این هفته
            </Button>
            <Button
              size="sm"
              color={timeRange === "month" ? "blue" : "gray"}
              variant={timeRange === "month" ? "filled" : "outlined"}
              onClick={() => setTimeRange("month")}
            >
              این ماه
            </Button>
            <Button
              size="sm"
              color={timeRange === "all" ? "blue" : "gray"}
              variant={timeRange === "all" ? "filled" : "outlined"}
              onClick={() => setTimeRange("all")}
            >
              همه زمان‌ها
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Shared Items */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ChartBarIcon className="w-6 h-6 text-blue-500" />
              <Typography variant="h6" color="blue-gray">
                محتوای پراشتراک
              </Typography>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : topSharedItems && topSharedItems.length > 0 ? (
              <div className="space-y-3">
                {topSharedItems.map((item, index) => (
                  <div
                    key={item._id}
                    className={`p-4 border rounded-lg ${
                      selectedItemId === item._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-white"
                              : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                              ? "bg-orange-700 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                          {item.title || "محتوا"}
                        </Typography>
                        <Typography variant="small" color="gray" className="mb-2 line-clamp-2">
                          {item.description || "بدون توضیحات"}
                        </Typography>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <ShareIcon className="w-4 h-4 text-green-500" />
                            <Typography variant="small" color="gray">
                              {item.shareCount || 0} اشتراک‌گذاری
                            </Typography>
                          </div>

                          {item.type && (
                            <Chip value={item.type} size="sm" color="blue" />
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Link to={`/dashboard/needs/${item._id}`}>
                          <Button size="sm" variant="outlined" color="blue">
                            مشاهده
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outlined"
                          color="green"
                          onClick={() => handleViewStats(item._id)}
                          className="flex items-center gap-1"
                        >
                          <ChartBarIcon className="w-4 h-4" />
                          آمار
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <ShareIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <Typography variant="h6" color="gray">
                  محتوای اشتراک‌گذاری شده‌ای یافت نشد
                </Typography>
              </div>
            )}
          </Card>
        </div>

        {/* Share Stats */}
        <div>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <LinkIcon className="w-6 h-6 text-green-500" />
              <Typography variant="h6" color="blue-gray">
                {selectedItemId ? "آمار اشتراک‌گذاری" : "آمار کلی"}
              </Typography>
            </div>

            {!selectedItemId ? (
              <div className="text-center py-6">
                <ChartBarIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <Typography variant="small" color="gray">
                  یک محتوا را انتخاب کنید تا آمار دقیق آن نمایش داده شود
                </Typography>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : shareStats ? (
              <div className="space-y-6">
                {/* Total Shares */}
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Typography variant="small" color="gray">
                    تعداد کل اشتراک‌گذاری
                  </Typography>
                  <Typography variant="h3" color="green">
                    {shareStats.totalShares || 0}
                  </Typography>
                </div>

                {/* Platform Breakdown */}
                {shareStats.platformBreakdown && shareStats.platformBreakdown.length > 0 && (
                  <div>
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                      توزیع پلتفرم‌ها
                    </Typography>
                    <div className="space-y-3">
                      {shareStats.platformBreakdown.map((platform) => (
                        <div key={platform._id}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Chip
                                value={getPlatformLabel(platform._id)}
                                color={getPlatformColor(platform._id)}
                                size="sm"
                              />
                            </div>
                            <Typography variant="small" color="gray">
                              {platform.count} ({calculatePlatformPercentage(platform._id, shareStats.totalShares)}%)
                            </Typography>
                          </div>
                          <Progress
                            value={calculatePlatformPercentage(platform._id, shareStats.totalShares)}
                            color={getPlatformColor(platform._id)}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Stats */}
                {shareStats.lastSharedAt && (
                  <div className="pt-4 border-t">
                    <Typography variant="small" color="gray" className="mb-1">
                      آخرین اشتراک‌گذاری:
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      {new Date(shareStats.lastSharedAt).toLocaleString("fa-IR")}
                    </Typography>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Typography variant="small" color="gray">
                  آماری یافت نشد
                </Typography>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shares;
