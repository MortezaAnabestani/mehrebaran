import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFocusAreas,
  createFocusArea,
  updateFocusArea,
  deleteFocusArea,
  toggleFocusAreaActive,
  resetStatus,
} from "../../features/focusAreasSlice";

const FocusAreas = () => {
  const dispatch = useDispatch();
  const { focusAreas, loading, error, success } = useSelector(
    (state) => state.focusAreas
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    gradient: "",
    order: 0,
  });

  useEffect(() => {
    dispatch(fetchFocusAreas({ sort: "order" }));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowModal(false);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        icon: "",
        gradient: "",
        order: 0,
      });
      dispatch(resetStatus());
      dispatch(fetchFocusAreas({ sort: "order" }));
    }
  }, [success, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(updateFocusArea({ id: editingId, data: formData }));
    } else {
      await dispatch(createFocusArea(formData));
    }
  };

  const handleEdit = (focusArea) => {
    setEditingId(focusArea._id);
    setFormData({
      title: focusArea.title,
      description: focusArea.description,
      icon: focusArea.icon,
      gradient: focusArea.gradient,
      order: focusArea.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("آیا از حذف این حوزه فعالیت اطمینان دارید؟")) {
      await dispatch(deleteFocusArea(id));
    }
  };

  const handleToggleActive = async (id) => {
    await dispatch(toggleFocusAreaActive(id));
  };

  const gradientOptions = [
    { label: "آبی به سیان", value: "from-blue-500 to-cyan-600" },
    { label: "سبز به زمردی", value: "from-green-500 to-emerald-600" },
    { label: "بنفش به صورتی", value: "from-purple-500 to-pink-600" },
    { label: "نارنجی به قرمز", value: "from-orange-500 to-red-600" },
    { label: "زرد به نارنجی", value: "from-amber-500 to-yellow-600" },
    { label: "صورتی به قرمز", value: "from-rose-500 to-red-600" },
  ];

  return (
    <div className="bg-white rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">مدیریت حوزه‌های فعالیت</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: "",
              description: "",
              icon: "",
              gradient: "",
              order: focusAreas?.data?.length || 0,
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          ایجاد حوزه فعالیت جدید
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">در حال بارگذاری...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {focusAreas?.data?.map((area) => (
            <div
              key={area._id}
              className={`border rounded-lg p-4 ${
                area.isActive ? "bg-white" : "bg-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-4xl">{area.icon}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(area._id)}
                    className={`px-2 py-1 rounded text-xs ${
                      area.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {area.isActive ? "فعال" : "غیرفعال"}
                  </button>
                </div>
              </div>

              <h3
                className={`text-lg font-bold mb-2 bg-gradient-to-r ${area.gradient} bg-clip-text text-transparent`}
              >
                {area.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4">{area.description}</p>

              <div className="text-xs text-gray-500 mb-3">ترتیب: {area.order}</div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(area)}
                  className="flex-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(area._id)}
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "ویرایش حوزه فعالیت" : "ایجاد حوزه فعالیت جدید"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">عنوان</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">توضیحات</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    آیکون (ایموجی)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="🤝"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    از ایموجی‌های یونیکد استفاده کنید
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    گرادینت رنگ
                  </label>
                  <select
                    value={formData.gradient}
                    onChange={(e) =>
                      setFormData({ ...formData, gradient: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {gradientOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {formData.gradient && (
                    <div
                      className={`mt-2 h-12 rounded-md bg-gradient-to-r ${formData.gradient}`}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ترتیب</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "ایجاد"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusAreas;
