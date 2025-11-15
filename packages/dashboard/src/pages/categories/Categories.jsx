import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, deleteCategory } from "../../features/categoriesSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Categories = () => {
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`آیا از حذف دسته‌بندی "${name}" اطمینان دارید؟`)) {
      const result = await dispatch(deleteCategory(id));
      if (!result.error) {
        toast.success("دسته‌بندی با موفقیت حذف شد.");
      }
    }
  };

  const filteredCategories = searchTerm
    ? categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  return (
    <div className="ml-3">
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-4">
          <h2 className="flex gap-3 text-xl font-medium">فهرست دسته‌بندی‌ها</h2>
          <Link
            rel="preconnect"
            to="create"
            className="px-3 py-[6px] text-xs lg:block bg-blue-600 rounded-md hover:bg-blue-700 text-white"
          >
            اضافه‌کردن دسته‌بندی جدید
          </Link>
        </div>
      </div>

      <div>
        <div className="overflow-hidden sm:rounded-md max-w-full lg:max-w-4xl mx-auto mt-6">
          {/* Search box */}
          <form className="w-full flex flex-col gap-y-2 mb-4">
            <label htmlFor="search" className="block text-xs font-medium text-gray-600">
              جستجو
            </label>
            <input
              type="text"
              name="search"
              id="search"
              className="px-3 text-sm py-2 rounded-md outline-0 border border-gray-200 shadow-md bg-gray-100 h-10"
              placeholder="نام یا slug دسته‌بندی را جستجو کنید..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">در حال بارگیری...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-md shadow-sm">
              <p className="text-gray-500">
                {searchTerm ? "دسته‌بندی‌ای یافت نشد." : "هنوز هیچ دسته‌بندی‌ای ایجاد نشده است."}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredCategories.map((category) => {
                return (
                  <li
                    key={category._id}
                    className="border-gray-200 hover:translate-1 duration-300 bg-white shadow-sm border rounded-lg"
                  >
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between flex-col lg:flex-row gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-2">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-1">
                            Slug: <span className="font-medium text-gray-700">{category.slug}</span>
                          </p>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            rel="preconnect"
                            to={`edit/${category._id}`}
                            className="font-medium text-white text-sm px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                          >
                            ویرایش
                          </Link>
                          <button
                            onClick={() => handleDelete(category._id, category.name)}
                            className="font-medium text-white text-sm px-4 py-2 rounded-md bg-red-600 hover:bg-red-700"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
