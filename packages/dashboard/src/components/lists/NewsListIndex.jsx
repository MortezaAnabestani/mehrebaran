import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteNews, fetchNews } from "../../features/newsSlice";
import { useDispatch } from "react-redux";
import ConfirmDelete from "../createContent/ConfirmDelete";
import UTMLinkGeneratorForCards from "./UTMLinkGeneratorForCards";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";
import truncateText from "../../utils/truncateText";

const NewsListIndex = ({ news }) => {
  const dispatch = useDispatch();
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDeleteModal = (newsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedNews) {
      try {
        await dispatch(deleteNews(selectedNews._id)).unwrap();
        dispatch(fetchNews());
      } catch (error) {
        console.error("خطا در حذف خبر:", error);
      }
    }
    setIsModalOpen(false);
  };

  // بررسی وجود داده‌های اخبار
  const newsData = news?.data || [];

  if (newsData.length === 0) {
    return (
      <div className="mt-5 p-4">
        <p className="font-bold">هنوز خبری ثبت نشده است</p>
        <p className="mt-2">{`از این مسیر برای ثبت خبر اقدام کنید: اخبار ← ایجاد خبر جدید`}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop view */}
      <ul className="overflow-hidden hidden lg:block sm:rounded-md max-w-full lg:max-w-4xl mx-auto">
        {newsData.map((newsItem) => {
          return (
            <div key={newsItem?._id} className="w-full flex flex-col mb-5 min-h-[250px]">
              <div className="flex">
                <div className="flex flex-col items-center justify-between min-w-[100px] w-[100px] mx-w-[100px] px-2 bg-linear-to-r from-blue-300 via-blue-500 to-blue-600">
                  <Link rel="preconnect" prefetch={true} to={`edit/${newsItem._id}`}>
                    <img
                      className="w-30 h-40 mx-auto object-cover object-center rounded-b-full duration-700 cursor-pointer shadow-xl border-2 border-t-0 border-blue-200 hover:scale-105"
                      src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${newsItem?.featuredImage?.desktop}`}
                      alt={newsItem?.title}
                    />
                  </Link>
                  <div>
                    <span key={newsItem?.author?._id}>
                      <img
                        src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${newsItem?.author?.avatar}`}
                        alt={newsItem?.author?.name}
                        className="mx-auto h-15 w-12 mt-2 object-cover rounded-t-full duration-300 cursor-pointer border-2 border-b-0 border-blue-200"
                      />
                    </span>
                  </div>
                </div>
                <li
                  key={newsItem?._id}
                  className="border-gray-200 relative p-3 bg-white shadow-sm border rounded-sm flex-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col lg:flex-row justify-between items-center w-full">
                      <div className="flex flex-col justify-between gap-2 w-[25%]">
                        <div className="border-b border-gray-100 pb-1">
                          <h1 className="text-[10px] font-medium text-gray-400">
                            عنوان:
                            <span className="text-gray-800 font-semibold text-xs"> {newsItem?.title}</span>
                          </h1>
                        </div>
                        {newsItem?.subtitle && (
                          <div className="border-b border-gray-100 pb-1">
                            <h3 className="text-[10px] font-medium text-gray-400">
                              زیرعنوان:
                              <span className="text-gray-800 font-normal text-xs"> {newsItem?.subtitle}</span>
                            </h3>
                          </div>
                        )}
                        <div className="border-b border-gray-100 pb-1">
                          <h3 className="text-[10px] font-medium text-gray-400">
                            دسته‌بندی:
                            <span className="text-gray-800 font-normal text-xs"> {newsItem?.category?.name}</span>
                          </h3>
                        </div>
                        <p className="text-[10px] font-medium text-gray-400">
                          انتشار:
                          <span className="text-blue-600 text-xs">
                            {toPersianDigits(convertToPersianTime(newsItem?.createdAt, ` YYYY/MM/DD `))}
                          </span>
                        </p>
                        <p className="text-[10px] font-medium text-gray-400">
                          نویسنده: <span className="text-blue-600 text-xs"> {newsItem?.author?.name}</span>
                        </p>
                        <p className="text-[10px] font-medium text-gray-400">
                          بازدید: <span className="text-blue-600 text-xs"> {toPersianDigits(newsItem?.views || 0)}</span>
                        </p>
                      </div>
                      <div className="w-[65%] my-3">
                        <p className="text-[10px] my-2 text-justify font-medium bg-gray-100 p-1 text-gray-400">
                          خلاصه:
                          <span className="text-xs text-gray-900 leading-relaxed">
                            {newsItem?.excerpt?.substring(0, 200) + "..."}
                          </span>
                        </p>
                        <p className="text-[10px] my-2 text-justify font-medium text-gray-400">
                          متن خبر:
                          <span
                            className="text-xs text-gray-900 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: newsItem?.content?.substring(0, 300) + "..." }}
                          ></span>
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between w-[5%]">
                        <div className="flex flex-col gap-5 text-gray-500 pl-1">
                          <Link
                            rel="preconnect"
                            to={`edit/${newsItem._id}`}
                            className="relative group hover:scale-110 duration-200"
                          >
                            <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              ویرایش
                            </span>
                            <img
                              className="w-6 h-5"
                              src="/assets/images/dashboard/icons/replace.svg"
                              alt="edit icon"
                            />
                          </Link>
                          <Link
                            rel="preconnect"
                            onClick={() => openDeleteModal(newsItem)}
                            className="relative group hover:scale-110 duration-200"
                          >
                            <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              حذف
                            </span>
                            <img
                              className="w-5 h-4/5 mr-1"
                              src="/assets/images/dashboard/icons/trash.svg"
                              alt="delete icon"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {newsItem?.tags && newsItem.tags.length > 0 && (
                    <div className="absolute text-[9px] p-1 bottom-0 left-0 ltr w-full flex gap-2 items-center">
                      <img
                        loading="lazy"
                        src="/assets/images/dashboard/icons/tag_window.svg"
                        className="w-6 h-6"
                        alt="tag window icon"
                      />
                      {newsItem?.tags?.map((tag, index) => {
                        if (index <= 6) {
                          return (
                            <span
                              key={index}
                              className="bg-blue-500 text-white border border-blue-200 px-1 py-0.5 rounded-sm hover:translate-y-0.5"
                            >
                              {tag?.name}
                            </span>
                          );
                        }
                      })}
                    </div>
                  )}
                  <div className="absolute text-[10px] p-1 top-3 left-1 ltr">
                    <span
                      className={`px-2 py-1 text-white rounded-full shadow-xs ${
                        newsItem?.status === "published"
                          ? "bg-green-500 border-green-300"
                          : newsItem?.status === "draft"
                          ? "bg-yellow-500 border-yellow-300"
                          : "bg-gray-500 border-gray-300"
                      }`}
                    >
                      {newsItem?.status === "published"
                        ? "منتشر شده"
                        : newsItem?.status === "draft"
                        ? "پیش‌نویس"
                        : "بایگانی"}
                    </span>
                  </div>
                </li>
              </div>
              <UTMLinkGeneratorForCards page="news" slug={newsItem.slug} />
            </div>
          );
        })}
      </ul>

      {/* Mobile view */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
        {newsData.map((newsItem) => (
          <div key={newsItem._id} className="bg-white shadow-md rounded-lg flex flex-col gap-3">
            <div className="flex flex-col relative">
              <img
                className="w-full h-50 object-cover rounded-md rounded-b-none"
                src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${newsItem.featuredImage?.desktop}`}
                alt={newsItem.title}
              />
              <div className="absolute text-[10px] p-1 bottom-1 left-1 w-full flex gap-2 items-center">
                <div className="flex justify-between w-full mr-2">
                  <span
                    className={`px-2 py-1 text-white rounded-full shadow-xs ${
                      newsItem?.status === "published"
                        ? "bg-green-500"
                        : newsItem?.status === "draft"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {newsItem?.status === "published"
                      ? "منتشر شده"
                      : newsItem?.status === "draft"
                      ? "پیش‌نویس"
                      : "بایگانی"}
                  </span>
                  <span className="px-2 py-1 text-blue bg-white rounded-full shadow-xs border border-blue-400">
                    {newsItem?.author?.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-around h-40 p-2">
              <h1 className="text-xs font-medium text-gray-400">
                عنوان:
                <span className="text-gray-800 font-semibold mr-1 text-md">{newsItem.title}</span>
              </h1>
              {newsItem?.subtitle && (
                <h3 className="text-xs font-medium text-gray-400">
                  زیرعنوان:
                  <span className="text-gray-800 font-normal mr-1 text-sm">{newsItem.subtitle}</span>
                </h3>
              )}
              <p className="text-xs font-medium text-gray-400">
                دسته‌بندی: <span className="text-blue-600 text-sm">{newsItem?.category?.name}</span>
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-gray-400">
                  تاریخ انتشار:
                  <span className="text-blue-600 text-sm">
                    {toPersianDigits(convertToPersianTime(newsItem?.createdAt))}
                  </span>
                </p>
                <p className="text-xs font-medium text-gray-400">
                  بازدید: <span className="text-blue-600 text-sm">{toPersianDigits(newsItem?.views || 0)}</span>
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 px-2">
                متن:{" "}
                <span className="text-sm text-justify">
                  {truncateText(newsItem?.content?.substring(0, 150) + "...")}
                </span>
              </p>
            </div>
            <div className="flex justify-between gap-2 mt-3 px-1">
              <Link
                rel="preconnect"
                to={`edit/${newsItem._id}`}
                className="flex-1 text-center text-sm bg-white text-black border border-gray-500 py-2 rounded-md hover:border-gray-600"
              >
                ویرایش
              </Link>
              <Link
                rel="preconnect"
                onClick={() => openDeleteModal(newsItem)}
                className="flex-1 text-center text-sm text-white bg-red-500 py-2 rounded-md hover:bg-red-600"
              >
                حذف
              </Link>
            </div>
            <UTMLinkGeneratorForCards page="news" slug={newsItem.slug} />
          </div>
        ))}
      </div>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`آیا از حذف خبر «${selectedNews?.title}» مطمئن هستید؟`}
      />
    </div>
  );
};

export default NewsListIndex;
