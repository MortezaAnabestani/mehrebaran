import { useDispatch } from "react-redux";
import { deleteImageUploadCenter } from "../../features/imageUploadCenter";
import { useState } from "react";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";

const ImageGallery = ({ images, loading }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredImages = images?.filter((image) =>
    image?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="mt-6 bg-white border border-sky-200 p-4 rounded-md">
      <h2 className="text-lg font-normal text-gray-800 mb-4 text-center">عکس‌های بارگذاری‌شده</h2>
      <div className="flex relative justify-between items-center w-full mb-4">
        <input
          type="text"
          placeholder="عنوان عکس مورد نظر خود را جستجو کنید"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 text-sm rounded-md border-2 border-gray-300"
        />
        <img
          loading="lazy"
          src="/assets/images/dashboard/icons/searchIcon.svg"
          alt="search icon"
          className="h-6 w-6 absolute left-1 top-2"
        />
      </div>
      {filteredImages?.length === 0 ? (
        <p className="text-gray-600">هیچ تصویری موجود نیست.</p>
      ) : (
        <div>
          <div key={images?.length + 1} className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {!loading &&
              filteredImages?.map((img, index) => (
                <div key={index} className="relative group rounded-sm border border-blue-200 bg-blue-100 p-2">
                  <img
                    src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${img?.imageUrl}`}
                    alt={img?.title}
                    className="w-full h-40 object-cover rounded-md shadow-md"
                  />
                  <p className="text-xs p-1 m-1">
                    <span className="text-[9px] text-gray-500">عنوان عکس: </span> {img?.title}
                  </p>
                  <p className="text-xs p-1 m-1">
                    <span className="text-[9px] text-gray-500">تاریخ ایجاد: </span>
                    {toPersianDigits(convertToPersianTime(img?.createdAt, "YYYY/MM/DD"))}
                  </p>
                  <button
                    onClick={() => dispatch(deleteImageUploadCenter(img?._id))}
                    className="absolute top-0 left-0 w-full h-[50%] cursor-pointer bg-red-500 text-white text-xs rounded-md opacity-0 group-hover:opacity-80 transition"
                  >
                    حذف
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${img?.imageUrl}`
                      );
                      alert("  لینک کپی شد!");
                    }}
                    className="w-full py-1 cursor-copy text-white bg-blue-500 rounded-md hover:bg-blue-600 active:bg-blue-700 text-xs"
                  >
                    رونوشت پیوند
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
