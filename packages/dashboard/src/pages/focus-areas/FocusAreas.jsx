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

// آیکون‌های SVG داخلی برای عدم وابستگی به کتابخانه‌های خارجی
const Icons = {
  Plus: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Edit: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Trash: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  X: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Check: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Power: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
      <line x1="12" y1="2" x2="12" y2="12"></line>
    </svg>
  ),
};

const FocusAreas = () => {
  const dispatch = useDispatch();
  const { focusAreas, loading, error, success } = useSelector((state) => state.focusAreas);

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
    { label: "برند (آبی به سرمه‌ای)", value: "from-[#007acc] to-[#005fa3]" },
    { label: "برند (نارنجی به زرد)", value: "from-[#f7891b] to-yellow-500" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden font-sans text-[#1e1e1e]">
      {/* Header Section */}
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1e1e1e] tracking-tight">مدیریت حوزه‌های فعالیت</h2>
          <p className="text-gray-500 mt-1 text-sm">
            دسته‌بندی‌ها و حوزه‌های اصلی کسب‌وکار خود را مدیریت کنید
          </p>
        </div>
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
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#007acc] text-white rounded-xl hover:bg-[#0062a3] transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5 font-medium"
        >
          <Icons.Plus />
          <span>ایجاد حوزه جدید</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-6 bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm flex items-center">
          <span className="ml-2">⚠️</span>
          {error}
        </div>
      )}

      {/* Content Area */}
      <div className="p-6 md:p-8 bg-[#f9f9f9]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {focusAreas?.data?.map((area) => (
              <div
                key={area._id}
                className={`group relative bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  area.isActive ? "border-gray-100" : "border-gray-200 bg-gray-50 opacity-90"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-2xl text-3xl shadow-inner border border-gray-100">
                    {area.icon}
                  </div>
                  <button
                    onClick={() => handleToggleActive(area._id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      area.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {area.isActive ? <Icons.Check /> : <Icons.Power />}
                    <span>{area.isActive ? "فعال" : "غیرفعال"}</span>
                  </button>
                </div>

                {/* Card Body */}
                <h3
                  className={`text-xl font-bold mb-2 bg-gradient-to-r ${area.gradient} bg-clip-text text-transparent truncate`}
                >
                  {area.title}
                </h3>

                <p className="text-sm text-gray-500 mb-6 line-clamp-2 h-10 leading-relaxed">
                  {area.description}
                </p>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    Order: {area.order}
                  </span>

                  <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(area)}
                      className="p-2 text-[#f7891b] bg-orange-50 rounded-lg hover:bg-[#f7891b] hover:text-white transition-colors"
                      title="ویرایش"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(area._id)}
                      className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                      title="حذف"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {focusAreas?.data?.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <div className="text-6xl mb-4 opacity-20">📂</div>
                <p>هیچ حوزه فعالیتی یافت نشد.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modern Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1e1e1e]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#1e1e1e]">
                {editingId ? "ویرایش حوزه فعالیت" : "ایجاد حوزه فعالیت جدید"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Icons.X />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#007acc] focus:border-transparent transition-all outline-none text-[#1e1e1e]"
                    placeholder="مثلاً: توسعه نرم‌افزار"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">توضیحات</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#007acc] focus:border-transparent transition-all outline-none text-[#1e1e1e] resize-none"
                    rows="3"
                    placeholder="توضیح کوتاهی درباره این حوزه..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">آیکون (ایموجی)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#007acc] focus:border-transparent transition-all outline-none text-center text-xl"
                        placeholder="🚀"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ترتیب نمایش</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#007acc] focus:border-transparent transition-all outline-none text-center"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    استایل رنگی (گرادینت)
                  </label>
                  <div className="relative">
                    <select
                      value={formData.gradient}
                      onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#007acc] focus:border-transparent transition-all outline-none appearance-none"
                      required
                    >
                      <option value="">انتخاب رنگ‌بندی...</option>
                      {gradientOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                      ▼
                    </div>
                  </div>

                  {/* Gradient Preview */}
                  <div
                    className={`mt-3 h-14 rounded-xl flex items-center justify-center text-white font-bold shadow-sm transition-all duration-500 ${
                      formData.gradient
                        ? `bg-gradient-to-r ${formData.gradient}`
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {formData.gradient ? "پیش‌نمایش رنگ" : "رنگی انتخاب نشده"}
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#007acc] text-white rounded-xl hover:bg-[#0062a3] transition-all shadow-lg shadow-blue-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        در حال ذخیره...
                      </span>
                    ) : editingId ? (
                      "ذخیره تغییرات"
                    ) : (
                      "ایجاد حوزه"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusAreas;
