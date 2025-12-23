import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryById, updateCategory, categoriesResetStatus } from "../../features/categoriesSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight, Edit3, RefreshCw } from "lucide-react";

const EditCategory = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" });
  const { selectedCategory, loading } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategoryById(id));
    return () => dispatch(categoriesResetStatus());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name || "",
        slug: selectedCategory.slug || "",
        description: selectedCategory.description || "",
      });
    }
  }, [selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateCategory({ id, data: formData }));
    if (!result.error) {
      toast.success("تغییرات با موفقیت اعمال شد.");
      navigate("/dashboard/categories");
    }
  };

  if (loading && !selectedCategory) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#cccccc]">
        <RefreshCw className="animate-spin text-[#007acc]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#cccccc]">
      <div className="max-w-3xl mx-auto bg-white rounded-[8px] shadow-soft overflow-hidden">
        <div className="bg-[#f7891b] p-6 text-white flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Edit3 size={20} />
            ویرایش دسته‌بندی
          </h2>
          <button
            onClick={() => navigate("/dashboard/categories")}
            className="text-white/80 hover:text-white flex items-center gap-1 text-sm transition-colors"
          >
            بازگشت
            <ArrowRight size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1e1e1e]">نام دسته‌بندی</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-[8px] border border-gray-200 focus:border-[#f7891b] focus:ring-4 focus:ring-[#f7891b]/10 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1e1e1e]">اسلاگ (Slug)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                dir="ltr"
                className="w-full px-4 py-3 rounded-[8px] border border-gray-200 focus:border-[#f7891b] focus:ring-4 focus:ring-[#f7891b]/10 outline-none transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1e1e1e]">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-[8px] border border-gray-200 focus:border-[#f7891b] focus:ring-4 focus:ring-[#f7891b]/10 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#f7891b] hover:bg-[#d67210] text-white rounded-[8px] font-bold transition-all shadow-md disabled:opacity-50"
            >
              {loading ? "در حال به‌روزرسانی..." : "ثبت تغییرات نهایی"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/categories")}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-[8px] font-medium transition-all"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
