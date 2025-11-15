import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../features/categoriesSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const { loading } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name
    if (name === "name" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\u0600-\u06FF-]/g, "");
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error("نام و slug اجباری هستند.");
      return;
    }

    const result = await dispatch(createCategory(formData));
    if (!result.error) {
      toast.success("دسته‌بندی با موفقیت ایجاد شد.");
      navigate("/dashboard/categories");
    }
  };

  return (
    <div className="ml-3">
      <div className="bg-white rounded-md p-6">
        <h2 className="text-xl font-medium mb-6">ایجاد دسته‌بندی جدید</h2>

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                نام دسته‌بندی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: تکنولوژی"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="technology"
              />
              <p className="text-xs text-gray-500 mt-1">
                Slug به صورت خودکار از نام ایجاد می‌شود. فقط از حروف کوچک، اعداد و خط تیره استفاده کنید.
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="توضیحات اختیاری درباره این دسته‌بندی..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "در حال ایجاد..." : "ایجاد دسته‌بندی"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/categories")}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                انصراف
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
