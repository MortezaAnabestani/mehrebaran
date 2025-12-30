import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, createTag, updateTag, deleteTag } from "../../features/tagsSlice";
import { useForm } from "react-hook-form";

const TagManager = () => {
  const dispatch = useDispatch();
  const { tags, loading } = useSelector((state) => state.tags);
  const { register, handleSubmit, setValue, reset } = useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [alert, setAlert] = useState(null);

  // رنگ اصلی برند
  const PRIMARY_COLOR = "text-[#007acc]";
  const PRIMARY_BG = "bg-[#007acc]";

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch, tags.length, isEditing]);

  useEffect(() => {
    if (isEditing) {
      setValue("tagName", tags.find((tag) => tag._id === isEditing)?.name || "");
    }
  }, [isEditing, setValue, tags]);

  // پاک کردن آلرت بعد از ۳ ثانیه
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateTag = async (data) => {
    try {
      await dispatch(createTag({ name: data.tagName }));
      setAlert("برچسب جدید با موفقیت اضافه شد!");
      reset();
    } catch (error) {
      setAlert("خطا در ایجاد برچسب");
    }
  };

  const handleUpdateTag = async (data) => {
    try {
      await dispatch(updateTag({ id: isEditing, formData: { name: data.tagName } }));
      setAlert("ویرایش برچسب انجام شد!");
      setIsEditing(null);
      reset();
    } catch (error) {
      setAlert("خطا در ویرایش برچسب");
    }
  };

  const handleDeleteTag = (id) => {
    dispatch(deleteTag(id));
    setAlert("تگ با موفقیت حذف شد!");
  };

  const handleEditTag = (id) => {
    setIsEditing(id);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    reset();
  };

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const onSubmit = handleSubmit(isEditing ? handleUpdateTag : handleCreateTag);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans text-gray-800" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Search Section - Surface Container */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-shadow hover:shadow-md duration-300">
          <h2 className={`text-2xl font-bold ${PRIMARY_COLOR} tracking-tight`}>مدیریت برچسب‌ها</h2>

          <div className="relative w-full md:w-1/2 group">
            <input
              type="text"
              placeholder="جستجو در برچسب‌ها..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#007acc]/20 focus:border-[#007acc] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007acc] transition-colors">
              <img
                src="/assets/images/dashboard/icons/searchIcon.svg"
                alt="search"
                className="w-5 h-5 opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Alert Snackbar */}
        {alert && (
          <div className="fixed bottom-6 left-6 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
            {alert}
          </div>
        )}

        {/* Input Form Section - Elevated Card */}
        <div className="bg-white rounded-[28px] shadow-md p-6 md:p-8 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#007acc] to-sky-300 opacity-80"></div>

          <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-grow relative">
              <input
                {...register("tagName", { required: true })}
                placeholder={isEditing ? "نام جدید برچسب را وارد کنید..." : "نام برچسب جدید..."}
                className="w-full p-4 bg-white border border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-[#007acc] focus:ring-4 focus:ring-[#007acc]/10 transition-all duration-300 outline-none"
              />
              <label className="absolute -top-2.5 right-4 bg-white px-2 text-xs font-medium text-[#007acc]">
                {isEditing ? "ویرایش تگ" : "تگ جدید"}
              </label>
            </div>

            <div className="flex gap-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  انصراف
                </button>
              )}

              <button
                type="submit"
                className={`${PRIMARY_BG} text-white px-8 py-3 rounded-full shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center gap-2 font-medium min-w-[140px]`}
              >
                {isEditing ? (
                  <>
                    <img
                      src="/assets/images/dashboard/icons/replace2.svg"
                      className="w-5 h-5 invert brightness-0"
                      alt=""
                    />
                    <span>بروزرسانی</span>
                  </>
                ) : (
                  <>
                    <img
                      src="/assets/images/dashboard/icons/plus.svg"
                      className="w-5 h-5 invert brightness-0"
                      alt=""
                    />
                    <span>افزودن</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tags Display Area - Grid Layout */}
        <div className="bg-white/50 rounded-3xl p-6 min-h-[200px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 animate-pulse">
              <div className="w-8 h-8 border-4 border-[#007acc] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium">در حال بارگذاری اطلاعات...</p>
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p>هیچ برچسبی یافت نشد.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {filteredTags.map((tag) => (
                <div
                  key={tag._id}
                  className={`group flex items-center pl-1 pr-4 py-1.5 rounded-2xl border transition-all duration-200 ease-out
                    ${
                      isEditing === tag._id
                        ? "bg-sky-50 border-[#007acc] shadow-md ring-2 ring-[#007acc]/20"
                        : "bg-white border-gray-200 hover:border-sky-200 hover:shadow-sm hover:bg-gray-50"
                    }`}
                >
                  <span
                    className={`text-sm font-medium ml-3 ${
                      isEditing === tag._id ? "text-[#007acc]" : "text-gray-700"
                    }`}
                  >
                    {tag.name}
                  </span>

                  <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditTag(tag._id)}
                      className="p-1.5 rounded-full hover:bg-sky-100 text-sky-600 transition-colors"
                      title="ویرایش"
                    >
                      <img className="w-4 h-4" src="/assets/images/dashboard/icons/replace.svg" alt="edit" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                      title="حذف"
                    >
                      <img className="w-4 h-4" src="/assets/images/dashboard/icons/close.svg" alt="delete" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagManager;
