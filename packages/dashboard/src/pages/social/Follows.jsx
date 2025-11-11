import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getUserFollowers,
  getUserFollowing,
  getMyFollowedNeeds,
  getUserFollowStats,
  unfollowUser,
  unfollowNeed,
  getSuggestedUsers,
} from "../../features/socialSlice";
import {
  Card,
  Button,
  Typography,
  Avatar,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Chip,
} from "@material-tailwind/react";
import {
  UsersIcon,
  UserMinusIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const Follows = () => {
  const dispatch = useDispatch();
  const {
    followers,
    following,
    followedNeeds,
    followStats,
    suggestedUsers,
    loading,
  } = useSelector((state) => state.social);

  const [activeTab, setActiveTab] = useState("followers");

  // بارگذاری داده‌ها
  useEffect(() => {
    const loadData = async () => {
      try {
        // فرض می‌کنیم userId از localStorage یا context می‌آید
        const userId = localStorage.getItem("userId") || "me";
        await Promise.all([
          dispatch(getUserFollowers(userId)).unwrap(),
          dispatch(getUserFollowing(userId)).unwrap(),
          dispatch(getMyFollowedNeeds()).unwrap(),
          dispatch(getUserFollowStats(userId)).unwrap(),
          dispatch(getSuggestedUsers()).unwrap(),
        ]);
      } catch (error) {
        console.error("خطا در بارگذاری داده‌ها:", error);
      }
    };

    loadData();
  }, [dispatch]);

  // لغو دنبال کردن کاربر
  const handleUnfollowUser = async (userId) => {
    try {
      await dispatch(unfollowUser(userId)).unwrap();
      const currentUserId = localStorage.getItem("userId") || "me";
      dispatch(getUserFollowing(currentUserId));
    } catch (error) {
      console.error("خطا در لغو دنبال کردن کاربر:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // لغو دنبال کردن نیاز
  const handleUnfollowNeed = async (needId) => {
    try {
      await dispatch(unfollowNeed(needId)).unwrap();
      dispatch(getMyFollowedNeeds());
    } catch (error) {
      console.error("خطا در لغو دنبال کردن نیاز:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  return (
    <div className="p-6">
      {/* Stats Card */}
      {followStats && (
        <Card className="p-6 mb-6">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            آمار دنبال‌کنندگان
          </Typography>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                دنبال‌کنندگان
              </Typography>
              <Typography variant="h4" color="blue">
                {followStats.followersCount || 0}
              </Typography>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                دنبال شونده‌ها
              </Typography>
              <Typography variant="h4" color="green">
                {followStats.followingCount || 0}
              </Typography>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                نیازهای دنبال شده
              </Typography>
              <Typography variant="h4" color="purple">
                {followedNeeds?.length || 0}
              </Typography>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                میانگین تعامل
              </Typography>
              <Typography variant="h4" color="red">
                {followStats.engagementRate || "0"}%
              </Typography>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs Card */}
      <Card className="p-6">
        <Tabs value={activeTab}>
          <TabsHeader>
            <Tab value="followers" onClick={() => setActiveTab("followers")}>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                دنبال‌کنندگان ({followers?.length || 0})
              </div>
            </Tab>
            <Tab value="following" onClick={() => setActiveTab("following")}>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                دنبال شونده‌ها ({following?.length || 0})
              </div>
            </Tab>
            <Tab value="needs" onClick={() => setActiveTab("needs")}>
              <div className="flex items-center gap-2">
                <HeartIcon className="w-5 h-5" />
                نیازهای دنبال شده ({followedNeeds?.length || 0})
              </div>
            </Tab>
            <Tab value="suggestions" onClick={() => setActiveTab("suggestions")}>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                پیشنهادات ({suggestedUsers?.length || 0})
              </div>
            </Tab>
          </TabsHeader>

          <TabsBody>
            {/* Followers Tab */}
            <TabPanel value="followers">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : followers && followers.length > 0 ? (
                <div className="space-y-3">
                  {followers.map((follower) => (
                    <div
                      key={follower._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={follower.follower?.profilePicture || "/default-avatar.png"}
                          alt={follower.follower?.name || "کاربر"}
                          size="md"
                        />
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {follower.follower?.name || "کاربر"}
                          </Typography>
                          <Typography variant="small" color="gray">
                            @{follower.follower?.username || "username"}
                          </Typography>
                        </div>
                      </div>
                      <Typography variant="small" color="gray">
                        {new Date(follower.createdAt).toLocaleDateString("fa-IR")}
                      </Typography>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <UsersIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <Typography variant="h6" color="gray">
                    هنوز کسی شما را دنبال نکرده است
                  </Typography>
                </div>
              )}
            </TabPanel>

            {/* Following Tab */}
            <TabPanel value="following">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : following && following.length > 0 ? (
                <div className="space-y-3">
                  {following.map((follow) => (
                    <div
                      key={follow._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={follow.following?.profilePicture || "/default-avatar.png"}
                          alt={follow.following?.name || "کاربر"}
                          size="md"
                        />
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {follow.following?.name || "کاربر"}
                          </Typography>
                          <Typography variant="small" color="gray">
                            @{follow.following?.username || "username"}
                          </Typography>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        color="red"
                        variant="outlined"
                        className="flex items-center gap-2"
                        onClick={() => handleUnfollowUser(follow.following?._id)}
                      >
                        <UserMinusIcon className="w-4 h-4" />
                        لغو دنبال کردن
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <UsersIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <Typography variant="h6" color="gray">
                    هنوز کسی را دنبال نکرده‌اید
                  </Typography>
                </div>
              )}
            </TabPanel>

            {/* Followed Needs Tab */}
            <TabPanel value="needs">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : followedNeeds && followedNeeds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {followedNeeds.map((follow) => (
                    <Card key={follow._id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Typography variant="h6" color="blue-gray">
                          {follow.followedNeed?.title || "نیاز"}
                        </Typography>
                        <Chip
                          value={follow.followedNeed?.status || "active"}
                          color="green"
                          size="sm"
                        />
                      </div>
                      <Typography variant="small" color="gray" className="mb-4">
                        {follow.followedNeed?.description?.substring(0, 100)}...
                      </Typography>
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/needs/${follow.followedNeed?._id}`}
                          className="flex-1"
                        >
                          <Button size="sm" color="blue" variant="outlined" className="w-full">
                            مشاهده
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          color="red"
                          variant="outlined"
                          onClick={() => handleUnfollowNeed(follow.followedNeed?._id)}
                        >
                          لغو دنبال کردن
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <HeartIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <Typography variant="h6" color="gray">
                    هنوز نیازی را دنبال نکرده‌اید
                  </Typography>
                </div>
              )}
            </TabPanel>

            {/* Suggestions Tab */}
            <TabPanel value="suggestions">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : suggestedUsers && suggestedUsers.length > 0 ? (
                <div className="space-y-3">
                  {suggestedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.profilePicture || "/default-avatar.png"}
                          alt={user.name || "کاربر"}
                          size="md"
                        />
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {user.name || "کاربر"}
                          </Typography>
                          <Typography variant="small" color="gray">
                            @{user.username || "username"}
                          </Typography>
                          {user.bio && (
                            <Typography variant="small" color="gray" className="mt-1">
                              {user.bio.substring(0, 60)}...
                            </Typography>
                          )}
                        </div>
                      </div>
                      <Link to={`/dashboard/users/${user._id}`}>
                        <Button size="sm" color="blue" variant="outlined">
                          مشاهده پروفایل
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <UsersIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <Typography variant="h6" color="gray">
                    پیشنهادی وجود ندارد
                  </Typography>
                </div>
              )}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>
    </div>
  );
};

export default Follows;
