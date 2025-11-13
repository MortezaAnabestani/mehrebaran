import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyTeams, deleteTeam } from "../../features/teamsSlice";
import { Card, Button, Typography, Chip, IconButton } from "@material-tailwind/react";
import { EyeIcon, PencilIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const Teams = () => {
  const dispatch = useDispatch();
  const { myTeams, loading } = useSelector((state) => state.teams);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    teamId: null,
    needId: null,
    teamName: "",
  });

  useEffect(() => {
    dispatch(fetchMyTeams());
  }, [dispatch]);

  const handleDelete = (needId, teamId, teamName) => {
    setDeleteModal({
      isOpen: true,
      teamId,
      needId,
      teamName,
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(
        deleteTeam({ needId: deleteModal.needId, teamId: deleteModal.teamId })
      ).unwrap();
      setDeleteModal({ isOpen: false, teamId: null, needId: null, teamName: "" });
    } catch (error) {
      console.error("خطا در حذف تیم:", error);
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
      disbanded: "gray",
    };
    return colorMap[status] || "gray";
  };

  // تبدیل focusArea به فارسی
  const getFocusAreaLabel = (focusArea) => {
    const focusMap = {
      fundraising: "جمع‌آوری کمک مالی",
      logistics: "لجستیک",
      communication: "ارتباطات",
      technical: "فنی",
      volunteer: "داوطلبی",
      coordination: "هماهنگی",
      documentation: "مستندسازی",
      general: "عمومی",
    };
    return focusMap[focusArea] || focusArea;
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" color="blue-gray">
            تیم‌های من
          </Typography>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTeams && Array.isArray(myTeams) && myTeams.length > 0 ? (
                myTeams.map((team) => (
                  <Card key={team._id} className="p-6 hover:shadow-lg transition-shadow">
                    {/* Team Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                          {team.name}
                        </Typography>
                        {team.need && (
                          <Typography variant="small" color="gray" className="mb-2">
                            نیاز: {team.need.title}
                          </Typography>
                        )}
                      </div>
                      <Chip
                        value={getStatusLabel(team.status)}
                        color={getStatusColor(team.status)}
                        size="sm"
                      />
                    </div>

                    {/* Description */}
                    {team.description && (
                      <Typography variant="small" color="gray" className="mb-4 line-clamp-2">
                        {team.description}
                      </Typography>
                    )}

                    {/* Focus Area */}
                    <div className="mb-4">
                      <Chip
                        value={getFocusAreaLabel(team.focusArea)}
                        color="purple"
                        variant="ghost"
                        size="sm"
                      />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-md">
                        <div className="flex items-center gap-2 mb-1">
                          <UserGroupIcon className="w-4 h-4 text-blue-500" />
                          <Typography variant="small" color="blue-gray">
                            اعضا
                          </Typography>
                        </div>
                        <Typography variant="h6" color="blue">
                          {team.activeMembers || 0}
                          {team.maxMembers && ` / ${team.maxMembers}`}
                        </Typography>
                      </div>

                      <div className="bg-green-50 p-3 rounded-md">
                        <Typography variant="small" color="blue-gray" className="mb-1">
                          تسک‌ها
                        </Typography>
                        <Typography variant="h6" color="green">
                          {team.tasksCompletedByTeam || 0}
                        </Typography>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      {team.need && (
                        <Link to={`/dashboard/teams/${team.need._id}/${team._id}`} className="flex-1">
                          <Button color="blue" size="sm" fullWidth className="flex items-center justify-center gap-2">
                            <EyeIcon className="w-4 h-4" />
                            مشاهده
                          </Button>
                        </Link>
                      )}
                      {team.need && (
                        <>
                          <IconButton
                            color="green"
                            size="sm"
                            onClick={() =>
                              window.location.href = `/dashboard/teams/${team.need._id}/${team._id}/edit`
                            }
                          >
                            <PencilIcon className="w-4 h-4" />
                          </IconButton>
                          <IconButton
                            color="red"
                            size="sm"
                            onClick={() => handleDelete(team.need._id, team._id, team.name)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <Typography variant="h6" color="gray">
                    شما هنوز عضو هیچ تیمی نیستید
                  </Typography>
                  <Typography variant="small" color="gray" className="mt-2">
                    برای مشاهده تیم‌ها، به صفحه نیازها بروید و در یک نیاز عضو شوید
                  </Typography>
                  <Link to="/dashboard/needs">
                    <Button color="blue" className="mt-4">
                      مشاهده نیازها
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
        onClose={() => setDeleteModal({ isOpen: false, teamId: null, needId: null, teamName: "" })}
        onConfirm={confirmDelete}
        title="حذف تیم"
        message={`آیا از حذف تیم "${deleteModal.teamName}" اطمینان دارید؟`}
      />
    </div>
  );
};

export default Teams;
