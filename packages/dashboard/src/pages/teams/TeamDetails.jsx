import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchTeamById, deleteTeam, removeMember } from "../../features/teamsSlice";
import {
  Card,
  Button,
  Typography,
  Chip,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const TeamDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teamId } = useParams();

  const { selectedTeam, loading } = useSelector((state) => state.teams);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    teamId: null,
    teamName: "",
  });

  // بارگذاری اطلاعات تیم
  useEffect(() => {
    if (teamId) {
      const loadTeam = async () => {
        try {
          // اگر تیم needId ندارد، از selectedTeam.need استفاده می‌کنیم
          const needId = selectedTeam?.need?._id || selectedTeam?.need;
          await dispatch(fetchTeamById({ needId, teamId })).unwrap();
        } catch (error) {
          console.error("خطا در بارگذاری تیم:", error);
        }
      };

      loadTeam();
    }
  }, [dispatch, teamId, selectedTeam?.need]);

  // حذف تیم
  const handleDelete = () => {
    setDeleteModal({
      isOpen: true,
      teamId: selectedTeam._id,
      teamName: selectedTeam.name,
    });
  };

  const confirmDelete = async () => {
    try {
      const needId = selectedTeam.need?._id || selectedTeam.need;
      await dispatch(deleteTeam({ needId, teamId: deleteModal.teamId })).unwrap();
      navigate("/dashboard/teams");
    } catch (error) {
      console.error("خطا در حذف تیم:", error);
    }
  };

  // حذف عضو از تیم
  const handleRemoveMember = async (userId) => {
    if (window.confirm("آیا از حذف این عضو اطمینان دارید؟")) {
      try {
        const needId = selectedTeam.need?._id || selectedTeam.need;
        await dispatch(removeMember({ needId, teamId, userId })).unwrap();
      } catch (error) {
        console.error("خطا در حذف عضو:", error);
      }
    }
  };

  // تبدیل status به فارسی
  const getStatusLabel = (status) => {
    const statusMap = {
      active: "فعال",
      paused: "متوقف شده",
      completed: "تکمیل شده",
      disbanded: "منحل شده",
    };
    return statusMap[status] || status;
  };

  // رنگ chip برای status
  const getStatusColor = (status) => {
    const colorMap = {
      active: "green",
      paused: "yellow",
      completed: "blue",
      disbanded: "red",
    };
    return colorMap[status] || "gray";
  };

  // تبدیل focusArea به فارسی
  const getFocusAreaLabel = (focusArea) => {
    const areaMap = {
      education: "آموزش",
      medical: "پزشکی و درمان",
      construction: "ساخت و ساز",
      financial: "مالی و تامین بودجه",
      social: "فعالیت‌های اجتماعی",
      coordination: "هماهنگی و مدیریت",
      awareness: "آگاهی‌رسانی",
      legal: "حقوقی",
      logistics: "لجستیک",
      other: "سایر",
    };
    return areaMap[focusArea] || focusArea;
  };

  // تبدیل role به فارسی
  const getRoleLabel = (role) => {
    const roleMap = {
      leader: "رهبر",
      co_leader: "معاون رهبر",
      member: "عضو",
    };
    return roleMap[role] || role;
  };

  // رنگ chip برای role
  const getRoleColor = (role) => {
    const colorMap = {
      leader: "purple",
      co_leader: "blue",
      member: "gray",
    };
    return colorMap[role] || "gray";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!selectedTeam) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <Typography variant="h5" color="red">
            تیم یافت نشد
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/teams">
                <Button variant="text" className="flex items-center gap-2">
                  <ArrowRightIcon className="w-5 h-5" />
                  بازگشت
                </Button>
              </Link>
              <Typography variant="h4" color="blue-gray">
                {selectedTeam.name}
              </Typography>
            </div>

            <div className="flex gap-2">
              <Link to={`/dashboard/teams/edit/${teamId}`}>
                <IconButton color="green">
                  <PencilIcon className="w-5 h-5" />
                </IconButton>
              </Link>
              <IconButton color="red" onClick={handleDelete}>
                <TrashIcon className="w-5 h-5" />
              </IconButton>
            </div>
          </div>

          {/* Status and Focus Area */}
          <div className="flex gap-2 mb-4">
            <Chip
              value={getStatusLabel(selectedTeam.status)}
              color={getStatusColor(selectedTeam.status)}
              size="sm"
            />
            {selectedTeam.focusArea && (
              <Chip
                value={getFocusAreaLabel(selectedTeam.focusArea)}
                color="blue"
                variant="outlined"
                size="sm"
              />
            )}
          </div>

          {/* Description */}
          {selectedTeam.description && (
            <Typography variant="paragraph" color="gray" className="mb-4">
              {selectedTeam.description}
            </Typography>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Typography variant="small" color="gray">
                تعداد اعضا
              </Typography>
              <Typography variant="h5" color="blue-gray">
                {selectedTeam.members?.length || 0} / {selectedTeam.maxMembers}
              </Typography>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <Typography variant="small" color="gray">
                وظایف تکمیل شده
              </Typography>
              <Typography variant="h5" color="blue-gray">
                {selectedTeam.tasksCompletedByTeam || 0}
              </Typography>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <Typography variant="small" color="gray">
                تاریخ ایجاد
              </Typography>
              <Typography variant="small" color="blue-gray">
                {new Date(selectedTeam.createdAt).toLocaleDateString("fa-IR")}
              </Typography>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <Typography variant="small" color="gray">
                آخرین بروزرسانی
              </Typography>
              <Typography variant="small" color="blue-gray">
                {new Date(selectedTeam.updatedAt).toLocaleDateString("fa-IR")}
              </Typography>
            </div>
          </div>

          {/* Tags */}
          {selectedTeam.tags && selectedTeam.tags.length > 0 && (
            <div className="mt-4">
              <Typography variant="small" color="gray" className="mb-2">
                برچسب‌ها:
              </Typography>
              <div className="flex flex-wrap gap-2">
                {selectedTeam.tags.map((tag, index) => (
                  <Chip key={index} value={tag} size="sm" variant="outlined" />
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Members */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
              <UsersIcon className="w-6 h-6" />
              اعضای تیم
            </Typography>
            <Button color="blue" className="flex items-center gap-2" size="sm">
              <UserPlusIcon className="w-4 h-4" />
              دعوت عضو جدید
            </Button>
          </div>

          {selectedTeam.members && selectedTeam.members.length > 0 ? (
            <div className="space-y-3">
              {selectedTeam.members.map((member) => (
                <div
                  key={member.user?._id || member.user}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={member.user?.profilePicture || "/assets/images/default-avatar.png"}
                      alt={member.user?.name || "کاربر"}
                      size="sm"
                    />
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {member.user?.name || "کاربر"}
                      </Typography>
                      <div className="flex gap-2 mt-1">
                        <Chip
                          value={getRoleLabel(member.role)}
                          color={getRoleColor(member.role)}
                          size="sm"
                        />
                        {member.joinedAt && (
                          <Typography variant="small" color="gray">
                            پیوست در: {new Date(member.joinedAt).toLocaleDateString("fa-IR")}
                          </Typography>
                        )}
                      </div>
                    </div>
                  </div>
                  {member.role !== "leader" && (
                    <IconButton
                      color="red"
                      size="sm"
                      variant="text"
                      onClick={() => handleRemoveMember(member.user?._id || member.user)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Typography variant="small" color="gray" className="text-center py-4">
              هنوز عضوی به تیم اضافه نشده است
            </Typography>
          )}
        </Card>

        {/* Related Need */}
        {selectedTeam.need && (
          <Card className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              نیاز مرتبط
            </Typography>
            <div className="bg-blue-50 p-4 rounded-lg">
              <Typography variant="h6" color="blue-gray">
                {selectedTeam.need.title || "بدون عنوان"}
              </Typography>
              {selectedTeam.need.description && (
                <Typography variant="small" color="gray" className="mt-2">
                  {selectedTeam.need.description.substring(0, 150)}...
                </Typography>
              )}
              <Link to={`/dashboard/needs/${selectedTeam.need._id || selectedTeam.need}`}>
                <Button color="blue" size="sm" className="mt-3">
                  مشاهده نیاز
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, teamId: null, teamName: "" })}
        onConfirm={confirmDelete}
        title="حذف تیم"
        message={`آیا از حذف تیم "${deleteModal.teamName}" اطمینان دارید؟`}
      />
    </div>
  );
};

export default TeamDetails;
