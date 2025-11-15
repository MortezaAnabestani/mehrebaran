import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteArticle, fetchArticles } from "../../features/articlesSlice";
import { useDispatch } from "react-redux";
import ConfirmDelete from "../createContent/ConfirmDelete";
import UTMLinkGeneratorForCards from "./UTMLinkGeneratorForCards";
import { toPersianDigits } from "../../utils/useConvertNumbersToPersian";
import { convertToPersianTime } from "../../utils/convertTime";
import truncateText from "../../utils/truncateText";

const ArticlesListIndex = ({ articles }) => {
  const dispatch = useDispatch();
  const [selectedThing, setSelectedThing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDeleteModal = (article) => {
    setSelectedThing(article);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedThing) {
      try {
        await dispatch(deleteArticle(selectedThing.slug)).unwrap();
        dispatch(fetchArticles());
      } catch (error) {
        console.error(" خطا در حذف مقاله:", error);
      }
    }
    setIsModalOpen(false);
  };

  // بررسی وجود داده‌های مقالات
  const articlesData = articles?.articles || [];

  if (articlesData.length === 0) {
    return (
      <div className="mt-5 p-4">
        <p className="font-bold">هنوز مقاله‌ای ثبت نشده است</p>
        <p className="mt-2">{`از این مسیر برای ثبت مقاله اقدام کنید: مقاله ← ایجاد مقالۀ جدید `}</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="overflow-hidden hidden lg:block sm:rounded-md max-w-full lg:max-w-4xl mx-auto">
        {articlesData.map((article) => {
          return (
            <div key={article?._id} className="w-full flex flex-col mb-5 min-h-[290px]">
              <div className="flex">
                <div className="flex flex-col items-center justify-between min-w-[100px] w-[100px] mx-w-[100px] px-2 bg-linear-to-r from-red-300 via-red-500 to-red-600">
                  <Link rel="preconnect" prefetch={true} to={`edit/${article.slug}`}>
                    <img
                      className="w-30 h-40 mx-auto object-cover object-right-bottom rounded-b-full duration-700 cursor-pointer shadow-xl border-2 border-t-0 border-red-200 hover:object-left-top"
                      src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${article?.coverImage}`}
                      alt={article?.title}
                    />
                  </Link>
                  <div>
                    <span key={article?.author?._id}>
                      <img
                        src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${
                          article?.author?.avatar
                        }`}
                        alt={article?.author?.name}
                        className="mx-auto h-15 w-12 mt-2 object-cover rounded-t-full duration-300 cursor-pointer border-2 border-b-0 border-red-200 hover:hover:object-right-bottom"
                      />
                    </span>
                  </div>
                </div>
                <li
                  key={article?._id}
                  className="border-gray-200 relative p-3 bg-white shadow-sm border rounded-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col lg:flex-row justify-between items-center">
                      <div className="flex flex-col justify-between gap-2 w-[20%]">
                        <div className="border-b border-gray-100 pb-1">
                          <h1 className="text-[10px] font-medium text-gray-400">
                            عنوان:
                            <span className="text-gray-800 font-semibold text-xs"> {article?.title}</span>
                          </h1>
                        </div>
                        <div className="border-b border-gray-100 pb-1">
                          <h3 className="text-[10px] font-medium text-gray-400">
                            <span className="rotate-45">زیرعنوان:</span>
                            <span className="text-gray-800 font-normal  text-xs"> {article?.subTitle}</span>
                          </h3>
                        </div>
                        <div className="border-b border-gray-100 pb-1">
                          <h3 className="text-[10px] font-medium text-gray-400">
                            دسته‌بندی:
                            <span className="text-gray-800 font-normal text-xs">{article?.category?.name || 'بدون دسته‌بندی'}</span>
                          </h3>
                        </div>
                        <p className="text-[10px] font-medium text-gray-400">
                          وضعیت: <span className="text-red-600 text-xs"> {article?.status === 'published' ? 'منتشر شده' : article?.status === 'draft' ? 'پیش‌نویس' : 'بایگانی'}</span>
                        </p>
                        <p className="text-[10px] font-medium text-gray-400">
                          انتشار:
                          <span className="text-red-600 text-xs">
                            {toPersianDigits(convertToPersianTime(article?.createdAt, ` YYYY/MM/DD `))}
                          </span>
                        </p>
                        <p className="text-[10px] font-medium text-gray-400">
                          نویسنده: <span className="text-red-600 text-xs"> {article?.author?.name}</span>
                        </p>
                      </div>
                      <div className="w-[65%] my-3">
                        <p className="text-[10px] my-2 text-justify font-medium bg-gray-100 p-1 text-gray-400">
                          پاراگراف برگزیده:
                          <span className="text-xs text-gray-900 leading-relaxed">
                            {article?.excerpt?.substring(0, 300) + "..."}
                          </span>
                        </p>
                        <p className="text-[10px] my-2 text-justify font-medium text-gray-400">
                          متن مقاله:
                          <span
                            className="text-xs text-gray-900 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: article?.content?.substring(0, 405) + "..." }}
                          ></span>
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between w-[5%]">
                        <div className="flex flex-col gap-5 text-gray-500 pl-1">
                          <Link
                            rel="preconnect"
                            target="_blank"
                            prefetch={true}
                            to={`https://vaqayet.com/article/${article.slug}`}
                            className="relative group  hover:scale-110 duration-200"
                          >
                            <span className="absolute top-[-17px] left-[11px] transform -translate-x-1/2 text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              دیدن
                            </span>
                            <img
                              className="w-6 h-5"
                              src="/assets/images/dashboard/icons/eye.svg"
                              alt="eye icon"
                            />
                          </Link>
                          <Link
                            rel="preconnect"
                            to={`edit/${article.slug}`}
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
                            onClick={() => openDeleteModal(article)}
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

                  <div className="absolute text-[9px] p-1 bottom-0 left-0 ltr w-full flex gap-2 items-center">
                    <img
                      loading="lazy"
                      src="/assets/images/dashboard/icons/tag_window.svg"
                      className="w-6 h-6"
                      alt="teg window icon"
                    />
                    {article?.tags?.map((tag, index) => {
                      if (index <= 6) {
                        return (
                          <span
                            key={index}
                            className="bg-gray-500 text-white border border-gray-200 px-1 py-0.5 rounded-sm hover:translate-y-0.5 "
                          >
                            {tag?.name}
                          </span>
                        );
                      }
                    })}
                  </div>
                  <div className="absolute text-[10px] p-1 top-3 left-1 ltr w-full flex gap-2 items-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="px-2 py-1 text-white bg-blue-500 rounded-full shadow-xs border border-blue-200 shadow-gray-400 hover:scale-95 cursor-grab duration-200">
                        {article?.category?.name || 'بدون دسته‌بندی'}
                      </span>
                    </div>
                  </div>
                </li>
              </div>
              <UTMLinkGeneratorForCards page="article" slug={article.slug} />
            </div>
          );
        })}
      </ul>
      {/* Content List mobile sizes*/}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
        {articlesData.map((article) => (
          <div key={article._id} className="bg-white shadow-md rounded-lg flex flex-col gap-3">
            <div className="flex flex-col relative">
              <img
                className="w-full h-50 object-cover rounded-md rounded-b-none"
                src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${article.coverImage}`}
                alt={article.title}
              />
              <div className="absolute text-[10px] p-1 bottom-1 left-1 w-full flex gap-2 items-center">
                <div className="flex flex-col items-center w-[350px]">
                  <div className="flex justify-between w-full mr-2">
                    <span className="px-2 py-1 text-white bg-blue-500 rounded-full shadow-xs border border-blue-400 shadow-blue-300 hover:scale-95 cursor-grab duration-200">
                      {article?.category?.name || 'بدون دسته‌بندی'}
                    </span>
                    <span className="px-2 py-1 text-red bg-white rounded-full shadow-xs border border-red-400 hover:scale-95 cursor-grab duration-200">
                      {article?.author?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-around h-40 p-2">
              <h1 className="text-xs font-medium text-gray-400">
                عنوان اصلی:
                <span className="text-gray-800 font-semibold mr-1 text-md">{article.title}</span>
              </h1>
              <h3 className="text-xs font-medium text-gray-400">
                عنوان فرعی:
                <span className="text-gray-800 font-normal mr-1 text-sm">{article.subTitle}</span>
              </h3>
              <p className="text-xs font-medium text-gray-400">
                دسته‌بندی: <span className="text-blue-600 text-sm">{article?.category?.name || 'بدون دسته‌بندی'}</span>
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-gray-400">
                  تاریخ انتشار:
                  <span className="text-red-600 text-sm">
                    {toPersianDigits(convertToPersianTime(article?.createdAt))}
                  </span>
                </p>
                <p className="text-xs font-medium text-gray-400">
                  وضعیت: <span className="text-red-600 text-sm">{article?.status === 'published' ? 'منتشر شده' : article?.status === 'draft' ? 'پیش‌نویس' : 'بایگانی'}</span>
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 px-2">
                متن:{" "}
                <span className="text-sm text-justify">
                  {truncateText(article?.content?.substring(0, 200) + "...")}
                </span>
              </p>
            </div>
            <div className="flex justify-between gap-2 mt-3 px-1">
              <Link
                rel="preconnect"
                target="_blank"
                to={`https://vaqayet.com/article/${article.slug}`}
                className="flex-1 text-center text-sm text-white bg-gray-500 py-2 rounded-md hover:bg-gray-800"
              >
                دیدن
              </Link>
              <Link
                rel="preconnect"
                to={`edit/${article.slug}`}
                className="flex-1 text-center text-sm bg-white text-black border border-gray-500 py-2 rounded-md hover:border-gray-600"
              >
                ویرایش
              </Link>
              <Link
                rel="preconnect"
                onClick={() => openDeleteModal(article)}
                className="flex-1 text-center text-sm text-white bg-red-500 py-2 rounded-md hover:bg-red-600"
              >
                حذف
              </Link>
            </div>
            <UTMLinkGeneratorForCards page="article" slug={article.slug} />
          </div>
        ))}
      </div>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`آیا از حذف مقالۀ ${selectedThing?.title} مطمئن هستید؟`}
      />
    </div>
  );
};

export default ArticlesListIndex;
