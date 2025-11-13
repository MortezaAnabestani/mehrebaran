import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getPreferences,
  updatePreferences,
  toggleChannel,
  muteType,
  toggleGlobalMute,
} from "../../features/notificationsSlice";
import {
  Card,
  Button,
  Typography,
  Switch,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const { preferences, loading } = useSelector((state) => state.notifications);

  const [localPrefs, setLocalPrefs] = useState(null);
  const [saving, setSaving] = useState(false);

  // بارگذاری تنظیمات
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        await dispatch(getPreferences()).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری تنظیمات:", error);
      }
    };

    loadPrefs();
  }, [dispatch]);

  // همگام‌سازی تنظیمات local
  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  // تغییر وضعیت کانال
  const handleToggleChannel = async (channel) => {
    try {
      const newEnabled = !localPrefs[channel]?.enabled;
      await dispatch(toggleChannel({ channel, enabled: newEnabled })).unwrap();
    } catch (error) {
      console.error("خطا در تغییر وضعیت کانال:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // تغییر وضعیت سکوت کلی
  const handleToggleGlobalMute = async () => {
    try {
      const newEnabled = !localPrefs.globalMute;
      await dispatch(toggleGlobalMute(newEnabled)).unwrap();
    } catch (error) {
      console.error("خطا در تغییر وضعیت سکوت کلی:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // ذخیره تنظیمات
  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(updatePreferences(localPrefs)).unwrap();
      console.log("تنظیمات با موفقیت ذخیره شد");
    } catch (error) {
      console.error("خطا در ذخیره تنظیمات:", error);
      alert(error || "خطایی رخ داده است");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !localPrefs) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/notifications">
            <Button variant="text" className="flex items-center gap-2">
              <ArrowRightIcon className="w-5 h-5" />
              بازگشت
            </Button>
          </Link>
          <Typography variant="h4" color="blue-gray">
            تنظیمات اعلانات
          </Typography>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Global Settings */}
        <Card className="p-6 lg:col-span-2">
          <Typography variant="h5" color="blue-gray" className="mb-6">
            تنظیمات کلی
          </Typography>

          {/* Global Mute */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div>
              <Typography variant="h6" color="blue-gray">
                سکوت کلی
              </Typography>
              <Typography variant="small" color="gray">
                غیرفعال کردن تمام اعلانات
              </Typography>
            </div>
            <Switch
              checked={localPrefs.globalMute || false}
              onChange={handleToggleGlobalMute}
              color="blue"
            />
          </div>

          {/* Quiet Hours */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  ساعات سکوت
                </Typography>
                <Typography variant="small" color="gray">
                  عدم ارسال اعلان در بازه زمانی خاص
                </Typography>
              </div>
              <Switch
                checked={localPrefs.quietHoursEnabled || false}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    quietHoursEnabled: e.target.checked,
                  })
                }
                color="blue"
              />
            </div>

            {localPrefs.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  label="شروع"
                  value={localPrefs.quietHoursStart || ""}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      quietHoursStart: e.target.value,
                    })
                  }
                />
                <Input
                  type="time"
                  label="پایان"
                  value={localPrefs.quietHoursEnd || ""}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      quietHoursEnd: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>

          {/* Group Similar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div>
              <Typography variant="h6" color="blue-gray">
                گروه‌بندی اعلانات مشابه
              </Typography>
              <Typography variant="small" color="gray">
                ترکیب اعلانات مشابه در یک گروه
              </Typography>
            </div>
            <Switch
              checked={localPrefs.groupSimilar !== false}
              onChange={(e) =>
                setLocalPrefs({
                  ...localPrefs,
                  groupSimilar: e.target.checked,
                })
              }
              color="blue"
            />
          </div>

          {/* Email Digest */}
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  خلاصه ایمیل
                </Typography>
                <Typography variant="small" color="gray">
                  دریافت خلاصه اعلانات به صورت ایمیل
                </Typography>
              </div>
              <Switch
                checked={localPrefs.emailDigest?.enabled || false}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    emailDigest: {
                      ...localPrefs.emailDigest,
                      enabled: e.target.checked,
                    },
                  })
                }
                color="blue"
              />
            </div>

            {localPrefs.emailDigest?.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="دوره ارسال"
                  value={localPrefs.emailDigest?.frequency || "never"}
                  onChange={(value) =>
                    setLocalPrefs({
                      ...localPrefs,
                      emailDigest: {
                        ...localPrefs.emailDigest,
                        frequency: value,
                      },
                    })
                  }
                >
                  <Option value="daily">روزانه</Option>
                  <Option value="weekly">هفتگی</Option>
                  <Option value="never">هرگز</Option>
                </Select>

                <Input
                  type="time"
                  label="زمان ارسال"
                  value={localPrefs.emailDigest?.time || ""}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      emailDigest: {
                        ...localPrefs.emailDigest,
                        time: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
          </div>

          {/* Save Button */}
          <Button
            color="blue"
            onClick={handleSave}
            loading={saving}
            className="w-full"
          >
            ذخیره تنظیمات
          </Button>
        </Card>

        {/* Channel Settings */}
        <Card className="p-6">
          <Typography variant="h5" color="blue-gray" className="mb-6">
            کانال‌های اعلان
          </Typography>

          <div className="space-y-4">
            {/* In-App */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h6" color="blue-gray">
                  درون برنامه
                </Typography>
                <Switch
                  checked={localPrefs.in_app?.enabled !== false}
                  onChange={() => handleToggleChannel("in_app")}
                  color="blue"
                />
              </div>
              <Typography variant="small" color="gray">
                نمایش اعلانات در برنامه
              </Typography>
            </div>

            {/* Email */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h6" color="blue-gray">
                  ایمیل
                </Typography>
                <Switch
                  checked={localPrefs.email?.enabled !== false}
                  onChange={() => handleToggleChannel("email")}
                  color="blue"
                />
              </div>
              <Typography variant="small" color="gray">
                ارسال اعلانات به ایمیل
              </Typography>
            </div>

            {/* Push */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h6" color="blue-gray">
                  Push Notification
                </Typography>
                <Switch
                  checked={localPrefs.push?.enabled !== false}
                  onChange={() => handleToggleChannel("push")}
                  color="blue"
                />
              </div>
              <Typography variant="small" color="gray">
                ارسال پوش نوتیفیکیشن
              </Typography>
            </div>

            {/* SMS */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h6" color="blue-gray">
                  پیامک (SMS)
                </Typography>
                <Switch
                  checked={localPrefs.sms?.enabled || false}
                  onChange={() => handleToggleChannel("sms")}
                  color="blue"
                />
              </div>
              <Typography variant="small" color="gray">
                ارسال اعلانات از طریق پیامک
              </Typography>
            </div>
          </div>

          {/* Push Tokens Link */}
          <div className="mt-6 pt-6 border-t">
            <Link to="/dashboard/notifications/push-tokens">
              <Button variant="outlined" color="blue" className="w-full">
                مدیریت دستگاه‌ها
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;
