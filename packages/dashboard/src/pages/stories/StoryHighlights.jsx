import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchUserHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
} from "../../features/storiesSlice";
import { Card, Button, Input, Typography, Chip, IconButton } from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const StoryHighlights = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { highlights, loading } = useSelector((state) => state.stories);

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, highlight: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, highlightId: null, title: "" });
  const [formData, setFormData] = useState({
    title: "",
    coverImage: "",
  });

  // بارگذاری هایلایت‌ها
  useEffect(() => {
    const loadHighlights = async () => {
      try {
        // اگر userId داده نشده، هایلایت‌های خود کاربر را می‌گیرد (باید از API کاربر جاری استفاده کند)
        await dispatch(fetchUserHighlights(userId || "me")).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری هایلایت‌ها:", error);
      }
    };

    loadHighlights();
  }, [dispatch, userId]);

  // ایجاد هایلایت
  const handleCreate = async () => {
    try {
      await dispatch(createHighlight(formData)).unwrap();
      setCreateModal(false);
      setFormData({ title: "", coverImage: "" });
    } catch (error) {
      console.error("خطا در ایجاد هایلایت:", error);
    }
  };

  // ویرایش هایلایت
  const handleEdit = async () => {
    try {
      await dispatch(
        updateHighlight({
          highlightId: editModal.highlight._id,
          highlightData: formData,
        })
      ).unwrap();
      setEditModal({ isOpen: false, highlight: null });
      setFormData({ title: "", coverImage: "" });
    } catch (error) {
      console.error("خطا در ویرایش هایلایت:", error);
    }
  };

  // حذف هایلایت
  const handleDelete = (id, title) => {
    setDeleteModal({ isOpen: true, highlightId: id, title });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteHighlight(deleteModal.highlightId)).unwrap();
      setDeleteModal({ isOpen: false, highlightId: null, title: "" });
    } catch (error) {
      console.error("خطا در حذف هایلایت:", error);
    }
  };

  // باز کردن مودال ویرایش
  const openEditModal = (highlight) => {
    setFormData({
      title: highlight.title,
      coverImage: highlight.coverImage,
    });
    setEditModal({ isOpen: true, highlight });
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-yellow-500" />
            <Typography variant="h4" color="blue-gray">
              هایلایت‌های استوری
            </Typography>
          </div>
          <Button
            color="blue"
            className="flex items-center gap-2"
            onClick={() => setCreateModal(true)}
          >
            <PlusIcon className="w-5 h-5" />
            ایجاد هایلایت جدید
          </Button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Highlights Grid */}
            {highlights && Array.isArray(highlights) && highlights.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {highlights.map((highlight) => (
                  <Card
                    key={highlight._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Cover Image */}
                    <div className="relative h-32 bg-gray-100">
                      {highlight.coverImage ? (
                        <img
                          src={highlight.coverImage}
                          alt={highlight.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PhotoIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      {/* Stories Count */}
                      <div className="absolute bottom-2 right-2">
                        <Chip
                          value={`${highlight.stories?.length || 0} استوری`}
                          color="white"
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Highlight Info */}
                    <div className="p-3">
                      <Typography variant="small" color="blue-gray" className="font-bold mb-2">
                        {highlight.title}
                      </Typography>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <IconButton
                          color="green"
                          size="sm"
                          onClick={() => openEditModal(highlight)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(highlight._id, highlight.title)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </IconButton>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <SparklesIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <Typography variant="h6" color="gray">
                  هنوز هایلایتی ایجاد نشده است
                </Typography>
                <Typography variant="small" color="gray" className="mb-4">
                  استوری‌های مهم خود را در هایلایت‌ها ذخیره کنید
                </Typography>
                <Button
                  color="blue"
                  className="flex items-center gap-2 mx-auto"
                  onClick={() => setCreateModal(true)}
                >
                  <PlusIcon className="w-5 h-5" />
                  ایجاد اولین هایلایت
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              ایجاد هایلایت جدید
            </Typography>

            <div className="space-y-4">
              <Input
                label="عنوان هایلایت *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Input
                label="URL تصویر کاور *"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              />

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outlined"
                  color="gray"
                  onClick={() => {
                    setCreateModal(false);
                    setFormData({ title: "", coverImage: "" });
                  }}
                >
                  انصراف
                </Button>
                <Button
                  color="blue"
                  onClick={handleCreate}
                  disabled={!formData.title || !formData.coverImage}
                >
                  ایجاد
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              ویرایش هایلایت
            </Typography>

            <div className="space-y-4">
              <Input
                label="عنوان هایلایت *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Input
                label="URL تصویر کاور *"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              />

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outlined"
                  color="gray"
                  onClick={() => {
                    setEditModal({ isOpen: false, highlight: null });
                    setFormData({ title: "", coverImage: "" });
                  }}
                >
                  انصراف
                </Button>
                <Button
                  color="blue"
                  onClick={handleEdit}
                  disabled={!formData.title || !formData.coverImage}
                >
                  ذخیره
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, highlightId: null, title: "" })}
        onConfirm={confirmDelete}
        title="حذف هایلایت"
        message={`آیا از حذف هایلایت "${deleteModal.title}" اطمینان دارید؟`}
      />
    </div>
  );
};

export default StoryHighlights;
