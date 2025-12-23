import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../features/categoriesSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight, Save, Info } from "lucide-react";

const CreateCategory = () => {
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" });
  const { loading } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Smart Slug Generation (Supports Persian/English)
      if (name === "name") {
        newData.slug = value
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\u0600-\u06FF-]+/g, "");
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return toast.error("تکمیل فیلدهای ستاره‌دار الزامی است.");

    const result = await dispatch(createCategory(formData));
    if (!result.error) {
      toast.success("دسته‌بندی با موفقیت ایجاد شد.");
      navigate("/dashboard/categories");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#cccccc]">
      <div className="max-w-3xl mx-auto bg-white rounded-[8px] shadow-soft overflow-hidden">
        <div className="bg-[#007acc] p-6 text-white flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Save size={20} />
            ایجاد دسته‌بندی جدید
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
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1e1e1e]">
                نام دسته‌بندی <span className="text-[#f7891b]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-[8px] border border-gray-200 focus:border-[#007acc] focus:ring-4 focus:ring-[#007acc]/10 outline-none transition-all"
                placeholder="مثلاً: لوازم دیجیتال"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1e1e1e]">
                اسلاگ (Slug) <span className="text-[#f7891b]">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                dir="ltr"
                className="w-full px-4 py-3 rounded-[8px] border border-gray-200 focus:border-[#007acc] focus:ring-4 focus:ring-[#007acc]/10 outline-none transition-all font-mono text-sm"
                placeholder="digital-devices"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1e1e1e]">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-[8px] border border-gray-200 focus:border-[#007acc] focus:ring-4 focus:ring-[#007acc]/10 outline-none transition-all resize-none"
              placeholder="توضیحات مختصری درباره این دسته بنویسید..."
            />
          </div>

          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-[8px] text-[#007acc] text-sm">
            <Info size={18} />
            <span>اسلاگ به صورت خودکار از نام تولید می‌شود اما می‌توانید آن را ویرایش کنید.</span>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#007acc] hover:bg-[#005f99] text-white rounded-[8px] font-bold transition-all shadow-md disabled:opacity-50"
            >
              {loading ? "در حال ثبت..." : "ذخیره دسته‌بندی"}
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

export default CreateCategory;
