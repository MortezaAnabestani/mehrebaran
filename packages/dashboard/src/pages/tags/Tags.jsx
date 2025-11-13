import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, createTag, updateTag, deleteTag } from "../../features/tagsSlice";
import { useForm } from "react-hook-form";

const TagManager = () => {
  const dispatch = useDispatch();
  const { tags, loading } = useSelector((state) => state.tags);
  const { register, handleSubmit, setValue, reset } = useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(null); // برای ذخیره برچسب در حال ویرایش
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch, tags.length, isEditing]);

  useEffect(() => {
    if (isEditing) {
      setValue("tagName", tags.find((tag) => tag._id === isEditing)?.name || "");
    }
  }, [isEditing, setValue, tags]);

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
      setIsEditing(null); // تغییر وضعیت به حالت عادی
    } catch (error) {
      setAlert("خطا در ویرایش برچسب");
    }
  };

  const handleDeleteTag = (id) => {
    dispatch(deleteTag(id));
    setAlert("تگ با موفقیت حذف شد!");
  };

  const handleEditTag = (id) => {
    setIsEditing(id); // وارد حالت ویرایش می‌شود
  };

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const onSubmit = handleSubmit(isEditing ? handleUpdateTag : handleCreateTag);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-md mb-4">
        <div className="flex items-center justify-between p-2">
          <h2 className="flex gap-1 text-xl font-medium w-1/3">مدیریت برچسب‌ها</h2>
          <div className="flex relative justify-between items-center w-1/3">
            <input
              type="text"
              placeholder="تگ مورد نظر خود را جستجو کنید"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 text-sm rounded-md border-2 border-gray-300"
            />
            <img
              src="/assets/images/dashboard/icons/searchIcon.svg"
              alt="search icon"
              className="h-6 w-6 absolute left-1 top-2"
            />
          </div>
        </div>
      </div>
      {/* فرم ایجاد یا ویرایش تگ */}
      <form onSubmit={onSubmit} className="flex gap-1 mt-4 mb-4 mx-auto relative">
        <input
          {...register("tagName")}
          placeholder={isEditing ? "ویرایش نام برچسب" : "نام برچسب جدید"}
          className="p-2 mb-3 text-white rounded-md border-2 h-15 border-red-100 w-full inset-shadow-xl shadow-red-50 bg-linear-to-r from-red-300 to-red-500 inset-ring-8 shadow-md"
        />
        <button type="submit" className="cursor-pointer absolute left-4 top-4">
          {isEditing ? (
            <div className="flex flex-row-reverse gap-1 items-center justify-center border border-red-600 rounded-4xl pr-5 bg-white hover:bg-amber-100">
              <img
                className="w-7 h-7 mr-2"
                src="/assets/images/dashboard/icons/replace2.svg"
                alt="replace icon"
              />
              <span className="text-sm">ویرایش برچسب</span>
            </div>
          ) : (
            <div className="flex flex-row-reverse gap-1 items-center justify-center border border-red-600 rounded-4xl pr-5 bg-white hover:bg-green-100">
              <img
                loading="lazy"
                className="w-7 h-7 mr-2"
                src="/assets/images/dashboard/icons/plus.svg"
                alt="plus icon"
              />
              <span className="text-sm">اضافه‌کردن برچسب جدید</span>
            </div>
          )}
        </button>
      </form>
      {/* نمایش برچسب‌ها */}
      <div className="flex flex-wrap gap-4">
        {loading ? (
          <p className="text-center mx-auto text-sm text-gray-300">در حال بارگذاری...</p>
        ) : (
          filteredTags.map((tag) => (
            <div
              key={tag._id}
              className="flex justify-between items-center border-1 shadow-sm shadow-gray-300 bg-gray-100 rounded-md border-gray-50 hover:translate-y-1 duration-200"
            >
              <p className="pr-2 text-gray-600 text-md">{tag.name}</p>
              <div className="mr-6 px-2 pt-2">
                <button onClick={() => handleEditTag(tag._id)} className="cursor-pointer">
                  <img
                    className="w-6 h-5 animate-pulse"
                    src="/assets/images/dashboard/icons/replace.svg"
                    alt="edit icon"
                  />
                </button>
                <button onClick={() => handleDeleteTag(tag._id)} className="cursor-pointer">
                  <img
                    className="w-6 h-5 mr-2"
                    src="/assets/images/dashboard/icons/close.svg"
                    alt="edit icon"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TagManager;
