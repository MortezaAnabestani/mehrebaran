const MainImagePart = ({ register, imageName, handleImagePreview, previewImage }) => {
  return (
    <div className="w-full lg:w-[300px]">
      <label className="block text-xs font-medium text-gray-400 mb-2">انتخاب عکس اصلی</label>
      <div className="bg-slate-100 rounded-md p-2 border lg:max-h-100 lg:max-w-100 border-gray-400 border-dotted">
        <label
          htmlFor={`${imageName}`}
          className="flex flex-row items-center justify-between text-xs font-medium cursor-pointer"
        >
          <span className="block">برای انتخاب عکس کلیک کنید</span>
          <img
            className="w-8 h-8 animate-pulse animate-ease-in-out"
            src="/assets/images/dashboard/icons/portrait.svg"
            alt="image"
          />
        </label>
        <input
          {...register(`${imageName}`)}
          type="file"
          accept="image/*"
          name={`${imageName}`}
          className="hidden"
          id={`${imageName}`}
          onChange={handleImagePreview}
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="پیش‌نمایش"
            className="h-70 max-h-70 w-80 object-cover rounded-md mt-3 border border-red-300"
          />
        )}
      </div>
    </div>
  );
};

export default MainImagePart;
