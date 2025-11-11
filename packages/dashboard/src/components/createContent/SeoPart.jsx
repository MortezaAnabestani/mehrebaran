import { Link } from "react-router-dom";

const SeoPart = ({ register }) => {
  return (
    <div className="border-t-4 border-red-100">
      <div className="flex items-center mt-2 mb-4">
        <h2 className="text-sm text-red-400">سئوپردازی</h2>
        <div className="relative group">
          <Link
            rel="preconnect"
            prefetch={true}
            to={"https://digitaling.org/how-to-write-meta-title-and-description/"}
            target="blank"
          >
            <img
              src="/assets/images/dashboard/icons/help.svg"
              alt="help"
              className="w-4 h-4 mr-2 animate-pulse cursor-pointer"
            />
          </Link>
          <span className="absolute w-[150px] top-[2px] right-[-40px] transform -translate-x-1/2 text-red-400 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            برای اطلاعات بیش‌تر کلیک کنید
          </span>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="metaTitle" className="block text-xs font-medium text-gray-400">
            برچسب عنوان (Meta Title)
          </label>
          <input
            type="text"
            name="metaTitle"
            placeholder="هوشنگ مرادی کرمانی، کرمانی، نویسندۀ برجستۀ ایرانی، شما که غریبه نسیتید، کرمان، قصه‌های مجید و... "
            className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
            id="metaTitle"
            {...register("metaTitle")}
          />
        </div>
        <div className="lg:col-start-1 lg:col-end-3 mt-2">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="metaDescription" className="block text-xs font-medium text-gray-400">
              برچسب توضیحات (Meta Description)
            </label>
            <textarea
              name="metaDescription"
              id="metaDescription"
              rows="5"
              placeholder="هوشنگ مرادی کرمانی، نویسنده محبوب ایرانی، با آثار خود که بیشتر برای کودکان و نوجوانان شناخته شده است، و..."
              className="px-3 py-2 text-xs rounded-md outline-0 border border-gray-300 focus:border-gray-400"
              {...register("metaDescription")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoPart;
