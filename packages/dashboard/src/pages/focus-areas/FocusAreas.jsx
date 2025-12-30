import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as LucideIcons from "lucide-react";
import IconPicker from "../../components/shared/IconPicker";
import ColorPicker from "../../components/shared/ColorPicker";
import {
  fetchFocusAreas,
  createFocusArea,
  updateFocusArea,
  deleteFocusArea,
  toggleFocusAreaActive,
  resetStatus,
} from "../../features/focusAreasSlice";

// --- ICONS (Optimized for 14px/16px) ---
const Icons = {
  Plus: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
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
      width="14"
      height="14"
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
      width="14"
      height="14"
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
      width="16"
      height="16"
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
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Power: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
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
  Sort: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  ),
};

const FocusAreas = () => {
  const dispatch = useDispatch();
  const { focusAreas, loading, error, success } = useSelector((state) => state.focusAreas);

  const [showModal, setShowModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
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
    if (window.confirm("آیا از حذف این آیتم اطمینان دارید؟")) {
      await dispatch(deleteFocusArea(id));
    }
  };

  const handleToggleActive = async (id) => {
    await dispatch(toggleFocusAreaActive(id));
  };

  // Render Lucide icon or emoji
  const renderIcon = (iconName) => {
    // اگر آیکون lucide باشد
    const LucideIcon = LucideIcons[iconName];
    if (LucideIcon) {
      return <LucideIcon size={20} />;
    }
    // در غیر این صورت emoji نمایش بده
    return <span className="text-lg">{iconName}</span>;
  };

  return (
    <div className="w-full bg-white border border-slate-300 rounded-md shadow-sm font-sans text-slate-800">
      {/* --- Header Toolbar --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-300 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#007acc]/10 text-[#007acc] rounded-md border border-[#007acc]/20">
            <Icons.Sort />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">حوزه‌های فعالیت</h2>
            <p className="text-[11px] text-slate-500 font-medium">مدیریت دسته‌بندی‌های اصلی سیستم</p>
          </div>
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
          className="flex items-center gap-2 px-3 py-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white text-[12px] font-medium rounded-md transition-colors shadow-sm"
        >
          <Icons.Plus />
          <span>افزودن جدید</span>
        </button>
      </div>

      {/* --- Error Alert --- */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-red-600 text-[12px] flex items-center gap-2">
          <span className="font-bold">خطا:</span> {error}
        </div>
      )}

      {/* --- Data Grid (Functional Layout) --- */}
      <div className="w-full overflow-x-auto">
        {/* Table Header */}
        <div className="min-w-[800px] grid grid-cols-12 gap-2 px-4 py-2 bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-1 text-center">آیکون</div>
          <div className="col-span-3">عنوان</div>
          <div className="col-span-4">توضیحات</div>
          <div className="col-span-1 text-center">ترتیب</div>
          <div className="col-span-1 text-center">وضعیت</div>
          <div className="col-span-2 text-left pl-2">عملیات</div>
        </div>

        {/* Table Body */}
        <div className="min-w-[800px] bg-white">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-[12px]">در حال بارگذاری داده‌ها...</div>
          ) : focusAreas?.data?.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-slate-400 border-b border-slate-200 border-dashed m-4 rounded-md bg-slate-50">
              <span className="text-2xl mb-2 opacity-50">📂</span>
              <span className="text-[12px]">داده‌ای یافت نشد</span>
            </div>
          ) : (
            focusAreas?.data?.map((area) => (
              <div
                key={area._id}
                className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-slate-200 items-center hover:bg-slate-50 transition-colors group text-[12px]"
              >
                {/* Icon */}
                <div className="col-span-1 flex justify-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-md border border-slate-200">
                    {renderIcon(area.icon)}
                  </div>
                </div>

                {/* Title & Gradient Indicator */}
                <div className="col-span-3 flex flex-col justify-center">
                  <span className="font-semibold text-slate-700 truncate">{area.title}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${area.gradient}`}></div>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]">
                      {area.gradient.replace("from-", "").split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-4 text-slate-500 truncate pr-2 border-r border-slate-100 h-full flex items-center">
                  {area.description}
                </div>

                {/* Order */}
                <div className="col-span-1 text-center font-mono text-slate-600 bg-slate-50 py-1 rounded border border-slate-100 mx-2">
                  {area.order}
                </div>

                {/* Status */}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => handleToggleActive(area._id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-medium transition-all ${
                      area.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {area.isActive ? <Icons.Check /> : <Icons.Power />}
                    <span>{area.isActive ? "فعال" : "غیرفعال"}</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1 pl-2">
                  <button
                    onClick={() => handleEdit(area)}
                    className="h-7 px-2 flex items-center gap-1 text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 hover:text-[#007acc] hover:border-[#007acc] transition-all"
                    title="ویرایش"
                  >
                    <Icons.Edit />
                    <span className="hidden xl:inline">ویرایش</span>
                  </button>
                  <button
                    onClick={() => handleDelete(area._id)}
                    className="h-7 w-7 flex items-center justify-center text-slate-400 bg-white border border-slate-300 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                    title="حذف"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Functional Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px]">
          <div className="w-full max-w-md bg-white rounded-md shadow-2xl border border-slate-300 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-300 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">
                {editingId ? "ویرایش رکورد" : "ایجاد رکورد جدید"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <Icons.X />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">عنوان حوزه</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] outline-none text-[12px] transition-all placeholder:text-slate-300"
                    placeholder="مثلاً: توسعه نرم‌افزار"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">توضیحات مختصر</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] outline-none text-[12px] transition-all resize-none h-20 placeholder:text-slate-300"
                    placeholder="توضیحات..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">آیکون</label>
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(true)}
                      className="w-full h-9 px-3 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] outline-none text-sm transition-all flex items-center justify-center gap-2 hover:bg-slate-50"
                    >
                      {formData.icon ? (
                        <>
                          <div className="w-5 h-5 flex items-center justify-center">
                            {renderIcon(formData.icon)}
                          </div>
                          <span className="text-[10px] text-slate-500">{formData.icon}</span>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400">انتخاب آیکون</span>
                      )}
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">ترتیب (Order)</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full h-9 px-3 text-center font-mono bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] outline-none text-[12px]"
                      required
                    />
                  </div>
                </div>

                <ColorPicker
                  value={formData.gradient}
                  onChange={(gradient) => setFormData({ ...formData, gradient })}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 pt-4 mt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-9 flex items-center justify-center bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-[12px] font-medium transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-9 flex items-center justify-center bg-[#007acc] border border-transparent text-white rounded hover:bg-[#0062a3] text-[12px] font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "در حال پردازش..." : editingId ? "ذخیره تغییرات" : "ایجاد"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Icon Picker Modal */}
      {showIconPicker && (
        <IconPicker
          value={formData.icon}
          onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </div>
  );
};

export default FocusAreas;
