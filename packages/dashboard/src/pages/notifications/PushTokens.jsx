import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { registerPushToken, removePushToken } from "../../features/notificationsSlice";
import {
  Card,
  Button,
  Typography,
  Input,
  Select,
  Option,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import {
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const PushTokens = () => {
  const dispatch = useDispatch();

  // فرض می‌کنیم توکن‌ها از API دریافت می‌شوند
  // در اینجا یک لیست ساختگی قرار می‌دهیم
  const [tokens, setTokens] = useState([
    {
      _id: "1",
      platform: "ios",
      deviceId: "iPhone 13 Pro",
      isActive: true,
      lastUsedAt: new Date(),
      createdAt: new Date(),
    },
    {
      _id: "2",
      platform: "android",
      deviceId: "Samsung Galaxy S21",
      isActive: true,
      lastUsedAt: new Date(),
      createdAt: new Date(),
    },
    {
      _id: "3",
      platform: "web",
      deviceId: "Chrome Browser",
      isActive: false,
      lastUsedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newToken, setNewToken] = useState({
    token: "",
    platform: "web",
    deviceId: "",
  });

  // حذف توکن
  const handleRemove = async (token) => {
    if (!window.confirm("آیا از حذف این دستگاه اطمینان دارید؟")) return;

    try {
      await dispatch(removePushToken(token._id)).unwrap();
      setTokens(tokens.filter((t) => t._id !== token._id));
      console.log("دستگاه با موفقیت حذف شد");
    } catch (error) {
      console.error("خطا در حذف دستگاه:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // افزودن توکن جدید
  const handleAdd = async () => {
    if (!newToken.token.trim()) {
      alert("لطفاً توکن را وارد کنید");
      return;
    }

    try {
      const result = await dispatch(registerPushToken(newToken)).unwrap();
      setTokens([...tokens, result.data || result]);
      setNewToken({ token: "", platform: "web", deviceId: "" });
      setShowAddForm(false);
      console.log("دستگاه با موفقیت اضافه شد");
    } catch (error) {
      console.error("خطا در افزودن دستگاه:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // آیکون پلتفرم
  const getPlatformIcon = (platform) => {
    const icons = {
      ios: DevicePhoneMobileIcon,
      android: DevicePhoneMobileIcon,
      web: ComputerDesktopIcon,
    };
    const Icon = icons[platform] || ComputerDesktopIcon;
    return <Icon className="w-6 h-6" />;
  };

  // رنگ پلتفرم
  const getPlatformColor = (platform) => {
    const colors = {
      ios: "gray",
      android: "green",
      web: "blue",
    };
    return colors[platform] || "gray";
  };

  // نام پلتفرم
  const getPlatformLabel = (platform) => {
    const labels = {
      ios: "iOS",
      android: "Android",
      web: "Web",
    };
    return labels[platform] || platform;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/notifications/settings">
              <Button variant="text" className="flex items-center gap-2">
                <ArrowRightIcon className="w-5 h-5" />
                بازگشت
              </Button>
            </Link>
            <div>
              <Typography variant="h4" color="blue-gray">
                مدیریت دستگاه‌ها
              </Typography>
              <Typography variant="small" color="gray" className="mt-1">
                دستگاه‌هایی که می‌توانند اعلان دریافت کنند
              </Typography>
            </div>
          </div>

          {!showAddForm && (
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <PlusIcon className="w-5 h-5" />
              افزودن دستگاه
            </Button>
          )}
        </div>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-6 mb-6">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            افزودن دستگاه جدید
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                label="توکن Push Notification"
                value={newToken.token}
                onChange={(e) => setNewToken({ ...newToken, token: e.target.value })}
              />
            </div>

            <Select
              label="پلتفرم"
              value={newToken.platform}
              onChange={(value) => setNewToken({ ...newToken, platform: value })}
            >
              <Option value="web">Web</Option>
              <Option value="ios">iOS</Option>
              <Option value="android">Android</Option>
            </Select>
          </div>

          <div className="mb-4">
            <Input
              label="نام دستگاه (اختیاری)"
              value={newToken.deviceId}
              onChange={(e) => setNewToken({ ...newToken, deviceId: e.target.value })}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outlined"
              color="gray"
              onClick={() => {
                setShowAddForm(false);
                setNewToken({ token: "", platform: "web", deviceId: "" });
              }}
            >
              انصراف
            </Button>
            <Button color="blue" onClick={handleAdd}>
              افزودن
            </Button>
          </div>
        </Card>
      )}

      {/* Tokens List */}
      <Card className="p-6">
        <Typography variant="h5" color="blue-gray" className="mb-6">
          دستگاه‌های ثبت شده ({tokens.length})
        </Typography>

        {tokens && tokens.length > 0 ? (
          <div className="space-y-3">
            {tokens.map((token) => (
              <div
                key={token._id}
                className={`p-4 rounded-lg border ${
                  token.isActive
                    ? "bg-white border-gray-200"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      token.isActive ? "bg-blue-50" : "bg-gray-200"
                    }`}
                  >
                    {getPlatformIcon(token.platform)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Typography variant="h6" color="blue-gray">
                        {token.deviceId || "دستگاه بدون نام"}
                      </Typography>
                      <Chip
                        value={getPlatformLabel(token.platform)}
                        color={getPlatformColor(token.platform)}
                        size="sm"
                      />
                      {!token.isActive && (
                        <Chip value="غیرفعال" color="gray" size="sm" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <Typography variant="small" color="gray">
                        ثبت شده در:{" "}
                        {new Date(token.createdAt).toLocaleDateString("fa-IR")}
                      </Typography>
                      <Typography variant="small" color="gray">
                        آخرین استفاده:{" "}
                        {new Date(token.lastUsedAt).toLocaleDateString("fa-IR")}
                      </Typography>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <IconButton
                      size="sm"
                      color="red"
                      variant="text"
                      onClick={() => handleRemove(token)}
                      title="حذف دستگاه"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <DevicePhoneMobileIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <Typography variant="h6" color="gray">
              هنوز دستگاهی ثبت نشده است
            </Typography>
            <Typography variant="small" color="gray" className="mt-2">
              برای دریافت اعلانات push، ابتدا باید یک دستگاه ثبت کنید
            </Typography>
            <Button
              color="blue"
              className="flex items-center gap-2 mx-auto mt-4"
              onClick={() => setShowAddForm(true)}
            >
              <PlusIcon className="w-5 h-5" />
              افزودن اولین دستگاه
            </Button>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-6 mt-6 bg-blue-50">
        <Typography variant="h6" color="blue-gray" className="mb-2">
          نکته:
        </Typography>
        <Typography variant="small" color="gray">
          برای دریافت Push Notification در مرورگر، ابتدا باید مجوز نمایش اعلانات را
          به سایت بدهید. دستگاه‌های غیرفعال به صورت خودکار پس از ۹۰ روز عدم استفاده
          حذف می‌شوند.
        </Typography>
      </Card>
    </div>
  );
};

export default PushTokens;
