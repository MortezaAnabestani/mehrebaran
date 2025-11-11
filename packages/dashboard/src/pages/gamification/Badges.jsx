import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBadges, deleteBadge } from "../../features/gamificationSlice";
import { Card, Button, Typography, Chip, IconButton, Switch } from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon, TrophyIcon } from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const Badges = () => {
  const dispatch = useDispatch();
  const { badges, loading } = useSelector((state) => state.gamification);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    badgeId: null,
    badgeName: "",
  });

  // بارگذاری نشان‌ها
  useEffect(() => {
    const loadBadges = async () => {
      try {
        await dispatch(fetchBadges()).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری نشان‌ها:", error);
      }
    };

    loadBadges();
  }, [dispatch]);

  // حذف نشان
  const handleDelete = (id, name) => {
    setDeleteModal({
      isOpen: true,
      badgeId: id,
      badgeName: name,
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteBadge(deleteModal.badgeId)).unwrap();
      setDeleteModal({ isOpen: false, badgeId: null, badgeName: "" });
    } catch (error) {
      console.error("خطا در حذف نشان:", error);
    }
  };

  // تبدیل category به فارسی
  const getCategoryLabel = (category) => {
    const categoryMap = {
      contributor: "مشارکت‌کننده",
      supporter: "حمایت‌کننده",
      creator: "سازنده",
      helper: "کمک‌کننده",
      communicator: "ارتباط‌گیر",
      leader: "رهبر",
      expert: "متخصص",
      milestone: "نقطه عطف",
      special: "ویژه",
      seasonal: "فصلی",
    };
    return categoryMap[category] || category;
  };

  // تبدیل rarity به فارسی
  const getRarityLabel = (rarity) => {
    const rarityMap = {
      common: "معمولی",
      rare: "نادر",
      epic: "حماسی",
      legendary: "افسانه‌ای",
    };
    return rarityMap[rarity] || rarity;
  };

  // رنگ chip برای rarity
  const getRarityColor = (rarity) => {
    const colorMap = {
      common: "gray",
      rare: "blue",
      epic: "purple",
      legendary: "orange",
    };
    return colorMap[rarity] || "gray";
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" color="blue-gray">
            مدیریت نشان‌ها
          </Typography>
          <Link to="/dashboard/gamification/badges/create">
            <Button color="blue" className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              ایجاد نشان جدید
            </Button>
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {badges && Array.isArray(badges) && badges.length > 0 ? (
                badges.map((badge) => (
                  <Card
                    key={badge._id}
                    className="p-4 hover:shadow-lg transition-shadow"
                    style={{ borderTop: `4px solid ${badge.color || "#3B82F6"}` }}
                  >
                    {/* Badge Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: badge.color || "#3B82F6" }}
                        >
                          {badge.icon || "🏆"}
                        </div>
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {badge.name}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {badge.nameEn}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Badge Description */}
                    <Typography variant="small" color="gray" className="mb-3">
                      {badge.description.substring(0, 80)}
                      {badge.description.length > 80 ? "..." : ""}
                    </Typography>

                    {/* Badge Info */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Chip
                        value={getRarityLabel(badge.rarity)}
                        color={getRarityColor(badge.rarity)}
                        size="sm"
                      />
                      <Chip
                        value={getCategoryLabel(badge.category)}
                        color="blue"
                        variant="outlined"
                        size="sm"
                      />
                      {badge.isSecret && (
                        <Chip value="مخفی" color="red" size="sm" />
                      )}
                    </div>

                    {/* Badge Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div className="bg-blue-50 p-2 rounded">
                        <Typography variant="small" color="gray">
                          امتیاز
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {badge.points}
                        </Typography>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <Typography variant="small" color="gray">
                          ترتیب
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {badge.order}
                        </Typography>
                      </div>
                    </div>

                    {/* Badge Active Status */}
                    <div className="flex items-center justify-between mb-3">
                      <Typography variant="small" color="gray">
                        وضعیت:
                      </Typography>
                      <Chip
                        value={badge.isActive ? "فعال" : "غیرفعال"}
                        color={badge.isActive ? "green" : "red"}
                        size="sm"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t pt-3">
                      <Link to={`/dashboard/gamification/badges/edit/${badge._id}`} className="flex-1">
                        <Button color="green" size="sm" className="w-full flex items-center justify-center gap-2">
                          <PencilIcon className="w-4 h-4" />
                          ویرایش
                        </Button>
                      </Link>
                      <IconButton
                        color="red"
                        size="sm"
                        onClick={() => handleDelete(badge._id, badge.name)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <TrophyIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <Typography variant="h6" color="gray">
                    هنوز نشانی ایجاد نشده است
                  </Typography>
                  <Typography variant="small" color="gray" className="mb-4">
                    با ایجاد نشان‌های جدید، کاربران را تشویق به فعالیت بیشتر کنید
                  </Typography>
                  <Link to="/dashboard/gamification/badges/create">
                    <Button color="blue" className="flex items-center gap-2 mx-auto">
                      <PlusIcon className="w-5 h-5" />
                      ایجاد اولین نشان
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, badgeId: null, badgeName: "" })}
        onConfirm={confirmDelete}
        title="حذف نشان"
        message={`آیا از حذف نشان "${deleteModal.badgeName}" اطمینان دارید؟`}
      />
    </div>
  );
};

export default Badges;
