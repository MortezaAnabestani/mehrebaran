import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getPopularTags,
  getTrendingTags,
  searchTags,
  getNeedsByTag,
} from "../../features/socialSlice";
import {
  Card,
  Button,
  Typography,
  Input,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import {
  HashtagIcon,
  MagnifyingGlassIcon,
  FireIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const SocialTags = () => {
  const dispatch = useDispatch();
  const { popularTags, trendingTags, tagResults, needsByTag, loading } = useSelector(
    (state) => state.social
  );

  const [activeTab, setActiveTab] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  // بارگذاری تگ‌های محبوب و ترند
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(getPopularTags({ limit: 50 })).unwrap(),
          dispatch(getTrendingTags({ limit: 50 })).unwrap(),
        ]);
      } catch (error) {
        console.error("خطا در بارگذاری تگ‌ها:", error);
      }
    };

    loadData();
  }, [dispatch]);

  // جستجوی تگ‌ها
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      await dispatch(searchTags(searchQuery)).unwrap();
      setActiveTab("search");
    } catch (error) {
      console.error("خطا در جستجوی تگ‌ها:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // نمایش نیازهای مرتبط با تگ
  const handleTagClick = async (tag) => {
    setSelectedTag(tag);
    try {
      await dispatch(getNeedsByTag(tag)).unwrap();
    } catch (error) {
      console.error("خطا در دریافت نیازها:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // رندر لیست تگ‌ها
  const renderTagsList = (tags, showCount = true) => {
    if (!tags || tags.length === 0) {
      return (
        <div className="text-center py-10">
          <HashtagIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <Typography variant="h6" color="gray">
            تگی یافت نشد
          </Typography>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <button
            key={tag._id || index}
            onClick={() => handleTagClick(tag.name || tag._id || tag)}
            className="group"
          >
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                selectedTag === (tag.name || tag._id || tag)
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <HashtagIcon className="w-5 h-5" />
              <Typography variant="small" className="font-bold">
                {tag.name || tag._id || tag}
              </Typography>
              {showCount && tag.count && (
                <Chip
                  value={tag.count}
                  size="sm"
                  className={`${
                    selectedTag === (tag.name || tag._id || tag)
                      ? "bg-blue-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Search Card */}
      <Card className="p-6 mb-6">
        <Typography variant="h5" color="blue-gray" className="mb-4">
          جستجوی تگ‌ها
        </Typography>
        <div className="flex gap-2">
          <Input
            label="جستجوی تگ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            icon={<HashtagIcon />}
          />
          <Button
            color="blue"
            className="flex items-center gap-2"
            onClick={handleSearch}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            جستجو
          </Button>
        </div>
      </Card>

      {/* Tags Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tags List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Tabs value={activeTab}>
              <TabsHeader>
                <Tab value="popular" onClick={() => setActiveTab("popular")}>
                  <div className="flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5" />
                    محبوب‌ترین
                  </div>
                </Tab>
                <Tab value="trending" onClick={() => setActiveTab("trending")}>
                  <div className="flex items-center gap-2">
                    <FireIcon className="w-5 h-5" />
                    در حال ترند
                  </div>
                </Tab>
                {tagResults && tagResults.length > 0 && (
                  <Tab value="search" onClick={() => setActiveTab("search")}>
                    <div className="flex items-center gap-2">
                      <MagnifyingGlassIcon className="w-5 h-5" />
                      نتایج جستجو
                    </div>
                  </Tab>
                )}
              </TabsHeader>

              <TabsBody>
                <TabPanel value="popular">
                  {loading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    renderTagsList(popularTags, true)
                  )}
                </TabPanel>

                <TabPanel value="trending">
                  {loading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    renderTagsList(trendingTags, true)
                  )}
                </TabPanel>

                {tagResults && tagResults.length > 0 && (
                  <TabPanel value="search">
                    {renderTagsList(tagResults, false)}
                  </TabPanel>
                )}
              </TabsBody>
            </Tabs>
          </Card>
        </div>

        {/* Needs by Tag */}
        <div>
          <Card className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              {selectedTag ? (
                <>
                  نیازهای مرتبط با{" "}
                  <span className="text-blue-500">#{selectedTag}</span>
                </>
              ) : (
                "نیازهای مرتبط"
              )}
            </Typography>

            {!selectedTag ? (
              <div className="text-center py-6">
                <HashtagIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <Typography variant="small" color="gray">
                  یک تگ را انتخاب کنید تا نیازهای مرتبط نمایش داده شوند
                </Typography>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : needsByTag && needsByTag.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {needsByTag.map((need) => (
                  <div
                    key={need._id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Typography variant="small" color="blue-gray" className="font-bold mb-1">
                      {need.title}
                    </Typography>
                    <Typography variant="small" color="gray" className="mb-2 line-clamp-2">
                      {need.description}
                    </Typography>
                    <div className="flex items-center justify-between">
                      <Chip
                        value={need.status}
                        color={
                          need.status === "completed"
                            ? "green"
                            : need.status === "in_progress"
                            ? "orange"
                            : "gray"
                        }
                        size="sm"
                      />
                      <Link to={`/dashboard/needs/${need._id}`}>
                        <Button size="sm" variant="text" color="blue">
                          مشاهده
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Typography variant="small" color="gray">
                  نیازی با این تگ یافت نشد
                </Typography>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialTags;
