import styles from "../../styles/admin.module.css";
import { createTag } from "../../features/tagsSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
const TagPart = ({ tags, handleTagSelection, removeTag, selectedTags, setSelectedTags }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState(""); // جستجو در تگ‌ها
  const [filteredTags, setFilteredTags] = useState(tags); // تگ‌های فیلتر شده بر اساس جستجو
  const [showCreateButton, setShowCreateButton] = useState(false); // کنترل نمایش دکمه ایجاد تگ

  useEffect(() => {
    // فیلتر کردن تگ‌ها بر اساس جستجو
    if (searchQuery === "") {
      setFilteredTags([]);
      setShowCreateButton(false);
    } else {
      const matchingTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredTags(matchingTags);
      setShowCreateButton(matchingTags.length === 0); // نمایش دکمه ایجاد تگ اگر چیزی پیدا نشد
    }
  }, [searchQuery, tags]);

  const handleCreateTag = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() === "") return;
    try {
      const response = await dispatch(createTag({ name: searchQuery })).unwrap();
      setSearchQuery(""); // پاک کردن مقدار ورودی
      handleTagSelection(response._id, setSearchQuery);
      setSelectedTags([...selectedTags, response._id]); // افزودن تگ جدید به لیست انتخاب‌شده
      setShowCreateButton(false);
      setSearchQuery(""); // پاک کردن جستجو
    } catch (error) {
      console.error("خطا در ایجاد تگ:", error);
    }
  };

  return (
    <>
      <div className="mt-4 mb-4">
        <div className={`${styles.createContent_title}`}>
          <label className="text-[12px] mb-0" htmlFor="bodytext">
            برچسب‌ها
          </label>
        </div>
        {/* ورودی جستجو */}
        <div className="relative mt-[-19px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو یا ایجاد برچسب جدید"
            className={` w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none shadow-md text-sm`}
          />

          {searchQuery && (
            <div className="absolute top-0 right-0 mt-8 w-full bg-white shadow-lg rounded-md z-10">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag, index) => (
                  <div
                    key={index}
                    onClick={() => handleTagSelection(tag._id, setSearchQuery)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {tag.name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500">تگی یافت نشد</div>
              )}

              {/* نمایش دکمه ایجاد تگ فقط در صورتی که تگ یافت نشد */}
              {showCreateButton && (
                <button
                  onClick={handleCreateTag}
                  className="w-full text-md text-center px-3 py-2 cursor-pointer bg-gray-500 text-white hover:bg-gray-600 rounded-b-sm"
                >
                  + ایجاد برچسب جدید
                  <span className="text-red-300 font-semibold mr-2">{searchQuery}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/*   نمایش تگ‌های انتخاب‌شده */}
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedTags?.map((tagId, index) => {
            const tag = tags?.find((t) => t._id === tagId);
            return (
              <div key={index} className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-md">
                <span className="text-sm text-gray-700">{tag?.name}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tagId)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TagPart;
