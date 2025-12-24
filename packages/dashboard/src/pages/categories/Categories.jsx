import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, deleteCategory } from "../../features/categoriesSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Search, Edit2, Trash2, FolderTree, AlertCircle } from "lucide-react";

const Categories = () => {
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`آیا از حذف دسته‌بندی "${name}" اطمینان دارید؟`)) {
      const result = await dispatch(deleteCategory(id));
      if (!result.error) toast.success("دسته‌بندی با موفقیت حذف شد.");
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-[8px] shadow-soft p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e1e1e] flex items-center gap-2">
            <FolderTree className="text-[#007acc]" />
            مدیریت دسته‌بندی‌ها
          </h2>
          <p className="text-sm text-gray-500 mt-1">لیست تمامی گروه‌های محصولات و خدمات</p>
        </div>
        <Link
          to="create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#007acc] hover:bg-[#005f99] text-white rounded-[8px] transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <Plus size={18} />
          افزودن دسته‌بندی جدید
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md">
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          className="w-full pr-10 pl-4 py-3 bg-white border-none rounded-[8px] shadow-soft focus:ring-2 focus:ring-[#007acc] outline-none text-[#1e1e1e] transition-all"
          placeholder="جستجو در نام یا اسلاگ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-white/50 animate-pulse rounded-[8px]"></div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-[8px] p-12 text-center shadow-soft">
          <AlertCircle size={48} className="mx-auto text-[#f7891b] mb-4" />
          <p className="text-lg text-[#1e1e1e] font-medium">نتیجه‌ای یافت نشد!</p>
          <p className="text-gray-500">لطفاً عبارت دیگری را جستجو کنید یا دسته‌بندی جدید بسازید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-[8px] p-5 shadow-soft border border-transparent hover:border-[#007acc]/30 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#007acc]/10 rounded-[8px] flex items-center justify-center text-[#007acc]">
                  <FolderTree size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`edit/${category._id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="ویرایش"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id, category.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1e1e1e] mb-1">{category.name}</h3>
              <code className="text-xs bg-gray-100 text-[#f7891b] px-2 py-1 rounded">{category.slug}</code>
              {category.description && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
