import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnhancedLeaderboard } from "../../features/gamificationSlice";
import { Card, Typography, Avatar, Chip } from "@material-tailwind/react";
import { TrophyIcon, FireIcon, StarIcon } from "@heroicons/react/24/outline";

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { leaderboard, loading } = useSelector((state) => state.gamification);

  const [timeframe, setTimeframe] = useState("allTime"); // allTime, monthly, weekly

  // بارگذاری جدول امتیازات
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        await dispatch(fetchEnhancedLeaderboard({ timeframe })).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری جدول امتیازات:", error);
      }
    };

    loadLeaderboard();
  }, [dispatch, timeframe]);

  // تعیین رنگ مدال بر اساس رتبه
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"; // طلایی
      case 2:
        return "text-gray-400"; // نقره‌ای
      case 3:
        return "text-orange-700"; // برنزی
      default:
        return "text-gray-300";
    }
  };

  // تعیین آیکون مدال بر اساس رتبه
  const getMedalIcon = (rank) => {
    if (rank <= 3) {
      return <TrophyIcon className={`w-8 h-8 ${getMedalColor(rank)}`} />;
    }
    return <span className="text-xl font-bold text-gray-500">#{rank}</span>;
  };

  return (
    <div className="p-6">
      {/* Header Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrophyIcon className="w-8 h-8 text-yellow-500" />
            <Typography variant="h4" color="blue-gray">
              جدول امتیازات
            </Typography>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe("weekly")}
              className={`px-4 py-2 rounded-lg ${
                timeframe === "weekly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              هفتگی
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-4 py-2 rounded-lg ${
                timeframe === "monthly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ماهانه
            </button>
            <button
              onClick={() => setTimeframe("allTime")}
              className={`px-4 py-2 rounded-lg ${
                timeframe === "allTime"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              همه زمان‌ها
            </button>
          </div>
        </div>

        <Typography variant="small" color="gray">
          برترین کاربران بر اساس امتیازات کسب شده
        </Typography>
      </Card>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {leaderboard && leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Second Place */}
              <Card className="p-6 text-center bg-gradient-to-b from-gray-50 to-white">
                <div className="flex justify-center mb-4">
                  <TrophyIcon className="w-16 h-16 text-gray-400" />
                </div>
                <Avatar
                  src={leaderboard[1]?.user?.profilePicture || "/assets/images/default-avatar.png"}
                  alt={leaderboard[1]?.user?.name || "کاربر"}
                  size="xl"
                  className="mx-auto mb-3 border-4 border-gray-300"
                />
                <Typography variant="h5" color="blue-gray">
                  {leaderboard[1]?.user?.name || "کاربر"}
                </Typography>
                <Typography variant="small" color="gray" className="mb-2">
                  رتبه ۲
                </Typography>
                <Chip value={`${leaderboard[1]?.totalPoints || 0} امتیاز`} color="gray" />
              </Card>

              {/* First Place */}
              <Card className="p-6 text-center bg-gradient-to-b from-yellow-50 to-white transform scale-105">
                <div className="flex justify-center mb-4">
                  <TrophyIcon className="w-20 h-20 text-yellow-500" />
                </div>
                <Avatar
                  src={leaderboard[0]?.user?.profilePicture || "/assets/images/default-avatar.png"}
                  alt={leaderboard[0]?.user?.name || "کاربر"}
                  size="xxl"
                  className="mx-auto mb-3 border-4 border-yellow-500"
                />
                <Typography variant="h4" color="blue-gray">
                  {leaderboard[0]?.user?.name || "کاربر"}
                </Typography>
                <Typography variant="small" color="gray" className="mb-2">
                  رتبه ۱
                </Typography>
                <Chip value={`${leaderboard[0]?.totalPoints || 0} امتیاز`} color="yellow" />
              </Card>

              {/* Third Place */}
              <Card className="p-6 text-center bg-gradient-to-b from-orange-50 to-white">
                <div className="flex justify-center mb-4">
                  <TrophyIcon className="w-16 h-16 text-orange-700" />
                </div>
                <Avatar
                  src={leaderboard[2]?.user?.profilePicture || "/assets/images/default-avatar.png"}
                  alt={leaderboard[2]?.user?.name || "کاربر"}
                  size="xl"
                  className="mx-auto mb-3 border-4 border-orange-700"
                />
                <Typography variant="h5" color="blue-gray">
                  {leaderboard[2]?.user?.name || "کاربر"}
                </Typography>
                <Typography variant="small" color="gray" className="mb-2">
                  رتبه ۳
                </Typography>
                <Chip value={`${leaderboard[2]?.totalPoints || 0} امتیاز`} color="orange" />
              </Card>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <Card className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              جدول کامل
            </Typography>

            {leaderboard && Array.isArray(leaderboard) && leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.user?._id || index}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index < 3 ? "bg-blue-50" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Rank */}
                      <div className="w-12 flex justify-center">
                        {getMedalIcon(index + 1)}
                      </div>

                      {/* User Info */}
                      <Avatar
                        src={entry.user?.profilePicture || "/assets/images/default-avatar.png"}
                        alt={entry.user?.name || "کاربر"}
                        size="md"
                      />
                      <div className="flex-1">
                        <Typography variant="h6" color="blue-gray">
                          {entry.user?.name || "کاربر"}
                        </Typography>
                        <Typography variant="small" color="gray">
                          @{entry.user?.username || "username"}
                        </Typography>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-center">
                      <div>
                        <Typography variant="small" color="gray">
                          امتیاز کل
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 text-yellow-500" />
                          {entry.totalPoints || 0}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="small" color="gray">
                          سطح
                        </Typography>
                        <Typography variant="h6" color="blue-gray">
                          {entry.level || 1}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="small" color="gray">
                          نشان‌ها
                        </Typography>
                        <Typography variant="h6" color="blue-gray">
                          {entry.badges?.length || 0}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <TrophyIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <Typography variant="h6" color="gray">
                  هنوز کاربری در جدول امتیازات نیست
                </Typography>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
